import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Etiquette } from './etiquettes';

export interface EnteteActeurProps {
  icone: ReactNode;
  nom: string;
  sousTitre?: ReactNode;
  etiquettes?: Etiquette[];
}

interface EnteteProps extends EnteteActeurProps {
  ouvert: boolean;
  onToggle: () => void;
  contenuId: string;
  // Sur une ligne de plusieurs blocs (ordinateur), le contenu s'affiche sous la ligne :
  // l'en-tête reste alors un bloc fermé
  enLigne?: boolean;
  className?: string;
}

// Ouvert : bordure pleine, pour repérer le bloc ouvert (surtout sur une ligne de plusieurs)
const styleOuvert = (enLigne: boolean) =>
  `bg-white border-primary ${enLigne ? 'rounded-t-2xl border-b-0 md:rounded-2xl md:border-b-2' : 'rounded-t-2xl border-b-0'}`;

// En-tête d'un bloc : nom, lien avec l'acteur précédent et étiquettes
export function EnteteActeur({ icone, nom, sousTitre, etiquettes = [], ouvert, onToggle, contenuId, enLigne = false, className = '' }: EnteteProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={ouvert}
      aria-controls={contenuId}
      className={`w-full border-2 ${ouvert ? styleOuvert(enLigne) : 'bg-white border-primary-medium rounded-2xl'} p-2 md:p-4 text-left min-h-[5rem] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary" aria-hidden="true">
          {icone}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm md:text-base truncate">{nom}</div>
          {sousTitre && <div className="text-xs opacity-75 md:truncate">{sousTitre}</div>}
          {etiquettes.length > 0 && (
            <div className="flex flex-wrap md:gap-2 gap-1 mt-2">
              {etiquettes.map((etiquette) => (
                <Badge key={etiquette.nom}>
                  {etiquette.emoji && <span className="mr-1">{etiquette.emoji}</span>}
                  {etiquette.nom}
                  <span className="ml-1 opacity-70">{etiquette.nombre}</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-2">
          {ouvert ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
    </button>
  );
}

interface ContenuActeurProps {
  id: string;
  enLigne?: boolean;
  className?: string;
  children: ReactNode;
}

// Contenu d'un bloc ouvert, accroché sous son en-tête
export function ContenuActeur({ id, enLigne = false, className = '', children }: ContenuActeurProps) {
  const coins = enLigne ? 'border-t-0 rounded-b-2xl md:border-t-2 md:rounded-2xl md:pt-6' : 'border-t-0 rounded-b-2xl';
  return (
    <div id={id} className={`bg-white border-primary border-2 px-6 pb-6 pt-2 ${coins} ${className}`}>
      {children}
    </div>
  );
}

interface BlocActeurProps extends EnteteActeurProps {
  id: string;
  ouvert: boolean;
  onToggle: () => void;
  children: ReactNode;
}

// Bloc seul sur sa ligne : en-tête et contenu l'un sous l'autre
export function BlocActeur({ id, ouvert, onToggle, children, ...entete }: BlocActeurProps) {
  const contenuId = `contenu-${id}`;
  return (
    <div>
      <EnteteActeur {...entete} ouvert={ouvert} onToggle={onToggle} contenuId={contenuId} />
      {ouvert && <ContenuActeur id={contenuId}>{children}</ContenuActeur>}
    </div>
  );
}
