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
    if (score >= 0.8) return { label: 'Très similaire', color: 'text-error bg-error-light border-error' };
    if (score >= 0.6) return { label: 'Similaire', color: 'text-primary bg-primary-light border-primary' };
    return { label: 'Possiblement similaire', color: 'text-warning bg-warning-light border-warning' };
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
        <div className="bg-info-light border border-info rounded-lg p-6">
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-info mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="body-large font-semibold text-info mb-2">Controverses similaires trouvées</h3>
            </div>
          </div>

          <div className="space-y-2">
            {relevantControversies.map((evenement) => {
              const similarity = getSimilarityLabel(evenement.score.overall);
              return (
                <div key={evenement.id} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900 items-center inline-flex">
                        {evenement.marque?.nom || 'Marque inconnue'}
                        <span className={`ml-2 px-2 py-0.5 rounded-full body-xs font-medium bg-accent-category text-neutral-800 border border-info`}>
                          {evenement.categorie?.nom}
                        </span>
                      </div>
                      <div className="body-small text-neutral-600 mt-1">
                        {evenement.titre.length > 100 
                          ? `${new Date(evenement.date).toLocaleDateString('fr-FR') + " · " + evenement.titre.substring(0, 100)}...`
                          : `${new Date(evenement.date).toLocaleDateString('fr-FR') + " · " + evenement.titre}`
                        }
                      </div>
                      {evenement.source_url && (
                        <div className="body-xs text-neutral-500 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Source: <a href={evenement.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 truncate max-w-xs">{(() => {
                            try {
                              return new URL(evenement.source_url).hostname;
                            } catch {
                              return evenement.source_url.length > 30 ? evenement.source_url.substring(0, 30) + '...' : evenement.source_url;
                            }
                          })()}</a>
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded body-xs font-medium border ${similarity.color} ml-3`}>
                      {similarity.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-info">
            <div className="body-small text-info">
              <span className="font-medium">
                Des controverses similaires existent déjà.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Signalements en attente */}
      {hasPendingPropositions && (
        <div className="bg-primary-light border border-primary rounded-lg p-6">
          <div className="flex items-start mb-4">
            <svg className="w-6 h-6 text-primary mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="body-large font-semibold text-primary mb-2">Signalements en attente de modération</h3>
            </div>
          </div>

          <div className="space-y-2">
            {relevantPropositions.map((proposition) => {
              const similarity = getSimilarityLabel(proposition.score.overall);
              return (
                <div key={proposition.id} className="bg-white p-3 rounded border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        {proposition.marque_nom}
                      </div>
                      <div className="body-small text-neutral-600 mt-1">
                        {proposition.description.length > 100 
                          ? `${new Date(proposition.date).toLocaleDateString('fr-FR') + " · " + proposition.description.substring(0, 100)}...`
                          : `${new Date(proposition.date).toLocaleDateString('fr-FR') + " · " + proposition.description}`
                        }
                      </div>
                      <div className="body-xs text-neutral-500 mt-1">
                        Signalé le {new Date(proposition.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      {proposition.source_url && (
                        <div className="body-xs text-neutral-500 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Source: <a href={proposition.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 truncate max-w-xs">{(() => {
                            try {
                              return new URL(proposition.source_url).hostname;
                            } catch {
                              return proposition.source_url.length > 30 ? proposition.source_url.substring(0, 30) + '...' : proposition.source_url;
                            }
                          })()}</a>
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded body-xs font-medium border ${similarity.color} ml-3`}>
                      {similarity.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-primary">
            <div className="body-small text-primary">
              <span className="font-medium">
                ⚠️ Ces signalements similaires sont en cours d&apos;examen par notre équipe.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message global */}
      <div className="bg-warning-light border border-warning rounded-lg p-4">
        <div className="body-small text-warning">
          <span className="font-medium">
            🔍 Merci de vérifier qu&apos;il ne s&apos;agit pas d&apos;un doublon.
          </span>
        </div>
      </div>
    </div>
  );
}