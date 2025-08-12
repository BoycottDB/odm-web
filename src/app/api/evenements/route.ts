import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateEvenementCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Direct Supabase query - API routes should not use dataService
    let query = supabaseAdmin
      .from('Evenement')
      .select(`
        *,
        marque:Marque!inner(*),
        categorie:Categorie!Evenement_categorie_id_fkey(*)
      `)
      .order('date', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }
    
    const { data: evenements, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(evenements || [], {
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = validateEvenementCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier que la marque existe - Direct Supabase query
    const { data: marque, error: marqueError } = await supabaseAdmin
      .from('Marque')
      .select('id, nom')
      .eq('id', validation.data!.marque_id)
      .single();

    if (marqueError || !marque) {
      return NextResponse.json(
        { error: 'Marque introuvable' },
        { status: 404 }
      );
    }

    // Créer l'événement - Direct Supabase
    const { data: evenement, error: evenementError } = await supabaseAdmin
      .from('Evenement')
      .insert([validation.data!])
      .select()
      .single();
    
    if (evenementError) throw evenementError;

    return NextResponse.json(evenement, { 
      status: 201,
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
