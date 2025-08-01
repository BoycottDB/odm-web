import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage } from '@/lib/utils/helpers';
import { DecisionPublique } from '@/types';

export async function GET() {
  try {
    const { data: propositions, error } = await supabase
      .from('Proposition')
      .select('*')
      .eq('decision_publique', true)
      .in('statut', ['approuve', 'rejete'])
      .order('updated_at', { ascending: false });
    
    if (error) throw error;

    // Transformer les propositions en décisions publiques
    const decisionsPubliques: DecisionPublique[] = propositions.map(proposition => {
      let titre = '';
      
      if (proposition.type === 'marque') {
        titre = `Marque: ${proposition.data.nom}`;
      } else {
        titre = `Événement: ${proposition.data.marque_nom} - ${proposition.data.description.substring(0, 50)}...`;
      }

      return {
        id: proposition.id,
        type: proposition.type,
        titre,
        statut: proposition.statut,
        commentaire_admin: proposition.commentaire_admin || '',
        date: proposition.updated_at
      };
    });
    
    return NextResponse.json(decisionsPubliques);
  } catch (error) {
    console.error('Erreur lors de la récupération des décisions publiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des décisions publiques' },
      { status: 500 }
    );
  }
}