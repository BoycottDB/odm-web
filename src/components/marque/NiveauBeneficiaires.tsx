import { Fragment } from 'react';
import { BlocActeur, ContenuActeur, EnteteActeur } from './BlocActeur';
import { ContenuBeneficiaire, enteteBeneficiaire } from './Beneficiaire';
import { liensEntrants, NoeudChaine } from './chaine';

interface NiveauBeneficiairesProps {
  noeuds: NoeudChaine[];
  niveauPrecedent?: NoeudChaine[];
  marqueNom: string;
  ouvert: string | null;
  onToggle: (cle: string, blocNom: string) => void;
}

// Au-delà de 3, une seule ligne serait trop serrée : les blocs sont empilés,
// car les onglets n'ont de sens que si le contenu passe juste sous leur ligne
const MAX_EN_LIGNE = 3;
const COLONNES = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' } as const;

const coinOnglet = (index: number, nombre: number) =>
  index === 0 ? 'gauche' : index === nombre - 1 ? 'droite' : undefined;

export const cleBeneficiaire = (noeud: NoeudChaine) => `beneficiaire-${noeud.beneficiaire.id}`;

// Bénéficiaires d'un même niveau côte à côte sur ordinateur (Eutopia et Otium pour Feed.).
// Le contenu ouvert passe sous la ligne sur ordinateur (order-last), sous l'onglet ouvert,
// et reste sous son en-tête sur mobile.
export function NiveauBeneficiaires({ noeuds, niveauPrecedent, marqueNom, ouvert, onToggle }: NiveauBeneficiairesProps) {
  if (noeuds.length === 1 || noeuds.length > MAX_EN_LIGNE) {
    return (
      <div className="space-y-3">
        {noeuds.map((noeud) => {
          const cle = cleBeneficiaire(noeud);
          const liens = liensEntrants(noeud, niveauPrecedent, marqueNom);
          return (
            <BlocActeur
              key={cle}
              id={cle}
              {...enteteBeneficiaire(noeud, liens)}
              ouvert={ouvert === cle}
              onToggle={() => onToggle(cle, noeud.beneficiaire.nom)}
            >
              <ContenuBeneficiaire noeud={noeud} liens={liens} marqueNom={marqueNom} />
            </BlocActeur>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${COLONNES[noeuds.length as 2 | 3]} md:gap-x-4 md:gap-y-2`}>
      {noeuds.map((noeud, index) => {
        const cle = cleBeneficiaire(noeud);
        const liens = liensEntrants(noeud, niveauPrecedent, marqueNom);
        const contenuId = `contenu-${cle}`;
        const estOuvert = ouvert === cle;
        return (
          <Fragment key={cle}>
            <EnteteActeur
              {...enteteBeneficiaire(noeud, liens)}
              ouvert={estOuvert}
              onToggle={() => onToggle(cle, noeud.beneficiaire.nom)}
              contenuId={contenuId}
              enLigne
              className={index > 0 ? 'mt-3 md:mt-0' : ''}
            />
            {estOuvert && (
              <ContenuActeur
                id={contenuId}
                enLigne
                coinOnglet={coinOnglet(index, noeuds.length)}
                className="md:order-last md:col-span-full"
              >
                <ContenuBeneficiaire noeud={noeud} liens={liens} marqueNom={marqueNom} />
              </ContenuActeur>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
