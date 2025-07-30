import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { validateEvenementCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Evenement')
      .select('*, Marque(*)')
      .order('date', { ascending: false });
    if (error) throw error;
    // Normalisation de la clé 'Marque' -> 'marque' pour compatibilité front
    const normalized = (data ?? []).map(ev => ({
      ...ev,
      marque: ev.Marque,
      Marque: undefined
    }));
    return NextResponse.json(normalized);
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

    // Vérifier que la marque existe
    const { data: marque, error: marqueError } = await supabase
      .from('Marque')
      .select('*')
      .eq('id', validation.data!.marqueId)
      .single();

    if (marqueError || !marque) {
      return NextResponse.json(
        { error: 'Marque introuvable' },
        { status: 404 }
      );
    }

    // Créer l'événement
    const { data: evenement, error: eventError } = await supabase
      .from('Evenement')
      .insert([
        {
          ...validation.data!,
          date: validation.data!.date // Assure-toi que c'est bien un format ISO ou Date compatible
        }
      ])
      .select('*, Marque(*)')
      .single();

    if (eventError) {
      throw eventError;
    }

    return NextResponse.json(evenement, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
