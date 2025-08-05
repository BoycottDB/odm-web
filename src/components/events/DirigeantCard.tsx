'use client';

import { DirigeantResult } from '@/types';

interface DirigeantCardProps {
  dirigeantResult: DirigeantResult;
}

export function DirigeantCard({ dirigeantResult }: DirigeantCardProps) {
  const { marque, dirigeant } = dirigeantResult;

  return (
    <div className="bg-gradient-to-r from-primary-light to-orange-50 rounded-3xl card-padding shadow-lg border-2 border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête dirigeant controversé */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-4">
          <span className="heading-main">⚠️</span>
        </div>
        <div>         
          <div className="text-primary body-small">
            Un dirigeant controversé est associé à la marque <strong className="body-large font-semibold">{marque.nom}</strong>
          </div>
          {/* Nom du dirigeant */}
          <h3 className="heading-sub font-bold text-neutral-900">
            {dirigeant.dirigeant_nom}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
    </div>
  );
}