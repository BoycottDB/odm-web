import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { validateMarqueCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET() {
  try {
    const { data: marques, error } = await supabase
      .from('Marque')
      .select('*');
    if (error) throw error;
    return NextResponse.json(marques);
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
    const { data: existingMarque, error: findError } = await supabase
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
    const { data: marque, error: createError } = await supabase
      .from('Marque')
      .insert([validation.data!])
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
