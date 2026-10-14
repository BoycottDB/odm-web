'use client';

import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Marque } from '@/types';
import { safeTrack } from '@/lib/analytics';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import { BlocMarque } from './BlocMarque';
import { NiveauBeneficiaires } from './NiveauBeneficiaires';
import { niveauxDeLaChaine } from './chaine';

interface ChaineQuiJenrichisProps {
  marque: Marque;
}

const Fleche = () => (
  <div className="flex justify-center py-2 text-primary" aria-hidden="true">
    <ArrowDown className="w-5 h-5" />
  </div>
);

// Ouverture d'un bénéficiaire : suivie une fois par session et par marque
const suivreOuverture = (marqueId: number, beneficiaireId: number) => {
  const storageKey = 'odm_beneficiary_chain_viewed';
  const trackKey = `${marqueId}:${beneficiaireId}`;
  try {
    const viewed: Record<string, boolean> = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    if (viewed[trackKey]) return;
    viewed[trackKey] = true;
    sessionStorage.setItem(storageKey, JSON.stringify(viewed));
  } catch {
    // Stockage indisponible : on suit quand même
  }
  safeTrack('beneficiary_chain_view', { marque_id: marqueId, beneficiaire_id: beneficiaireId });
};

// La marque (si elle a ses propres controverses), puis ses bénéficiaires dans l'ordre
// du trajet de l'argent, puis les conseils. Tous les blocs sont fermés au départ,
// un seul s'ouvre à la fois (le contenu d'un bloc sur une ligne de plusieurs passe sous la ligne).
export function ChaineQuiJenrichis({ marque }: ChaineQuiJenrichisProps) {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const chaineRef = useRef<HTMLDivElement>(null);
  const niveaux = niveauxDeLaChaine(marque.chaine_beneficiaires || []);

  const basculer = (cle: string, beneficiaireId?: number) => {
    const ouverture = ouvert !== cle;
    setOuvert(ouverture ? cle : null);
    if (ouverture && beneficiaireId !== undefined) suivreOuverture(marque.id, beneficiaireId);
  };

  // Fermer au clic en dehors des blocs
  useEffect(() => {
    if (!ouvert) return;
    const fermerAuClicExterieur = (event: MouseEvent) => {
      if (chaineRef.current && !chaineRef.current.contains(event.target as Node)) {
        setOuvert(null);
      }
    };
    document.addEventListener('mousedown', fermerAuClicExterieur);
    return () => document.removeEventListener('mousedown', fermerAuClicExterieur);
  }, [ouvert]);

  // Étapes du trajet, séparées par une flèche
  const etapes: ReactNode[] = [];
  if ((marque.evenements?.length ?? 0) > 0) {
    etapes.push(
      <BlocMarque key="marque" marque={marque} ouvert={ouvert === 'marque'} onToggle={() => basculer('marque')} />
    );
  }
  niveaux.forEach((noeuds, index) => {
    etapes.push(
      <NiveauBeneficiaires
        key={`niveau-${index}`}
        noeuds={noeuds}
        niveauPrecedent={niveaux[index - 1]}
        marqueNom={marque.nom}
        marqueId={marque.id}
        ouvert={ouvert}
        onToggle={basculer}
      />
    );
  });

  return (
    <div>
      <div ref={chaineRef}>
        {etapes.map((etape, index) => (
          <Fragment key={index}>
            {index > 0 && <Fleche />}
            {etape}
          </Fragment>
        ))}
      </div>

      <div className="mt-10">
        <BoycottTipsSection marque={marque} />
      </div>
    </div>
  );
}
