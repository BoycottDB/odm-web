/**
 * Utilitaire de slugification pour les URLs des marques
 * Génère des slugs stables, case-insensitive, sans accents
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les non-alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Supprime les tirets en début/fin
    .trim();
}

/**
 * Désluggifie un slug pour tenter de retrouver le nom original
 * Utile pour la recherche fuzzy
 */
export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
