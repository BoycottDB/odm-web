import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { Decision } from '@/types';

// Une décision affiche la controverse telle qu'elle est publiée aujourd'hui, pas le texte du signalement :
// - approuvée : titre, source et marque actuels de la controverse créée (masquée si elle a été supprimée depuis) ;
// - refusée : marque et justification seulement, pour ne pas republier une accusation jugée infondée.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: propositions, error } = await supabaseAdmin
      .from('Proposition')
      .select('id, marque_nom, statut, commentaire_admin, updated_at')
      .in('statut', ['approuve', 'rejete'])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des décisions:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des décisions' },
        { status: 500 }
      );
    }

    const approuveIds = (propositions || [])
      .filter(prop => prop.statut === 'approuve')
      .map(prop => prop.id);

    const { data: evenements, error: evenementsError } = await supabaseAdmin
      .from('Evenement')
      .select('proposition_source_id, titre, source_url, marque:Marque!marque_id (nom)')
      .in('proposition_source_id', approuveIds);

    if (evenementsError) {
      console.error('Erreur lors de la récupération des controverses publiées:', evenementsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des décisions' },
        { status: 500 }
      );
    }

    const evenementParProposition = new Map(
      (evenements || []).map(evenement => [evenement.proposition_source_id, evenement])
    );

    const decisions: Decision[] = [];
    for (const prop of propositions || []) {
      if (prop.statut === 'rejete') {
        decisions.push({
          id: prop.id,
          marque_nom: prop.marque_nom,
          statut: 'rejete',
          commentaire_admin: prop.commentaire_admin,
          date: prop.updated_at
        });
        continue;
      }

      const evenement = evenementParProposition.get(prop.id);
      if (!evenement) continue;

      const marque = evenement.marque as unknown as { nom: string } | null;
      decisions.push({
        id: prop.id,
        titre: evenement.titre,
        marque_nom: marque?.nom || prop.marque_nom,
        statut: 'approuve',
        commentaire_admin: prop.commentaire_admin,
        source_url: evenement.source_url || undefined,
        date: prop.updated_at
      });
    }

    return NextResponse.json(decisions.slice(offset, offset + limit));
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
