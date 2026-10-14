import { Fragment } from 'react';
import { BlocActeur, ContenuActeur, EnteteActeur } from './BlocActeur';
import { ContenuBeneficiaire, enteteBeneficiaire } from './Beneficiaire';
import { liensEntrants, NoeudChaine } from './chaine';

interface NiveauBeneficiairesProps {
  noeuds: NoeudChaine[];
  niveauPrecedent?: NoeudChaine[];
  marqueNom: string;
  marqueId: number;
  ouvert: string | null;
  onToggle: (cle: string, beneficiaireId: number) => void;
}

const colonnes = (nombre: number) =>
  nombre === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

export const cleBeneficiaire = (noeud: NoeudChaine) => `beneficiaire-${noeud.beneficiaire.id}`;

// Bénéficiaires d'un même niveau côte à côte sur ordinateur (Eutopia et Otium pour Feed.).
// Le contenu ouvert passe sous la ligne sur ordinateur (order-last) et reste sous son en-tête sur mobile.
export function NiveauBeneficiaires({ noeuds, niveauPrecedent, marqueNom, marqueId, ouvert, onToggle }: NiveauBeneficiairesProps) {
  if (noeuds.length === 1) {
    const noeud = noeuds[0];
    const cle = cleBeneficiaire(noeud);
    const liens = liensEntrants(noeud, niveauPrecedent, marqueNom);
    return (
      <BlocActeur
        id={cle}
        {...enteteBeneficiaire(noeud, liens)}
        ouvert={ouvert === cle}
        onToggle={() => onToggle(cle, noeud.beneficiaire.id)}
      >
        <ContenuBeneficiaire noeud={noeud} liens={liens} marqueId={marqueId} />
      </BlocActeur>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${colonnes(noeuds.length)} md:gap-4`}>
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
              onToggle={() => onToggle(cle, noeud.beneficiaire.id)}
              contenuId={contenuId}
              enLigne
              className={index > 0 ? 'mt-3 md:mt-0' : ''}
            />
            {estOuvert && (
              <ContenuActeur id={contenuId} enLigne className="md:order-last md:col-span-full">
                <ContenuBeneficiaire noeud={noeud} liens={liens} marqueId={marqueId} />
              </ContenuActeur>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
