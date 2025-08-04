import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { DecisionPublique } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Récupérer les propositions avec décision publique (approuvées ou rejetées)
    const { data: propositions, error } = await supabase
      .from('Proposition')
      .select(`
        id,
        titre_controverse,
        marque_nom,
        statut,
        commentaire_admin,
        source_url,
        updated_at
      `)
      .eq('decision_publique', true)
      .in('statut', ['approuve', 'rejete'])
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erreur lors de la récupération des décisions:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des décisions' },
        { status: 500 }
      );
    }

    // Transformer les données en format DecisionPublique
    const decisions: DecisionPublique[] = (propositions || []).map(prop => ({
      id: prop.id,
      titre: prop.titre_controverse,
      marque_nom: prop.marque_nom,
      statut: prop.statut as 'approuve' | 'rejete',
      commentaire_admin: prop.commentaire_admin,
      source_url: prop.source_url,
      date: prop.updated_at
    }));

    return NextResponse.json(decisions);
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}