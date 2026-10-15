export interface MarqueNom {
  id: number;
  nom: string;
}

export interface BeneficiaireNom {
  id: number;
  nom: string;
  type_beneficiaire: 'individu' | 'groupe';
}

// Une suggestion de la barre : une marque ou un bénéficiaire controversé
export type Suggestion =
  | ({ type: 'marque' } & MarqueNom)
  | ({ type: 'beneficiaire' } & BeneficiaireNom);

const LONGUEUR_MIN = 2;
const NOMBRE_MAX = 10;

// Minuscules sans accents : « hepar » trouve « Hépar »
export const normaliser = (texte: string) =>
  texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Marques et bénéficiaires réunis en une seule liste, par ordre alphabétique
export function construireSuggestions(marques: MarqueNom[], beneficiaires: BeneficiaireNom[]): Suggestion[] {
  return [
    ...marques.map((marque) => ({ type: 'marque' as const, ...marque })),
    ...beneficiaires.map((beneficiaire) => ({ type: 'beneficiaire' as const, ...beneficiaire })),
  ].sort((a, b) => a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' }));
}

// Suggestions pour une saisie : les noms qui commencent par la saisie d'abord,
// puis ceux qui la contiennent ; ordre alphabétique de la liste conservé dans chaque groupe
export function filtrerSuggestions(suggestions: Suggestion[], saisie: string): Suggestion[] {
  const recherche = normaliser(saisie);
  if (recherche.length < LONGUEUR_MIN) return [];

  const debut: Suggestion[] = [];
  const contient: Suggestion[] = [];
  for (const suggestion of suggestions) {
    const nom = normaliser(suggestion.nom);
    if (nom.startsWith(recherche)) debut.push(suggestion);
    else if (nom.includes(recherche)) contient.push(suggestion);
  }
  return [...debut, ...contient].slice(0, NOMBRE_MAX);
}

// Suggestion dont le nom correspond exactement à la saisie (accents et casse ignorés) ;
// une marque passe avant un bénéficiaire du même nom
export function suggestionExacte(suggestions: Suggestion[], saisie: string): Suggestion | undefined {
  const exactes = suggestions.filter((suggestion) => normaliser(suggestion.nom) === normaliser(saisie));
  return exactes.find((suggestion) => suggestion.type === 'marque') ?? exactes[0];
}
