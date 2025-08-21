import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { Beneficiaire, BeneficiaireRelation } from '@/types';

interface ChaineNode {
  beneficiaire: Beneficiaire;
  niveau: number;
  relations_suivantes: BeneficiaireRelation[];
}

interface ChaineBeneficiaires {
  marque_nom: string;
  marque_id: number;
  chaine: ChaineNode[];
  profondeur_max: number;
}

/**
 * Algorithme récursif pour construire la chaîne de bénéficiaires
 * Suit les relations financières de marque en marque jusqu'aux bénéficiaires finaux
 */
async function construireChaineRecursive(
  beneficiaireId: number,
  niveauActuel: number,
  visitedIds: Set<number>,
  profondeurMax: number = 5
): Promise<ChaineNode[]> {
  // Éviter les cycles infinis et limiter la profondeur
  if (niveauActuel >= profondeurMax || visitedIds.has(beneficiaireId)) {
    return [];
  }

  // Marquer ce bénéficiaire comme visité
  visitedIds.add(beneficiaireId);

  // Récupérer le bénéficiaire actuel
  const { data: beneficiaire, error: beneficiaireError } = await supabaseAdmin
    .from('Beneficiaires')
    .select(`
      id,
      nom,
      impact_generique,
      type_beneficiaire,
      created_at,
      updated_at,
      controverses:controverse_beneficiaire(*)
    `)
    .eq('id', beneficiaireId)
    .single();

  if (beneficiaireError || !beneficiaire) {
    visitedIds.delete(beneficiaireId);
    return [];
  }

  // Récupérer les relations suivantes (ce bénéficiaire profite à qui ?)
  const { data: relations } = await supabaseAdmin
    .from('beneficiaire_relation')
    .select(`
      id,
      beneficiaire_source_id,
      beneficiaire_cible_id,
      description_relation,
      created_at,
      updated_at
    `)
    .eq('beneficiaire_source_id', beneficiaireId);

  const relationsSuivantes: BeneficiaireRelation[] = (relations || []).map((rel: Record<string, unknown>) => ({
    id: rel.id as number,
    beneficiaire_source_id: rel.beneficiaire_source_id as number,
    beneficiaire_cible_id: rel.beneficiaire_cible_id as number,
    type_relation: 'actionnaire', // Valeur par défaut pour compatibilité
    description_relation: rel.description_relation as string,
    pourcentage_participation: undefined, // Pas encore disponible
    created_at: rel.created_at as string,
    updated_at: rel.updated_at as string
  }));

  // Créer le nœud actuel
  const nodeActuel: ChaineNode = {
    beneficiaire: {
      id: beneficiaire.id,
      nom: beneficiaire.nom,
      controverses: beneficiaire.controverses || [],
      impact_generique: beneficiaire.impact_generique,
      type_beneficiaire: beneficiaire.type_beneficiaire,
      created_at: beneficiaire.created_at,
      updated_at: beneficiaire.updated_at
    },
    niveau: niveauActuel,
    relations_suivantes: relationsSuivantes
  };

  // Résultat de la chaîne commençant par ce nœud
  const resultat = [nodeActuel];

  // Récursivement construire les chaînes suivantes
  for (const relation of relationsSuivantes) {
    if (relation.beneficiaire_cible_id && !visitedIds.has(relation.beneficiaire_cible_id)) {
      const chainesSuivantes = await construireChaineRecursive(
        relation.beneficiaire_cible_id,
        niveauActuel + 1,
        new Set(visitedIds), // Nouvelle copie pour chaque branche
        profondeurMax
      );
      resultat.push(...chainesSuivantes);
    }
  }

  visitedIds.delete(beneficiaireId);
  return resultat;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marqueId = searchParams.get('marqueId');
  const profondeurMax = parseInt(searchParams.get('profondeur') || '5');

  if (!marqueId) {
    return NextResponse.json({ error: 'ID de marque requis' }, { status: 400 });
  }

  try {
    // 1. Récupérer la marque
    const { data: marque, error: marqueError } = await supabaseAdmin
      .from('Marque')
      .select('id, nom')
      .eq('id', parseInt(marqueId))
      .single();

    if (marqueError || !marque) {
      return NextResponse.json({ error: 'Marque non trouvée' }, { status: 404 });
    }

    // 2. Récupérer les bénéficiaires directs de cette marque
    const { data: liaisonsBeneficiaires, error: liaisonsError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select(`
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        Beneficiaires!marque_beneficiaire_beneficiaire_id_fkey (
          id,
          nom,
          impact_generique,
          type_beneficiaire,
          controverses:controverse_beneficiaire(*)
        )
      `)
      .eq('marque_id', parseInt(marqueId));

    if (liaisonsError) {
      console.error('Erreur récupération liaisons bénéficiaires:', liaisonsError);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    if (!liaisonsBeneficiaires || liaisonsBeneficiaires.length === 0) {
      return NextResponse.json({
        marque_nom: marque.nom,
        marque_id: marque.id,
        chaine: [],
        profondeur_max: 0
      });
    }

    // 3. Pour chaque bénéficiaire direct, construire sa chaîne complète
    const chainesCompletes: ChaineBeneficiaires[] = [];

    for (const liaison of liaisonsBeneficiaires) {
      if (!liaison.beneficiaire_id) continue;

      const chaine = await construireChaineRecursive(
        liaison.beneficiaire_id,
        0, // Niveau 0 pour le bénéficiaire direct
        new Set<number>(),
        profondeurMax
      );

      if (chaine.length > 0) {
        chainesCompletes.push({
          marque_nom: marque.nom,
          marque_id: marque.id,
          chaine,
          profondeur_max: Math.max(...chaine.map(node => node.niveau))
        });
      }
    }

    // 4. Fusionner toutes les chaînes et retourner le résultat
    const chaineFusionnee = chainesCompletes.reduce((acc, chaine) => {
      acc.push(...chaine.chaine);
      return acc;
    }, [] as ChaineNode[]);

    // Supprimer les doublons par ID de bénéficiaire
    const chaineUnique = chaineFusionnee.filter((node, index, array) => 
      array.findIndex(n => n.beneficiaire.id === node.beneficiaire.id) === index
    );

    // Trier par niveau puis par nom
    chaineUnique.sort((a, b) => {
      if (a.niveau !== b.niveau) return a.niveau - b.niveau;
      return a.beneficiaire.nom.localeCompare(b.beneficiaire.nom);
    });

    const resultat: ChaineBeneficiaires = {
      marque_nom: marque.nom,
      marque_id: marque.id,
      chaine: chaineUnique,
      profondeur_max: chaineUnique.length > 0 ? Math.max(...chaineUnique.map(node => node.niveau)) : 0
    };

    return NextResponse.json(resultat);
  } catch (error) {
    console.error('Erreur API chaîne bénéficiaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}