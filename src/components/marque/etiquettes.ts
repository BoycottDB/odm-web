export interface Etiquette {
  nom: string;
  emoji?: string;
  nombre: number;
}

interface ControverseCategorisee {
  date?: string | null;
  categorie?: { nom: string; emoji?: string } | null;
}

// Catégorie jamais affichée en étiquette : elle ne dit rien au visiteur
const CATEGORIE_EXCLUE = 'Autre';

// Exemples écrits en dur pour valider l'interface (point 16 de l'audit).
// Les controverses de bénéficiaires n'ont presque pas de catégorie : ces exemples
// disparaîtront avec le chantier sur les catégories. Ne pas déployer en l'état.
const ETIQUETTES_EXEMPLE: Record<string, Etiquette[]> = {
  'Elon Musk': [
    { nom: 'Conditions de travail', emoji: '👥', nombre: 3 },
    { nom: 'Égalité', emoji: '⚖️', nombre: 1 },
    { nom: 'Politique', emoji: '🗳️', nombre: 1 },
  ],
  'Nestlé': [
    { nom: 'Produits dangereux', emoji: '⚠️', nombre: 2 },
    { nom: 'Environnement', emoji: '🌱', nombre: 2 },
    { nom: 'Droits humains', emoji: '✊', nombre: 1 },
  ],
  'BlackRock': [
    { nom: 'Environnement', emoji: '🌱', nombre: 3 },
    { nom: 'Politique', emoji: '🗳️', nombre: 2 },
  ],
  'Groupe Bolloré': [
    { nom: 'Environnement', emoji: '🌱', nombre: 1 },
    { nom: 'Droits humains', emoji: '✊', nombre: 1 },
    { nom: 'Fiscalité', emoji: '💸', nombre: 1 },
  ],
  'Vincent Bolloré': [
    { nom: 'Justice', emoji: '🏛️', nombre: 1 },
    { nom: 'Médias', emoji: '📰', nombre: 2 },
    { nom: 'Politique', emoji: '🗳️', nombre: 1 },
  ],
  'Pierre Edouard Stérin': [
    { nom: 'Politique', emoji: '🗳️', nombre: 1 },
  ],
};

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

export function etiquettesBeneficiaire(nom: string, controverses: ControverseCategorisee[]): Etiquette[] {
  const etiquettes = calculerEtiquettes(controverses);
  return etiquettes.length > 0 ? etiquettes : ETIQUETTES_EXEMPLE[nom] ?? [];
}
