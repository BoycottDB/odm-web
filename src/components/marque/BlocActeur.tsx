import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Etiquette } from '@/types';
import { ListeEtiquettes } from './ListeEtiquettes';

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
  // l'en-tête ouvert devient un onglet qui descend jusqu'au contenu
  enLigne?: boolean;
  className?: string;
}

// Ouvert : même bordure que fermé, sans bordure du bas, accroché au contenu (la forme suffit
// à repérer le bloc ouvert). Sur une ligne (ordinateur), l'onglet traverse l'espace sous la ligne
// (gap-y-2 + bordure du contenu = 10px) et recouvre la bordure haute du contenu ;
// le padding bas garde le texte centré comme sur les blocs fermés
const ONGLET = 'md:relative md:z-10 md:-mb-[10px] md:pb-[26px]';
const styleOuvert = (enLigne: boolean) =>
  `bg-white border-primary-medium rounded-t-2xl border-b-0 ${enLigne ? ONGLET : ''}`;

// En-tête d'un bloc : nom, lien avec l'acteur précédent et étiquettes
export function EnteteActeur({ icone, nom, sousTitre, etiquettes = [], ouvert, onToggle, contenuId, enLigne = false, className = '' }: EnteteProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={ouvert}
      aria-controls={contenuId}
      className={`group w-full border-2 transition-colors duration-200 ${ouvert ? styleOuvert(enLigne) : 'bg-white border-primary-medium rounded-2xl hover:border-primary'} p-2 md:p-4 text-left min-h-[5rem] ${className}`}
    >
      {/* Sur une ligne, les blocs ont la même hauteur : le texte part du haut pour aligner les noms */}
      <div className={`flex items-center gap-3 ${enLigne ? 'md:h-full' : ''}`}>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-primary" aria-hidden="true">
          {icone}
        </div>
        <div className={`flex-1 min-w-0 ${enLigne ? 'md:self-start' : ''}`}>
          <div className="font-semibold text-sm md:text-base truncate">{nom}</div>
          {sousTitre && <div className="text-xs opacity-75">{sousTitre}</div>}
          <ListeEtiquettes etiquettes={etiquettes} className="mt-2" />
        </div>
        <div className="flex-shrink-0 ml-2">
          {ouvert ? (
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-500 transition-transform duration-200 motion-safe:group-hover:rotate-90" />
          )}
        </div>
      </div>
    </button>
  );
}

interface ContenuActeurProps {
  id: string;
  enLigne?: boolean;
  // Onglet ouvert en première ou dernière colonne : coin droit sous lui pour une jonction nette
  coinOnglet?: 'gauche' | 'droite';
  className?: string;
  children: ReactNode;
}

const COIN_ONGLET = { gauche: 'md:rounded-tl-none', droite: 'md:rounded-tr-none' };

// Contenu d'un bloc ouvert, accroché sous son en-tête (sous l'onglet sur une ligne)
export function ContenuActeur({ id, enLigne = false, coinOnglet, className = '', children }: ContenuActeurProps) {
  const coins = enLigne
    ? `border-t-0 rounded-b-2xl md:border-t-2 md:rounded-2xl md:pt-6 ${coinOnglet ? COIN_ONGLET[coinOnglet] : ''}`
    : 'border-t-0 rounded-b-2xl';
  return (
    <div id={id} className={`bg-white border-primary-medium border-2 px-6 pb-6 pt-2 ${coins} ${className}`}>
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
