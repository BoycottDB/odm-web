'use client';

import { DirigeantResult } from '@/types';

interface DirigeantCardProps {
  dirigeantResult: DirigeantResult;
}

export function DirigeantCard({ dirigeantResult }: DirigeantCardProps) {
  const { marque, dirigeant } = dirigeantResult;

  return (
    <div className="bg-gradient-to-r from-berry-50 to-orange-50 rounded-3xl p-8 shadow-lg border-2 border-berry-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête dirigeant controversé */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-berry-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>         
          {/* Nom du dirigeant */}
          <h3 className="text-2xl font-bold text-gray-900 ">
            {dirigeant.dirigeant_nom}
          </h3>
          <div className="text-berry-600 text-sm">
            Un dirigeant controversé est associé à la marque {marque.nom}
          </div>
        </div>
      </div>


      {/* Informations financières */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="font-semibold text-berry-800 text-sm mb-1">
            Lien financier :
          </div>
          <div className="text-gray-700">
            {dirigeant.lien_financier}
          </div>
        </div>
        
        <div>
          <div className="font-semibold text-berry-800 text-sm mb-1">
            Impact de vos achats :
          </div>
          <div className="text-gray-900 font-medium">
            {dirigeant.impact_description}
          </div>
        </div>
      </div>

      {/* Controverses */}
      <div className="mb-6">
        <div className="font-semibold text-berry-800 text-sm mb-2">
          Controverses documentées :
        </div>
        <div className="text-gray-700 leading-relaxed text-sm">
          {dirigeant.controverses.length > 200 
            ? `${dirigeant.controverses.substring(0, 200)}...`
            : dirigeant.controverses
          }
        </div>
      </div>

      {/* Sources */}
      <div className="pt-4 border-t border-berry-200">
        <div className="font-semibold text-berry-800 text-sm mb-2">
          Sources :
        </div>
        <div className="space-y-1">
          {dirigeant.sources.slice(0, 3).map((source, index) => (
            <div key={index}>
              <a 
                href={source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-berry-600 hover:text-berry-800 underline"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {source.includes('://') ? new URL(source).hostname : source}
              </a>
            </div>
          ))}
          {dirigeant.sources.length > 3 && (
            <div className="text-xs text-berry-600">
              +{dirigeant.sources.length - 3} source(s) supplémentaire(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}