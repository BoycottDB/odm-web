// Réponses publiées au titre du droit de réponse (art. 1-1, III, de la LCEN).
// À insérer dans les 3 jours de la réception : ajouter une entrée ici, déployer, puis faire pointer
// le champ `reponse` de la controverse vers /droit-de-reponse#<ancre> (lien « Réponse » de la fiche).
export interface ReponsePubliee {
  ancre: string; // ex. 'reponse-e12' (E = controverse de marque, C = controverse de bénéficiaire)
  demandeur: string; // nom de la personne ou de l'entreprise qui exerce son droit
  ficheConcernee: { titre: string; href: string }; // titre du message en cause et page où il figure
  dateReception: string; // AAAA-MM-JJ
  datePublication: string; // AAAA-MM-JJ
  texte: string; // texte de la réponse, tel que reçu
}

export const reponsesPubliees: ReponsePubliee[] = [];
