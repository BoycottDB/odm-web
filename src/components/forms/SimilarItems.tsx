'use client';

import { Marque, Evenement, SimilarityScore } from '@/types';

interface SimilarResults {
  marques: Array<Marque & { score: SimilarityScore }>;
  evenements: Array<Evenement & { score: SimilarityScore }>;
}

interface SimilarItemsProps {
  results: SimilarResults;
}

export default function SimilarItems({ results }: SimilarItemsProps) {
  const hasHighSimilarity = results.evenements.some(e => e.score.overall >= 0.8);

  const getSimilarityLabel = (score: number) => {
    if (score >= 0.8) return { label: 'Très similaire', color: 'text-red-600 bg-red-50 border-red-200' };
    if (score >= 0.6) return { label: 'Similaire', color: 'text-berry-600 bg-berry-50 border-berry-200' };
    return { label: 'Possiblement similaire', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start mb-4">
        <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ℹ️ Controverses similaires trouvées
          </h3>
        </div>
      </div>

      <div className="space-y-4">

        {/* Controverses similaires */}
        {results.evenements.length > 0 && (
          <div className="space-y-2">
            {results.evenements.map((evenement) => {
              const similarity = getSimilarityLabel(evenement.score.overall);
              return (
                <div key={evenement.id} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {evenement.marque?.nom || 'Marque inconnue'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {evenement.description.length > 100 
                          ? `${evenement.description.substring(0, 100)}...`
                          : evenement.description
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {evenement.date}{evenement.categorie?.nom && ` • ${evenement.categorie.nom}`}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${similarity.color} ml-3`}>
                      {similarity.label} ({Math.round(evenement.score.overall * 100)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="text-sm text-blue-800">
            <span className="font-medium">
              💡 Des controverses similaires existent déjà. Merci de vérifier qu&apos;il ne s&apos;agit pas d&apos;un doublon avant de soumettre votre signalement.
            </span>
        </div>
      </div>
    </div>
  );
}