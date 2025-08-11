'use client';

import { User, Building2 } from 'lucide-react';
import { DirigeantComplet, TypeBeneficiaire } from '@/types';
import { MarquesBadges } from '@/components/ui/MarquesBadges';

interface DirigeantCardProps {
  dirigeant: DirigeantComplet;
}

export function DirigeantCard({ dirigeant }: DirigeantCardProps) {

  // Fonction helper pour les labels
  const getTypeLabel = (type: TypeBeneficiaire): string => {
    return type === 'groupe' ? 'groupe' : 'dirigeant';
  };

  const getTypeIcon = (type: TypeBeneficiaire) => {
    return type === 'groupe' ? Building2 : User;
  };

  const Icon = getTypeIcon(dirigeant.type_beneficiaire);
  const typeLabel = getTypeLabel(dirigeant.type_beneficiaire);

  return (
    <div className="bg-gradient-to-r from-primary-light to-berry-50 rounded-3xl card-padding shadow-lg border-2 border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête bénéficiaire controversé */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-4">
        <Icon className="w-7 h-7 text-primary flex-shrink-0" />
        </div>
        <div>         
          <div className="text-primary body-small">
            Un {typeLabel} controversé est associé à la marque <strong className="body-large font-semibold">{dirigeant.marque_nom}</strong>
          </div>
          {/* Nom du dirigeant */}
          <h3 className="heading-sub font-bold text-neutral-900">
            {dirigeant.nom}
          </h3>
        </div>
      </div>


      {/* Informations financières */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="font-semibold text-primary body-small mb-1">
            Lien financier :
          </div>
          <div className="text-neutral-700">
            {dirigeant.lien_financier}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-primary body-small mb-1">
            Impact de vos achats :
          </div>
          <div className="text-neutral-900 font-medium">
            {dirigeant.impact_description}
          </div>
        </div>
      </div>

      {/* Controverses */}
      <div className="mb-6">
        <div className="font-semibold text-primary body-small mb-2">
          Controverses documentées :
        </div>
        <div className="text-neutral-700 leading-relaxed body-small">
          {dirigeant.controverses.length > 200 
            ? `${dirigeant.controverses.substring(0, 200)}...`
            : dirigeant.controverses
          }
        </div>
      </div>


      {/* Sources */}
      <div className="pt-4 border-t border-primary">
        <div className="font-semibold text-primary body-small mb-2">
          Sources :
        </div>
        <div className="space-y-1">
          {dirigeant.sources.slice(0, 3).map((source, index) => (
            <div key={index}>
              <a 
                href={source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center body-small text-primary hover:text-primary underline"
                >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {source.includes('://') ? new URL(source).hostname : source}
              </a>
            </div>
          ))}
          {dirigeant.sources.length > 3 && (
            <div className="body-xs text-primary">
              +{dirigeant.sources.length - 3} source(s) supplémentaire(s)
            </div>
          )}
        </div>
      </div>

      {/* Toutes les marques liées */}
      {dirigeant.toutes_marques && dirigeant.toutes_marques.length > 1 && (
        <div className="mt-6 pt-4 border-t border-primary">
          <div className="font-semibold text-black body-small mb-3">
            Autres marques également liées à {dirigeant.nom} ({dirigeant.toutes_marques.length - 1}) :
          </div>
          <MarquesBadges 
            marques={dirigeant.toutes_marques.filter(m => m.id !== dirigeant.marque_id)}
            variant="public"
          />
        </div>
      )}

    </div>
  );
}