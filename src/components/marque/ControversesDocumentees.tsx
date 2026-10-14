import { safeTrack } from '@/lib/analytics';
import { CATEGORIE_EXCLUE } from './etiquettes';

interface Controverse {
  id: number | string;
  titre: string;
  date?: string | null;
  source_url: string;
  reponse?: string | null;
  categorie?: { nom: string; emoji?: string } | null;
}

interface ControversesDocumenteesProps {
  controverses: Controverse[];
  sourceType: 'evenement' | 'beneficiaire';
  marqueId: number;
}

const parDateDecroissante = (a: Controverse, b: Controverse) =>
  (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('fr-FR', { year: '2-digit', month: 'short', day: 'numeric' });

const lienClass = 'text-primary font-medium hover:text-accent-700 transition-colors';

// Source et Réponse sur une ligne, séparées par « · »
const LigneLiens = ({ controverse, sourceType, marqueId }: { controverse: Controverse } & Omit<ControversesDocumenteesProps, 'controverses'>) => {
  const elements = [
    <a
      key="source"
      href={controverse.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className={lienClass}
      onClick={() => safeTrack('source_click', { source_type: sourceType, source_id: controverse.id, marque_id: marqueId })}
    >
      Source ↗
    </a>,
    controverse.reponse ? (
      <a key="reponse" href={controverse.reponse} target="_blank" rel="noopener noreferrer" className={lienClass}>
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
// catégorie en texte simple (sans pastille) pour ne pas alourdir la frise ; jamais « Autre »
const LigneDateCategorie = ({ controverse }: { controverse: Controverse }) => {
  const categorie = controverse.categorie?.nom && controverse.categorie.nom !== CATEGORIE_EXCLUE ? controverse.categorie : null;
  if (!controverse.date && !categorie) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 text-xs mb-0.5">
      {controverse.date && <span className="font-semibold text-secondary">{formatDate(controverse.date)}</span>}
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

// Frise des controverses d'un acteur, de la plus récente à la plus ancienne
export function ControversesDocumentees({ controverses, sourceType, marqueId }: ControversesDocumenteesProps) {
  return (
    <div className="mb-6">
      <div className="font-semibold text-xs mb-3 text-primary">
        Controverses documentées :
      </div>
      <ol className="relative border-l-2 border-primary-medium ml-1.5">
        {[...controverses].sort(parDateDecroissante).map((controverse) => (
          <li key={controverse.id} className="relative pl-5 pb-5 last:pb-0">
            <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary" aria-hidden="true" />
            <LigneDateCategorie controverse={controverse} />
            <p className="text-sm font-medium text-neutral-900 leading-snug mb-1">{controverse.titre}</p>
            <LigneLiens controverse={controverse} sourceType={sourceType} marqueId={marqueId} />
          </li>
        ))}
      </ol>
    </div>
  );
}
