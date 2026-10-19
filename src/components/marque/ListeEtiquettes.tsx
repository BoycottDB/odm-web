import { Badge } from '@/components/ui/Badge';
import { Etiquette } from '@/types';

interface ListeEtiquettesProps {
  etiquettes: Etiquette[];
  // Texte avant les étiquettes, sur la même ligne
  libelle?: string;
  className?: string;
}

// Une étiquette par catégorie : emoji, nom et nombre à partir de deux controverses
export function ListeEtiquettes({ etiquettes, libelle, className = '' }: ListeEtiquettesProps) {
  if (etiquettes.length === 0) return null;
  return (
    <div className={`flex flex-wrap md:gap-2 gap-1 ${className}`}>
      {libelle && <span className="text-xs font-medium text-neutral-700 self-center">{libelle}</span>}
      {etiquettes.map((etiquette) => (
        <Badge key={etiquette.nom}>
          {etiquette.emoji && <span className="mr-1">{etiquette.emoji}</span>}
          {etiquette.nom}
          {etiquette.nombre > 1 && <span className="ml-1 opacity-70">{etiquette.nombre}</span>}
        </Badge>
      ))}
    </div>
  );
}
