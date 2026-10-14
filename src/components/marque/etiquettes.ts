import { Etiquette } from '@/types';

interface ControverseCategorisee {
  date?: string | null;
  categorie?: { nom: string; emoji?: string } | null;
}

// Catégorie jamais affichée en étiquette : elle ne dit rien au visiteur
const CATEGORIE_EXCLUE = 'Autre';

// Une étiquette par catégorie, avec le nombre de controverses ;
// ordre : catégorie dont la controverse est la plus récente en premier
export function calculerEtiquettes(controverses: ControverseCategorisee[]): Etiquette[] {
  const parCategorie = new Map<string, { emoji?: string; nombre: number; plusRecente: number }>();

  for (const controverse of controverses) {
    const nom = controverse.categorie?.nom;
    if (!nom || nom === CATEGORIE_EXCLUE) continue;

    const date = controverse.date ? new Date(controverse.date).getTime() : 0;
    const existante = parCategorie.get(nom);
    parCategorie.set(nom, {
      emoji: controverse.categorie?.emoji,
      nombre: (existante?.nombre ?? 0) + 1,
      plusRecente: Math.max(existante?.plusRecente ?? 0, date),
    });
  }

  return [...parCategorie.entries()]
    .sort(([, a], [, b]) => b.plusRecente - a.plusRecente)
    .map(([nom, { emoji, nombre }]) => ({ nom, emoji, nombre }));
}
