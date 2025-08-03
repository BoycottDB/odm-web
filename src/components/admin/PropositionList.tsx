'use client';

import { Proposition } from '@/types';
import { formatDate } from '@/lib/utils/helpers';

interface PropositionListProps {
  propositions: Proposition[];
  onSelectProposition: (proposition: Proposition) => void;
}

export default function PropositionList({ propositions, onSelectProposition }: PropositionListProps) {
  if (propositions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-neutral-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="heading-sub font-medium text-neutral-900 mb-2">Aucun signalement en attente</h3>
        <p className="text-neutral-500">Tous les signalements ont été traités.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral">
        <h2 className="heading-sub font-medium text-neutral-900">
          Liste des propositions
        </h2>
      </div>
      
      <div className="divide-y divide-neutral">
        {propositions.map((proposition) => {
          return (
            <div
              key={proposition.id}
              className="px-6 py-4 hover:bg-neutral cursor-pointer transition-colors"
              onClick={() => onSelectProposition(proposition)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 body-xs font-medium rounded bg-success-light text-success">
                          Signalement #{proposition.id}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <h3 className="body-small font-medium text-neutral-900">
                          {proposition.marque_nom} - {proposition.description?.substring(0, 50)}...
                        </h3>
                        
                        <div className="mt-1 body-small text-neutral-500">
                          {proposition.date && <span>{formatDate(proposition.date)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Infos temporelles */}
                <div className="text-right">
                  <div className="body-small text-neutral-500">
                    {formatDate(proposition.created_at)}
                  </div>
                  <div className="body-xs text-neutral-400 mt-1">
                    Il y a {Math.floor((Date.now() - new Date(proposition.created_at).getTime()) / (1000 * 60 * 60))}h
                  </div>
                </div>
                
                {/* Flèche */}
                <div className="ml-4">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}