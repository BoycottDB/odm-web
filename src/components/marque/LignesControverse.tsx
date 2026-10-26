import { safeTrack } from '@/lib/analytics';
import { CATEGORIE_EXCLUE } from './etiquettes';

export interface Controverse {
  id: number | string;
  titre: string;
  date?: string | null;
  source_url: string;
  reponse?: string | null;
  categorie?: { nom: string; emoji?: string } | null;
}

export type SourceControverse = 'evenement' | 'beneficiaire';

export const formatDateCourte = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { year: '2-digit', month: 'short', day: 'numeric' });

const lienClass = 'text-primary font-medium hover:text-accent-700 transition-colors';

interface LigneLiensProps {
  controverse: Controverse;
  sourceType: SourceControverse;
  marqueNom: string;
  blocNom: string;
}

// Source et Réponse sur une ligne, séparées par « · »
export const LigneLiens = ({ controverse, sourceType, marqueNom, blocNom }: LigneLiensProps) => {
  const suivi = { marque: marqueNom, bloc: blocNom, source_type: sourceType, controverse_id: controverse.id };
  const elements = [
    <a
      key="source"
      href={controverse.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className={lienClass}
      onClick={() => safeTrack('source_click', suivi)}
    >
      Source ↗
    </a>,
    controverse.reponse ? (
      <a
        key="reponse"
        href={controverse.reponse}
        target="_blank"
        rel="noopener noreferrer"
        className={lienClass}
        onClick={() => safeTrack('response_click', suivi)}
      >
        Réponse ↗
      </a>
    ) : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium">
      {elements.map((element, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-neutral-400" aria-hidden="true">·</span>}
          {element}
        </span>
      ))}
    </div>
  );
};

// Date et catégorie sur une ligne d'informations, séparées par « · » comme Source · Réponse ;
// catégorie en texte simple (sans pastille) pour ne pas alourdir l'affichage ; jamais « Autre »
export const LigneDateCategorie = ({ controverse }: { controverse: Controverse }) => {
  const categorie = controverse.categorie?.nom && controverse.categorie.nom !== CATEGORIE_EXCLUE ? controverse.categorie : null;
  if (!controverse.date && !categorie) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 text-xs mb-0.5">
      {controverse.date && <span className="font-semibold text-secondary-dark">{formatDateCourte(controverse.date)}</span>}
      {controverse.date && categorie && <span className="text-neutral-400" aria-hidden="true">·</span>}
      {categorie && (
        <span className="font-medium text-neutral-500">
          {categorie.emoji && <span className="mr-1">{categorie.emoji}</span>}
          {categorie.nom}
        </span>
      )}
    </div>
  );
};
