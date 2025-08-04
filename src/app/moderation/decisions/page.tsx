'use client';

import { useState } from 'react';
import { useDecisions } from '@/hooks/useDecisions';
import { DecisionPublique } from '@/types';

function DecisionCard({ decision }: { decision: DecisionPublique }) {
  const statusConfig = {
    approuve: {
      label: 'VALIDÉ',
      bgColor: 'bg-success-light border-success',
      textColor: 'text-success',
      badgeColor: 'bg-success-light text-success'
    },
    rejete: {
      label: 'REFUSÉ',
      bgColor: 'bg-error-light border-error',
      textColor: 'text-error',
      badgeColor: 'bg-error-light text-error'
    }
  };

  const config = statusConfig[decision.statut];
  const formattedDate = new Date(decision.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={`border rounded-lg p-4 ${config.bgColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <span className={`${config.badgeColor} body-xs font-medium px-2.5 py-0.5 rounded-full mr-3`}>
            {config.label}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-bold text-neutral-900">{decision.marque_nom}</span>
            {decision.titre && <span className="hidden sm:inline text-neutral-400">•</span>}
            <span className="font-medium text-neutral-700">{decision.titre}</span>
          </div>
        </div>
        <span className="body-small text-neutral-500">{formattedDate}</span>
      </div>
      {decision.commentaire_admin && <p className="text-neutral-700 mt-2">
        <strong>Justification :</strong> {decision.commentaire_admin}
      </p>}
      {decision.source_url && (
        <div className="pt-4 border-t border-neutral-200 mt-4">
          <a
            href={decision.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center body-small sm:body-base font-medium text-primary hover:text-primary transition-colors duration-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir la source
          </a>
        </div>
      )}
    </div>
  );
}

export default function DecisionsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const { decisions, loading, error } = useDecisions(limit, offset);

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const handleLoadPrevious = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Historique des décisions
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Toutes les décisions de validation et de refus prises par nos modérateurs
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-neutral-600">Chargement des décisions...</p>
            </div>
          )}

          {error && (
            <div className="bg-error-light border border-error rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-error mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H4" />
                </svg>
                <div>
                  <p className="text-error font-medium">Erreur de chargement</p>
                  <p className="text-error body-small">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && decisions.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="heading-main text-neutral-900 mb-2">Aucune décision publique</h3>
              <p className="text-neutral-600">Aucune décision de modération n&apos;a encore été rendue publique.</p>
            </div>
          )}

          {!loading && !error && decisions.length > 0 && (
            <>
              <div className="space-y-4 mb-8">
                {decisions.map((decision) => (
                  <DecisionCard key={decision.id} decision={decision} />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleLoadPrevious}
                  disabled={offset === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
                </button>

                <span className="text-neutral-600 body-small">
                  Affichage {offset + 1} à {offset + decisions.length}
                </span>

                <button
                  onClick={handleLoadMore}
                  disabled={decisions.length < limit}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}