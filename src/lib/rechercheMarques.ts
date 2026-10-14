export interface MarqueNom {
  id: number;
  nom: string;
}

const LONGUEUR_MIN = 2;
const NOMBRE_MAX = 10;

// Minuscules sans accents : « hepar » trouve « Hépar »
export const normaliser = (texte: string) =>
  texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Suggestions pour une saisie : les noms qui commencent par la saisie d'abord,
// puis ceux qui la contiennent ; ordre alphabétique de la liste conservé dans chaque groupe
export function filtrerMarques(marques: MarqueNom[], saisie: string): MarqueNom[] {
  const recherche = normaliser(saisie);
  if (recherche.length < LONGUEUR_MIN) return [];

  const debut: MarqueNom[] = [];
  const contient: MarqueNom[] = [];
  for (const marque of marques) {
    const nom = normaliser(marque.nom);
    if (nom.startsWith(recherche)) debut.push(marque);
    else if (nom.includes(recherche)) contient.push(marque);
  }
  return [...debut, ...contient].slice(0, NOMBRE_MAX);
}

// Marque dont le nom correspond exactement à la saisie (accents et casse ignorés)
export const marqueExacte = (marques: MarqueNom[], saisie: string) =>
  marques.find((marque) => normaliser(marque.nom) === normaliser(saisie));
