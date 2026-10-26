import { Controverse, LigneDateCategorie, LigneLiens, SourceControverse } from './LignesControverse';

interface ControversesDocumenteesProps {
  controverses: Controverse[];
  sourceType: SourceControverse;
  marqueNom: string;
  blocNom: string;
}

const parDateDecroissante = (a: Controverse, b: Controverse) =>
  (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0);

// Frise des controverses d'un acteur, de la plus récente à la plus ancienne
export function ControversesDocumentees({ controverses, sourceType, marqueNom, blocNom }: ControversesDocumenteesProps) {
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
            <LigneLiens controverse={controverse} sourceType={sourceType} marqueNom={marqueNom} blocNom={blocNom} />
          </li>
        ))}
      </ol>
    </div>
  );
}
