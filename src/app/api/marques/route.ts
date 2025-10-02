import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateMarqueCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

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
          impact_specifique,
          beneficiaire:Beneficiaires!marque_beneficiaire_beneficiaire_id_fkey(*)
        )
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

    return NextResponse.json(marques || [], {
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
    const { id, secteur_marque_id, message_boycott_tips } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la marque est requis' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (secteur_marque_id !== undefined) updateData.secteur_marque_id = secteur_marque_id;
    if (message_boycott_tips !== undefined) updateData.message_boycott_tips = message_boycott_tips;

    // Update directly via Supabase
    const { data: updatedMarque, error } = await supabaseAdmin
      .from('Marque')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

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
