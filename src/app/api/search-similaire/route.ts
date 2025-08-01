import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getErrorMessage, normalizeString } from '@/lib/utils/helpers';
import { SimilarityScore, Marque, Evenement } from '@/types';

// Seuils de similarité définis dans le devbook
const SIMILARITY_THRESHOLDS = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4
};

// Calcul de la distance de Levenshtein pour la similarité des chaînes
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  const n = str1.length;
  const m = str2.length;

  if (n === 0) return m;
  if (m === 0) return n;

  for (let i = 0; i <= m; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[m][n];
}

// Calcul du score de similarité entre deux chaînes (0-1)
function calculateStringSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  if (normalized1 === normalized2) return 1;
  if (normalized1.length === 0 || normalized2.length === 0) return 0;
  
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  
  return 1 - (distance / maxLength);
}

// Calcul de la proximité temporelle (0-1)
function calculateDateSimilarity(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInDays = Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
    
    // Si les dates sont dans la même année, score élevé
    if (d1.getFullYear() === d2.getFullYear()) {
      if (diffInDays <= 30) return 0.9; // Même mois
      if (diffInDays <= 90) return 0.7; // Même trimestre
      return 0.5; // Même année
    }
    
    // Sinon, score basé sur la différence en années
    const yearDiff = Math.abs(d1.getFullYear() - d2.getFullYear());
    return Math.max(0, 0.3 - (yearDiff * 0.1));
  } catch {
    return 0;
  }
}

// Calcul du score de similarité global
function calculateSimilarityScore(
  marqueQuery: string,
  marqueTarget: string,
  descriptionQuery?: string,
  descriptionTarget?: string,
  dateQuery?: string,
  dateTarget?: string
): SimilarityScore {
  const marqueScore = calculateStringSimilarity(marqueQuery, marqueTarget);
  
  const descriptionScore = descriptionQuery && descriptionTarget 
    ? calculateStringSimilarity(descriptionQuery, descriptionTarget)
    : 0;
  
  const dateScore = dateQuery && dateTarget 
    ? calculateDateSimilarity(dateQuery, dateTarget)
    : 0;
  
  // Score global pondéré
  let overall = marqueScore * 0.6; // 60% pour la marque
  if (descriptionScore > 0) overall += descriptionScore * 0.3; // 30% pour la description
  if (dateScore > 0) overall += dateScore * 0.1; // 10% pour la date
  
  return {
    marque: marqueScore,
    description: descriptionScore,
    date: dateScore,
    overall
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'marque' | 'evenement' | null;
    const marque_nom = searchParams.get('marque_nom');
    const description = searchParams.get('description');
    
    if (!type || !marque_nom) {
      return NextResponse.json(
        { error: 'Paramètres manquants: type et marque_nom sont requis' },
        { status: 400 }
      );
    }

    const results = {
      marques: [] as Array<Marque & { score: SimilarityScore }>,
      evenements: [] as Array<Evenement & { score: SimilarityScore }>
    };

    // Recherche de marques similaires
    const { data: marques, error: marquesError } = await supabase
      .from('Marque')
      .select('*');
    
    if (marquesError) throw marquesError;

    for (const marque of marques || []) {
      const score = calculateSimilarityScore(marque_nom, marque.nom);
      
      if (score.overall >= SIMILARITY_THRESHOLDS.LOW) {
        results.marques.push({ ...marque, score });
      }
    }

    // Si on cherche des événements, rechercher aussi dans les événements
    if (type === 'evenement' && description) {
      const { data: evenements, error: evenementsError } = await supabase
        .from('Evenement')
        .select(`
          *,
          marque:Marque!inner(*),
          categorie:Categorie(*)
        `);
      
      if (evenementsError) throw evenementsError;

      for (const evenement of evenements || []) {
        const score = calculateSimilarityScore(
          marque_nom, 
          evenement.marque?.nom || '',
          description,
          evenement.description,
          searchParams.get('date') || undefined,
          evenement.date
        );
        
        if (score.overall >= SIMILARITY_THRESHOLDS.LOW) {
          results.evenements.push({ ...evenement, score });
        }
      }
    }

    // Trier par score décroissant
    results.marques.sort((a, b) => b.score.overall - a.score.overall);
    results.evenements.sort((a, b) => b.score.overall - a.score.overall);

    // Limiter les résultats
    results.marques = results.marques.slice(0, 5);
    results.evenements = results.evenements.slice(0, 5);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche de similarité:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}