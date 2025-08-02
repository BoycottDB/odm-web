import { supabaseAdmin } from '@/lib/supabaseClient';
import { Proposition, Marque, Evenement } from '@/types';

/**
 * Assure qu'une marque existe dans la base de données
 * Si elle n'existe pas, la crée
 * Retourne l'ID de la marque
 */
export async function ensureMarqueExists(marqueNom: string, marqueId?: number): Promise<number> {
  // Si on a déjà un ID de marque, vérifier qu'elle existe
  if (marqueId) {
    const { data: existingMarque, error } = await supabaseAdmin
      .from('Marque')
      .select('id')
      .eq('id', marqueId)
      .single();
    
    if (!error && existingMarque) {
      return marqueId;
    }
  }

  // Chercher la marque par nom
  const { data: marqueByName, error: searchError } = await supabaseAdmin
    .from('Marque')
    .select('id')
    .ilike('nom', marqueNom.trim())
    .single();

  if (!searchError && marqueByName) {
    return marqueByName.id;
  }

  // La marque n'existe pas, la créer
  const { data: newMarque, error: createError } = await supabaseAdmin
    .from('Marque')
    .insert({
      nom: marqueNom.trim()
    })
    .select('id')
    .single();

  if (createError) {
    throw createError;
  }

  if (!newMarque) {
    throw new Error('Erreur lors de la création de la marque');
  }

  return newMarque.id;
}

/**
 * Convertit une proposition approuvée en événement dans la table principale
 */
export async function convertPropositionToEvenement(proposition: Proposition): Promise<Evenement> {
  if (proposition.statut !== 'approuve') {
    throw new Error('Seules les propositions approuvées peuvent être converties');
  }

  // Assurer que la marque existe
  const marqueId = await ensureMarqueExists(proposition.marque_nom, proposition.marque_id);

  // Créer l'événement
  const { data: newEvenement, error: createError } = await supabaseAdmin
    .from('Evenement')
    .insert({
      marque_id: marqueId,
      description: proposition.description,
      date: proposition.date,
      categorie_id: proposition.categorie_id!,
      source_url: proposition.source_url,
      proposition_source_id: proposition.id
    })
    .select('*, Marque(*), Categorie!Evenement_categorie_id_fkey(*)')
    .single();

  if (createError) {
    throw createError;
  }

  if (!newEvenement) {
    throw new Error('Erreur lors de la création de l\'événement');
  }

  // Normaliser la réponse
  const normalized = {
    ...newEvenement,
    marque: newEvenement.Marque,
    categorie: newEvenement.Categorie,
    Marque: undefined,
    Categorie: undefined
  };

  return normalized;
}

/**
 * Convertit automatiquement une proposition approuvée en événement
 */
export async function convertApprovedProposition(proposition: Proposition): Promise<{ type: 'evenement', data: Evenement }> {
  if (proposition.statut !== 'approuve') {
    throw new Error('Seules les propositions approuvées peuvent être converties');
  }

  const evenement = await convertPropositionToEvenement(proposition);
  return { type: 'evenement', data: evenement };
}