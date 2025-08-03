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
          dirigeant_nom,
          controverses,
          lien_financier,
          impact_description,
          sources,
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
    const marquesWithDirigent = marques.map(marque => ({
      ...marque,
      dirigeant_controverse: marque.marque_dirigeant || null
    }));
    
    return NextResponse.json(marquesWithDirigent);
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques' },
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
