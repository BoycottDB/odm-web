import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
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

// Extraction des mots-clés d'une URL
function extractKeywordsFromUrl(url: string): string[] {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;
    
    // Extraire les mots du chemin et des paramètres
    const words = path
      .toLowerCase()
      .replace(/[^a-z0-9\-_/\s]/g, ' ') // Remplacer la ponctuation par des espaces
      .split(/[\-_/\s]+/) // Séparer sur tirets, underscores, slashes, espaces
      .filter(word => word.length > 2) // Garder seulement les mots de plus de 2 caractères
      .filter(word => !/^\d+$/.test(word)) // Supprimer les nombres purs
      .filter(word => !['www', 'com', 'fr', 'org', 'net', 'html', 'php', 'jsp', 'asp'].includes(word)); // Supprimer les mots techniques

    // Normaliser les mots (supprimer accents, etc.)
    return words.map(word => normalizeString(word));
  } catch {
    return [];
  }
}

// Calcul de la similarité entre deux URLs basée sur les mots-clés (0-1)
function calculateUrlSimilarity(url1: string, url2: string): number {
  const keywords1 = extractKeywordsFromUrl(url1);
  const keywords2 = extractKeywordsFromUrl(url2);
  
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  // Calculer les mots communs
  const commonWords = keywords1.filter(word => keywords2.includes(word));
  const totalUniqueWords = new Set([...keywords1, ...keywords2]).size;
  
  if (totalUniqueWords === 0) return 0;
  
  // Score basé sur le ratio de mots communs
  const jaccard = commonWords.length / totalUniqueWords;
  
  // Bonus si beaucoup de mots communs
  const commonRatio = commonWords.length / Math.min(keywords1.length, keywords2.length);
  
  return Math.min(1, jaccard * 1.5 + commonRatio * 0.5);
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

// Calcul de la proximité temporelle basée strictement sur l'année (0-1)
function calculateDateSimilarity(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();
    
    // Bonus seulement si c'est strictement la même année
    return year1 === year2 ? 1.0 : 0;
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
  dateTarget?: string,
  urlQuery?: string,
  urlTarget?: string
): SimilarityScore {
  const marqueScore = calculateStringSimilarity(marqueQuery, marqueTarget);
  
  const descriptionScore = descriptionQuery && descriptionTarget 
    ? calculateStringSimilarity(descriptionQuery, descriptionTarget)
    : 0;
  
  const dateScore = dateQuery && dateTarget 
    ? calculateDateSimilarity(dateQuery, dateTarget)
    : 0;
  
  const urlScore = urlQuery && urlTarget 
    ? calculateUrlSimilarity(urlQuery, urlTarget)
    : 0;
  
  // Score global pondéré
  let overall = marqueScore * 0.5; // 50% pour la marque
  if (dateScore > 0) overall += dateScore * 0.2; // 20% pour la date
  if (urlScore > 0) overall += urlScore * 0.2; // 20% pour la similarité des URLs
  if (descriptionScore > 0) overall += descriptionScore * 0.1; // 10% pour la description
  
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
    const source_url = searchParams.get('source_url');
    
    if (!type || !marque_nom) {
      return NextResponse.json(
        { error: 'Paramètres manquants: type et marque_nom sont requis' },
        { status: 400 }
      );
    }

    const results = {
      marques: [] as Array<Marque & { score: SimilarityScore }>,
      evenements: [] as Array<Evenement & { score: SimilarityScore }>,
      propositions: [] as Array<{ id: number; marque_nom: string; description: string; date: string; source_url: string; created_at: string; statut: string } & { score: SimilarityScore }>
    };

    // Recherche de marques similaires
    const { data: marques, error: marquesError } = await supabaseAdmin
      .from('Marque')
      .select('*');
    
    if (marquesError) throw marquesError;

    for (const marque of marques || []) {
      const score = calculateSimilarityScore(
        marque_nom, 
        marque.nom,
        description || undefined,
        undefined, // Pas de description pour les marques
        searchParams.get('date') || undefined,
        undefined, // Pas de date pour les marques
        source_url || undefined,
        undefined // Pas d'URL pour les marques
      );
      
      if (score.overall >= SIMILARITY_THRESHOLDS.LOW) {
        results.marques.push({ ...marque, score });
      }
    }

    // Si on cherche des événements, rechercher aussi dans les événements
    if (type === 'evenement') {
      const { data: evenements, error: evenementsError } = await supabaseAdmin
        .from('Evenement')
        .select(`
          *,
          marque:Marque!inner(*),
          categorie:Categorie!Evenement_categorie_id_fkey(*)
        `)
        .order('date', { ascending: false });
      
      if (evenementsError) throw evenementsError;

      for (const evenement of evenements || []) {
        // Vérifier d'abord si la marque correspond (similarité élevée sur le nom de marque)
        const marqueScore = calculateStringSimilarity(marque_nom, evenement.marque?.nom || '');
        
        // Ne garder que les controverses de marques qui correspondent bien au nom saisi
        if (marqueScore >= 0.7) {
          const dateParam = searchParams.get('date');
          const score = calculateSimilarityScore(
            marque_nom, 
            evenement.marque?.nom || '',
            description || undefined,
            evenement.titre,
            dateParam || undefined,
            evenement.date,
            source_url || undefined,
            evenement.source_url
          );
          
          results.evenements.push({ ...evenement, score });
        }
      }
    }

    // Rechercher dans les propositions en attente
    if (type === 'evenement') {
      const { data: propositions, error: propositionsError } = await supabaseAdmin
        .from('Proposition')
        .select('*')
        .eq('statut', 'en_attente')
        .order('created_at', { ascending: false });
      
      if (propositionsError) throw propositionsError;

      for (const proposition of propositions || []) {
        // Vérifier d'abord si la marque correspond (similarité élevée sur le nom de marque)
        const marqueScore = calculateStringSimilarity(marque_nom, proposition.marque_nom);
        
        // Ne garder que les propositions de marques qui correspondent bien au nom saisi
        if (marqueScore >= 0.7) {
          const dateParam = searchParams.get('date');
          const score = calculateSimilarityScore(
            marque_nom, 
            proposition.marque_nom,
            description || undefined,
            proposition.description,
            dateParam || undefined,
            proposition.date,
            source_url || undefined,
            proposition.source_url
          );
          
          results.propositions.push({ ...proposition, score });
        }
      }
    }

    // Trier par score décroissant
    results.marques.sort((a, b) => b.score.overall - a.score.overall);
    results.evenements.sort((a, b) => b.score.overall - a.score.overall);
    results.propositions.sort((a, b) => b.score.overall - a.score.overall);

    // Limiter les résultats
    results.marques = results.marques.slice(0, 5);
    results.evenements = results.evenements.slice(0, 3); // Max 3 controverses similaires
    results.propositions = results.propositions.slice(0, 3); // Max 3 propositions similaires
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erreur lors de la recherche de similarité:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}