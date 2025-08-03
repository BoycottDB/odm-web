'use client';

import { Marque, Evenement, Proposition, SimilarityScore } from '@/types';
import { Badge } from '../ui/Badge';

interface SimilarResults {
  marques: Array<Marque & { score: SimilarityScore }>;
  evenements: Array<Evenement & { score: SimilarityScore }>;
  propositions: Array<Proposition & { score: SimilarityScore }>;
}

interface SimilarItemsProps {
  results: SimilarResults;
}

export default function SimilarItems({ results }: SimilarItemsProps) {
  const getSimilarityLabel = (score: number) => {
    if (score >= 0.8) return { label: 'Très similaire', color: 'text-red-600 bg-red-50 border-red-200' };
    if (score >= 0.6) return { label: 'Similaire', color: 'text-berry-600 bg-berry-50 border-berry-200' };
    return { label: 'Possiblement similaire', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
  };

  // Filtrer les résultats avec un score > 60%
  const relevantControversies = results.evenements.filter(e => e.score.overall > 0.6);
  const relevantPropositions = results.propositions?.filter(p => p.score.overall > 0.6) || [];
  
  const hasValidatedControversies = relevantControversies.length > 0;
  const hasPendingPropositions = relevantPropositions.length > 0;

  if (!hasValidatedControversies && !hasPendingPropositions) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Section 1: Controverses déjà validées */}
      {hasValidatedControversies && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Controverses similaires trouvées</h3>
            </div>
          </div>

          <div className="space-y-2">
            {relevantControversies.map((evenement) => {
              const similarity = getSimilarityLabel(evenement.score.overall);
              return (
                <div key={evenement.id} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 items-center inline-flex">
                        {evenement.marque?.nom || 'Marque inconnue'}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-category text-gray-800 border border-indigo-200`}>
                          {evenement.categorie?.nom}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {evenement.titre.length > 100 
                          ? `${new Date(evenement.date).toLocaleDateString('fr-FR') + " · " + evenement.titre.substring(0, 100)}...`
                          : `${new Date(evenement.date).toLocaleDateString('fr-FR') + " · " + evenement.titre}`
                        }
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${similarity.color} ml-3`}>
                      {similarity.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="text-sm text-blue-800">
              <span className="font-medium">
                Des controverses similaires existent déjà.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Signalements en attente */}
      {hasPendingPropositions && (
        <div className="bg-berry-50 border border-berry-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-berry-600 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-berry-900 mb-2">Signalements en attente de modération</h3>
            </div>
          </div>

          <div className="space-y-2">
            {relevantPropositions.map((proposition) => {
              const similarity = getSimilarityLabel(proposition.score.overall);
              return (
                <div key={proposition.id} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {proposition.marque_nom}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {proposition.description.length > 100 
                          ? `${new Date(proposition.date).toLocaleDateString('fr-FR') + " · " + proposition.description.substring(0, 100)}...`
                          : `${new Date(proposition.date).toLocaleDateString('fr-FR') + " · " + proposition.description}`
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Signalé le {new Date(proposition.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${similarity.color} ml-3`}>
                      {similarity.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-berry-200">
            <div className="text-sm text-berry-800">
              <span className="font-medium">
                ⚠️ Ces signalements similaires sont en cours d&apos;examen par notre équipe.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message global */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-yellow-800">
          <span className="font-medium">
            🔍 Merci de vérifier qu&apos;il ne s&apos;agit pas d&apos;un doublon.
          </span>
        </div>
      </div>
    </div>
  );
}