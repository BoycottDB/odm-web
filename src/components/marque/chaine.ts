import { Marque } from '@/types';

export type NoeudChaine = NonNullable<Marque['chaine_beneficiaires']>[number];

export interface LienEntrant {
  depuis: string;
  texte: string;
}

// Bénéficiaires regroupés par niveau, dans l'ordre du trajet de l'argent
export function niveauxDeLaChaine(chaine: NoeudChaine[]): NoeudChaine[][] {
  const parNiveau = new Map<number, NoeudChaine[]>();
  for (const noeud of chaine) {
    parNiveau.set(noeud.niveau, [...(parNiveau.get(noeud.niveau) ?? []), noeud]);
  }
  return [...parNiveau.entries()].sort(([a], [b]) => a - b).map(([, noeuds]) => noeuds);
}

// Liens qui mènent à un bénéficiaire : depuis la marque au niveau 0, sinon depuis
// chaque bénéficiaire du niveau précédent qui pointe vers lui (Stérin via Eutopia et Otium)
export function liensEntrants(noeud: NoeudChaine, niveauPrecedent: NoeudChaine[] | undefined, marqueNom: string): LienEntrant[] {
  if (!niveauPrecedent) {
    return [{ depuis: marqueNom, texte: noeud.lien_financier }];
  }

  const liens = niveauPrecedent.flatMap((parent) =>
    parent.relations_suivantes
      .filter((relation) => relation.beneficiaire_cible_id === noeud.beneficiaire.id)
      .map((relation) => ({
        depuis: parent.beneficiaire.nom,
        texte: relation.description_relation || noeud.lien_financier,
      }))
  );

  return liens.length > 0 ? liens : [{ depuis: '', texte: noeud.lien_financier }];
}

// Noms de la marque et des bénéficiaires qui ont des controverses, sans doublon,
// pour la réponse en haut de page et le partage (les intermédiaires sans controverse en sont exclus)
export function nomsDesActeursControverses(marque: Marque): string[] {
  const beneficiaires = niveauxDeLaChaine(marque.chaine_beneficiaires || [])
    .flat()
    .filter((noeud) => (noeud.beneficiaire.controverses?.length ?? 0) > 0)
    .map((noeud) => noeud.beneficiaire.nom);
  const marqueControversee = (marque.evenements?.length ?? 0) > 0 ? [marque.nom] : [];
  return [...new Set([...marqueControversee, ...beneficiaires])];
}
