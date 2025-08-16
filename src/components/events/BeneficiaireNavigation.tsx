'use client';

import { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { DirigeantCard } from './DirigeantCard'; // Réutilisé tel quel
import { BeneficiaireComplet, TypeBeneficiaire } from '@/types';

interface BeneficiaireNavigationProps {
  beneficiaires: BeneficiaireComplet[];
}

export function BeneficiaireNavigation({ beneficiaires }: BeneficiaireNavigationProps) {
  const [beneficiaireActif, setBeneficiaireActif] = useState<number | null>(null);

  // Si aucun bénéficiaire, ne rien afficher
  if (beneficiaires.length === 0) {
    return null;
  }

  const beneficiaireCourant = beneficiaireActif !== null ? beneficiaires[beneficiaireActif] : null;

  // Fonction helper pour les labels
  const getTypeLabel = (type: TypeBeneficiaire): string => {
    return type === 'groupe' ? 'Groupe' : 'Dirigeant';
  };

  const getTypeIcon = (type: TypeBeneficiaire) => {
    return type === 'groupe' ? Building2 : User;
  };

  return (
    <div>
      {/* Navigation entre bénéficiaires - toujours visible */}
      <div className="flex flex-wrap justify-center gap-4">
        {beneficiaires.map((beneficiaire, index) => {
          const isActive = index === beneficiaireActif;
          const Icon = getTypeIcon(beneficiaire.type_beneficiaire);
          const typeLabel = getTypeLabel(beneficiaire.type_beneficiaire);

          return (
            <button
              key={`${beneficiaire.id}-${index}`}
              onClick={() => setBeneficiaireActif(isActive ? null : index)}
              className={`
                flex items-center gap-2 px-4 md:px-6 py-4 rounded-lg font-medium transition-all text-sm md:text-base max-w-48
                ${isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white text-primary hover:bg-primary-light border border-primary'
                }
              `}
            >
              <Icon className="md:w-8 md:h-8 flex-shrink-0" />
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{beneficiaire.nom}</div>
                <div className="text-xs opacity-75">{typeLabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* DirigeantCard avec bouton de fermeture intégré - seulement si sélectionnée */}
      {beneficiaireCourant && (
        <DirigeantCard 
          dirigeant={beneficiaireCourant} 
          onClose={() => setBeneficiaireActif(null)}
        />
      )}
    </div>
  );
}

export default BeneficiaireNavigation;