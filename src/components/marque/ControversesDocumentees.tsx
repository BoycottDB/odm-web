import { safeTrack } from '@/lib/analytics';

interface Controverse {
  id: number | string;
  titre: string;
  date?: string | null;
  source_url: string;
  reponse?: string | null;
  condamnation_judiciaire?: boolean;
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

// Source, Réponse et Condamnation sur une ligne, séparées par « · »
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
    controverse.condamnation_judiciaire ? <span key="condamnation" className="text-primary-dark">Condamnation judiciaire</span> : null,
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
            {controverse.date && (
              <div className="text-xs font-semibold text-secondary mb-0.5">{formatDate(controverse.date)}</div>
            )}
            <p className="text-sm font-medium text-neutral-900 leading-snug mb-1">{controverse.titre}</p>
            <LigneLiens controverse={controverse} sourceType={sourceType} marqueId={marqueId} />
          </li>
        ))}
      </ol>
    </div>
  );
}
