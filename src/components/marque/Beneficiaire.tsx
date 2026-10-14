import { Building2, User } from 'lucide-react';
import { MarquesBadges } from '@/components/ui/MarquesBadges';
import { EnteteActeurProps } from './BlocActeur';
import { ControversesDocumentees } from './ControversesDocumentees';
import { calculerEtiquettes } from './etiquettes';
import { formatImpact } from './formatImpact';
import { NoeudChaine, LienEntrant } from './chaine';

interface ContenuBeneficiaireProps {
  noeud: NoeudChaine;
  liens: LienEntrant[];
  marqueId: number;
}

// Un lien entrant : son texte ; plusieurs : « Via A et B », les textes sont dans le contenu
const sousTitre = (liens: LienEntrant[]) =>
  liens.length === 1
    ? liens[0].texte
    : `Via ${liens.map((lien) => lien.depuis).join(' et ')}`;

export function enteteBeneficiaire(noeud: NoeudChaine, liens: LienEntrant[]): EnteteActeurProps {
  const { beneficiaire } = noeud;
  const Icone = beneficiaire.type_beneficiaire === 'groupe' ? Building2 : User;
  return {
    icone: <Icone className="w-8 h-8" />,
    nom: beneficiaire.nom,
    sousTitre: sousTitre(liens),
    etiquettes: calculerEtiquettes(
      (beneficiaire.controverses || []).map((controverse) => ({ date: controverse.date, categorie: controverse.Categorie }))
    ),
  };
}

export function ContenuBeneficiaire({ noeud, liens, marqueId }: ContenuBeneficiaireProps) {
  const { beneficiaire, marques_directes, marques_indirectes } = noeud;
  const controverses = beneficiaire.controverses || [];

  return (
    <>
      {liens.length > 1 && (
        <ul className="space-y-1 text-sm text-neutral-900 mb-6">
          {liens.map((lien) => (
            <li key={lien.depuis}>{lien.texte}</li>
          ))}
        </ul>
      )}

      {/* Informations financières */}
      {beneficiaire.impact_generique && (
        <div className="space-y-4 mb-6">
          <div>
            <div className="font-semibold text-xs mb-1 text-primary">
              Impact de vos achats :
            </div>
            <div
              className="text-neutral-900 text-sm"
              dangerouslySetInnerHTML={{ __html: formatImpact(beneficiaire.impact_generique) }}
            />
          </div>
        </div>
      )}

      {controverses.length > 0 && (
        <ControversesDocumentees controverses={controverses} sourceType="beneficiaire" marqueId={marqueId} />
      )}

      {/* Marques liées sans intermédiaire */}
      {marques_directes?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-primary">
          <div className="font-semibold text-black text-xs mb-3">
            Autres marques qui enrichissent {beneficiaire.nom} ({marques_directes.length}) :
          </div>
          <MarquesBadges marques={marques_directes} />
        </div>
      )}

      {/* Marques liées par un intermédiaire : « via » évite de laisser croire à une détention directe */}
      {Object.keys(marques_indirectes || {}).length > 0 && (
        <div className="mt-6 pt-4 border-t border-primary space-y-4">
          {Object.entries(marques_indirectes).map(([intermediaire, marques]) => (
            <div key={intermediaire}>
              <div className="font-semibold text-black text-xs mb-3">
                Autres marques qui enrichissent {beneficiaire.nom} via {intermediaire} ({marques.length}) :
              </div>
              <MarquesBadges marques={marques} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
