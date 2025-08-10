'use client';

import { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { DirigeantCard } from './DirigeantCard'; // Réutilisé tel quel
import { BeneficiaireComplet, TypeBeneficiaire } from '@/types';

interface BeneficiaireNavigationProps {
  beneficiaires: BeneficiaireComplet[];
}

export function BeneficiaireNavigation({ beneficiaires }: BeneficiaireNavigationProps) {
  const [beneficiaireActif, setBeneficiaireActif] = useState(0);

  // Si un seul bénéficiaire, pas d'onglets
  if (beneficiaires.length <= 1) {
    return beneficiaires.length === 1 ? (
      <DirigeantCard dirigeant={beneficiaires[0]} />
    ) : null;
  }

  const beneficiaireCourant = beneficiaires[beneficiaireActif];

  // Fonction helper pour les labels
  const getTypeLabel = (type: TypeBeneficiaire): string => {
    return type === 'groupe' ? 'Groupe' : 'Dirigeant';
  };

  const getTypeIcon = (type: TypeBeneficiaire) => {
    return type === 'groupe' ? Building2 : User;
  };

  return (
    <div>
      {/* Navigation simple entre bénéficiaires */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {beneficiaires.map((beneficiaire, index) => {
          const isActive = index === beneficiaireActif;
          const Icon = getTypeIcon(beneficiaire.type_beneficiaire);
          const typeLabel = getTypeLabel(beneficiaire.type_beneficiaire);

          return (
            <button
              key={`${beneficiaire.id}-${index}`}
              onClick={() => setBeneficiaireActif(index)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm max-w-48
                ${isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-primary hover:bg-primary-light border border-primary'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{beneficiaire.nom}</div>
                <div className="text-xs opacity-75">{typeLabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* DirigeantCard existante (inchangée, juste les props adaptées) */}
      <DirigeantCard dirigeant={beneficiaireCourant} />
    </div>
  );
}

export default BeneficiaireNavigation;