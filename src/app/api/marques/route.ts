import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { validateMarqueCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query = supabase
      .from('Marque')
      .select(`
        *,
        marque_dirigeant!marque_id (
          id,
          dirigeant_id,
          lien_financier,
          impact_specifique,
          created_at,
          updated_at,
          dirigeant:dirigeant_id (
            id,
            nom,
            controverses,
            sources,
            impact_generique
          )
        ),
        SecteurMarque!secteur_marque_id (
          id,
          nom,
          description,
          message_boycott_tips,
          created_at,
          updated_at
        )
      `);
    
    if (search) {
      query = query.ilike('nom', `%${search}%`);
    }
    
    const { data: marques, error } = await query;
    if (error) throw error;
    
    
    // Transformation pour adapter aux types frontend
    const marquesWithDirigent = marques.map(marque => {
      let dirigeant_controverse = null;
      
      // marque_dirigeant est un array, prendre le premier élément
      const dirigeantLiaison = marque.marque_dirigeant?.[0];
      
      if (dirigeantLiaison && dirigeantLiaison.dirigeant) {
        // Transformer en format compatible avec l'ancien type + ajouter dirigeant_id
        dirigeant_controverse = {
          id: dirigeantLiaison.id,
          marque_id: marque.id,
          dirigeant_id: dirigeantLiaison.dirigeant.id, // Ajouter l'ID du dirigeant
          dirigeant_nom: dirigeantLiaison.dirigeant.nom,
          controverses: dirigeantLiaison.dirigeant.controverses,
          lien_financier: dirigeantLiaison.lien_financier,
          impact_description: dirigeantLiaison.impact_specifique || dirigeantLiaison.dirigeant.impact_generique || '',
          sources: dirigeantLiaison.dirigeant.sources,
          created_at: dirigeantLiaison.created_at,
          updated_at: dirigeantLiaison.updated_at
        };
      }
      
      return {
        ...marque,
        dirigeant_controverse,
        secteur_marque: marque.SecteurMarque || null
      };
    });
    
    return NextResponse.json(marquesWithDirigent);
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
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

    const { data: updatedMarque, error } = await supabaseAdmin
      .from('Marque')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        marque_dirigeant!marque_id (
          id,
          dirigeant_nom,
          controverses,
          lien_financier,
          impact_description,
          sources,
          created_at,
          updated_at
        ),
        SecteurMarque!secteur_marque_id (
          id,
          nom,
          description,
          message_boycott_tips,
          created_at,
          updated_at
        )
      `)
      .single();

    if (error) throw error;

    // Transformation pour adapter aux types frontend
    const marqueWithDirigent = {
      ...updatedMarque,
      dirigeant_controverse: updatedMarque.marque_dirigeant || null,
      secteur_marque: updatedMarque.SecteurMarque || null
    };

    return NextResponse.json(marqueWithDirigent);
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

    // Vérifier si la marque existe déjà
    const { data: existingMarque, error: findError } = await supabaseAdmin
      .from('Marque')
      .select('*')
      .eq('nom', validation.data!.nom)
      .maybeSingle();
    if (findError) throw findError;

    if (existingMarque) {
      return NextResponse.json(
        { error: 'Cette marque existe déjà' },
        { status: 409 }
      );
    }

    // Créer la marque
    const { data: marque, error: createError } = await supabaseAdmin
      .from('Marque')
      .insert([validation.data!])
      .select()
      .single();
    if (createError) throw createError;
    return NextResponse.json(marque, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la marque:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
