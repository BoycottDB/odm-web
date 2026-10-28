import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateAutresNoms, validateMarqueCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';
import { slugify } from '@/lib/slug';

/**
 * Premier autre nom dont l'adresse (/marques/<slug>) est déjà prise par une marque
 * ou par l'autre nom d'une autre marque ; null si aucun conflit
 */
async function conflitAutresNoms(marqueId: number, noms: string[]): Promise<string | null> {
  const [{ data: marques, error: marquesError }, { data: autresNoms, error: autresError }] = await Promise.all([
    supabaseAdmin.from('Marque').select('id, nom'),
    supabaseAdmin.from('marque_autre_nom').select('marque_id, nom').neq('marque_id', marqueId),
  ]);
  if (marquesError) throw marquesError;
  if (autresError) throw autresError;

  for (const nom of noms) {
    const slug = slugify(nom);
    const marque = marques?.find((m) => slugify(m.nom) === slug);
    if (marque) return `« ${nom} » correspond déjà à la marque ${marque.nom}`;
    const autre = autresNoms?.find((a) => slugify(a.nom) === slug);
    if (autre) {
      const proprietaire = marques?.find((m) => m.id === autre.marque_id);
      return `« ${nom} » est déjà un autre nom de la marque ${proprietaire?.nom ?? autre.marque_id}`;
    }
  }
  return null;
}

/**
 * GET /api/marques - ADMIN ONLY
 * Accès direct Supabase avec tous les champs pour l'administration
 * Pour consultation publique, utiliser dataService.getMarquesStats() dans Server Components
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Ajouter vérification auth admin ici
    // const isAdmin = await checkAdminAuth(request);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Query Supabase directly - Accès complet pour administration
    let query = supabaseAdmin
      .from('Marque')
      .select(`
        *,
        evenements:Evenement(*),
        secteur_marque:SecteurMarque!secteur_marque_id(*),
        beneficiaires_marque:Marque_beneficiaire(
          id,
          lien_financier,
          beneficiaire:Beneficiaires!marque_beneficiaire_beneficiaire_id_fkey(*)
        ),
        marque_autre_nom(nom)
      `);

    if (search) {
      query = query.ilike('nom', `%${search}%`);
    }

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data: marques, error } = await query;

    if (error) throw error;

    // Autres noms à plat, comme dans odm-api
    const marquesAvecAutresNoms = (marques || []).map(({ marque_autre_nom, ...marque }) => ({
      ...marque,
      autres_noms: (marque_autre_nom as Array<{ nom: string }>).map((autre) => autre.nom),
    }));

    return NextResponse.json(marquesAvecAutresNoms, {
      headers: {
        'X-Data-Source': 'direct-supabase-admin',
        'X-Warning': 'Admin endpoint - use dataService for public access'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des marques (admin):', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, secteur_marque_id, message_boycott_tips, autres_noms } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la marque est requis' },
        { status: 400 }
      );
    }

    // Autres noms : vérifiés avant toute écriture, puis remplacés en entier
    if (autres_noms !== undefined) {
      const validation = validateAutresNoms(autres_noms);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Données invalides', details: validation.errors },
          { status: 400 }
        );
      }

      const conflit = await conflitAutresNoms(id, validation.data!);
      if (conflit) {
        return NextResponse.json({ error: conflit }, { status: 409 });
      }

      const { error: suppressionError } = await supabaseAdmin
        .from('marque_autre_nom')
        .delete()
        .eq('marque_id', id);
      if (suppressionError) throw suppressionError;

      if (validation.data!.length > 0) {
        const { error: ajoutError } = await supabaseAdmin
          .from('marque_autre_nom')
          .insert(validation.data!.map((nom) => ({ marque_id: id, nom })));
        if (ajoutError) throw ajoutError;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (secteur_marque_id !== undefined) updateData.secteur_marque_id = secteur_marque_id;
    if (message_boycott_tips !== undefined) updateData.message_boycott_tips = message_boycott_tips;

    // Update directly via Supabase (simple lecture si seuls les autres noms changent)
    const { data: updatedMarque, error } = Object.keys(updateData).length > 0
      ? await supabaseAdmin.from('Marque').update(updateData).eq('id', id).select().single()
      : await supabaseAdmin.from('Marque').select().eq('id', id).single();

    if (error) throw error;

    return NextResponse.json(updatedMarque, {
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la marque' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = validateMarqueCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier si la marque existe déjà (direct Supabase query)
    const { data: existingMarques, error: searchError } = await supabaseAdmin
      .from('Marque')
      .select('id, nom')
      .ilike('nom', validation.data!.nom);

    if (searchError) throw searchError;

    const existingMarque = existingMarques?.find(m => 
      m.nom.toLowerCase() === validation.data!.nom.toLowerCase()
    );

    if (existingMarque) {
      return NextResponse.json(
        { error: 'Cette marque existe déjà' },
        { status: 409 }
      );
    }

    // Le nom ne doit pas être l'autre nom d'une marque : il mène déjà à sa page
    const { data: autresNoms, error: autresError } = await supabaseAdmin
      .from('marque_autre_nom')
      .select('nom, marque:Marque!marque_id(nom)');

    if (autresError) throw autresError;

    const autreNom = autresNoms?.find(a => slugify(a.nom) === slugify(validation.data!.nom));
    if (autreNom) {
      const marqueDuNom = autreNom.marque as unknown as { nom: string } | null;
      return NextResponse.json(
        { error: `« ${autreNom.nom} » est déjà un autre nom de la marque ${marqueDuNom?.nom ?? ''}`.trim() },
        { status: 409 }
      );
    }

    // Créer la marque (direct Supabase)
    const { data: marque, error } = await supabaseAdmin
      .from('Marque')
      .insert([validation.data!])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(marque, { 
      status: 201,
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la marque:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
