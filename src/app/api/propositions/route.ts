import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validatePropositionCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET(req: NextRequest) {
  // Vérification admin pour GET (accès au listing des propositions)
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { data: propositions, error } = await supabaseAdmin
      .from('Proposition')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(propositions);
  } catch (error) {
    console.error('Erreur lors de la récupération des propositions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des propositions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = validatePropositionCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Créer la proposition
    const propositionData = {
      type: validation.data!.type,
      data: validation.data!.data,
      statut: 'en_attente',
      decision_publique: false
    };

    const { data: proposition, error: createError } = await supabaseAdmin
      .from('Proposition')
      .insert([propositionData])  
      .select()
      .single();
    
    if (createError) throw createError;
    
    return NextResponse.json(proposition, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la proposition:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}