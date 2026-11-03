'use client';

import { Fragment, ReactNode, useLayoutEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Marque } from '@/types';
import { safeTrack } from '@/lib/analytics';
import { ramenerALEcran } from '@/lib/ramenerALEcran';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import { BlocMarque } from './BlocMarque';
import { COLONNES, MAX_EN_LIGNE, NiveauBeneficiaires } from './NiveauBeneficiaires';
import { meneAuNiveauSuivant, NoeudChaine, niveauxDeLaChaine } from './chaine';

interface ChaineQuiJenrichisProps {
  marque: Marque;
  // Autre nom par lequel on arrive (ex. « Knacki ») : retiré de la liste des produits de la marque
  autreNom?: string;
}

// Flèche vers l'étape suivante. Sous une ligne de blocs dont seuls certains mènent à la suite,
// elle se place sous ces blocs sur ordinateur (sous le groupe Bolloré, pas sous Stérin, pour Obole) ;
// sur mobile, une seule flèche, ces blocs étant placés en dernier
const Fleche = ({ colonnes }: { colonnes?: boolean[] }) => {
  const fleche = <ArrowDown className="w-5 h-5" />;
  if (!colonnes) {
    return (
      <div className="flex justify-center py-2 text-primary" aria-hidden="true">
        {fleche}
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-1 ${COLONNES[colonnes.length as 2 | 3]} md:gap-x-4 py-2 text-primary`} aria-hidden="true">
      <div className="flex justify-center md:hidden">{fleche}</div>
      {colonnes.map((versLaSuite, index) => (
        <div key={index} className="hidden md:flex justify-center">
          {versLaSuite && fleche}
        </div>
      ))}
    </div>
  );
};

// Blocs d'une ligne qui mènent au niveau suivant, quand ce ne sont pas tous et qu'un seul bloc suit.
// Sinon la flèche reste centrée : sous une seule colonne, elle semblerait ne mener qu'au bloc
// du dessous (3G Capital sans BlackRock, pour Burger King)
const versLaSuiteSiPartielle = (noeuds: NoeudChaine[], niveauSuivant?: NoeudChaine[]) => {
  if (niveauSuivant?.length !== 1 || noeuds.length < 2 || noeuds.length > MAX_EN_LIGNE) return undefined;
  const versLaSuite = meneAuNiveauSuivant(noeuds, niveauSuivant);
  return versLaSuite.every(Boolean) ? undefined : versLaSuite;
};

// Ouverture d'un bloc (la marque ou un bénéficiaire) : suivie une fois par session et par marque
const suivreOuverture = (marqueNom: string, blocNom: string, blocType: 'marque' | 'beneficiaire') => {
  const storageKey = 'odm_block_opened';
  const trackKey = `${marqueNom}:${blocNom}`;
  try {
    const viewed: Record<string, boolean> = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    if (viewed[trackKey]) return;
    viewed[trackKey] = true;
    sessionStorage.setItem(storageKey, JSON.stringify(viewed));
  } catch {
    // Stockage indisponible : on suit quand même
  }
  safeTrack('block_open', { marque: marqueNom, bloc: blocNom, bloc_type: blocType });
};

// La marque (si elle a ses propres controverses ou d'autres noms), puis ses bénéficiaires dans l'ordre
// du trajet de l'argent, puis les conseils. Tous les blocs sont fermés au départ,
// un seul s'ouvre à la fois (le contenu d'un bloc sur une ligne de plusieurs passe sous la ligne).
export function ChaineQuiJenrichis({ marque, autreNom }: ChaineQuiJenrichisProps) {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const niveaux = niveauxDeLaChaine(marque.chaine_beneficiaires || []);

  const basculer = (cle: string, blocNom: string, blocType: 'marque' | 'beneficiaire') => {
    const ouverture = ouvert !== cle;
    setOuvert(ouverture ? cle : null);
    if (ouverture) suivreOuverture(marque.nom, blocNom, blocType);
  };

  // La fermeture d'un bloc plus haut peut faire remonter l'en-tête ouvert hors de l'écran
  useLayoutEffect(() => {
    if (ouvert) ramenerALEcran(document.querySelector<HTMLElement>(`[aria-controls="contenu-${ouvert}"]`));
  }, [ouvert]);

  // Étapes du trajet, chacune avec la flèche qui la précède
  const etapes: { contenu: ReactNode; flecheAvant?: boolean[] }[] = [];
  if ((marque.evenements?.length ?? 0) > 0 || (marque.autres_noms?.length ?? 0) > 0) {
    etapes.push({
      contenu: <BlocMarque key="marque" marque={marque} autreNom={autreNom} ouvert={ouvert === 'marque'} onToggle={() => basculer('marque', marque.nom, 'marque')} />,
    });
  }
  niveaux.forEach((noeuds, index) => {
    const versLaSuite = versLaSuiteSiPartielle(noeuds, niveaux[index + 1]);
    etapes.push({
      contenu: (
        <NiveauBeneficiaires
          key={`niveau-${index}`}
          noeuds={noeuds}
          niveauPrecedent={niveaux[index - 1]}
          versLaSuite={versLaSuite}
          marqueNom={marque.nom}
          ouvert={ouvert}
          onToggle={(cle, blocNom) => basculer(cle, blocNom, 'beneficiaire')}
        />
      ),
      flecheAvant: index > 0 ? versLaSuiteSiPartielle(niveaux[index - 1], noeuds) : undefined,
    });
  });

  return (
    <div>
      {etapes.map((etape, index) => (
        <Fragment key={index}>
          {index > 0 && <Fleche colonnes={etape.flecheAvant} />}
          {etape.contenu}
        </Fragment>
      ))}

      <div className="mt-10">
        <BoycottTipsSection marque={marque} />
      </div>
    </div>
  );
}
