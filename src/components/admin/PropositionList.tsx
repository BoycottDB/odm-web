'use client';

import { Proposition, MarqueProposition, EvenementProposition } from '@/types';
import { formatDate } from '@/lib/utils/helpers';

interface PropositionListProps {
  propositions: Proposition[];
  onSelectProposition: (proposition: Proposition) => void;
}

export default function PropositionList({ propositions, onSelectProposition }: PropositionListProps) {
  if (propositions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune proposition en attente</h3>
        <p className="text-gray-500">Toutes les propositions ont été traitées.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Propositions en attente ({propositions.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {propositions.map((proposition) => {
          const isMarque = proposition.type === 'marque';
          const marqueData = isMarque ? (proposition.data as MarqueProposition) : null;
          const eventData = !isMarque ? (proposition.data as EvenementProposition) : null;
          
          return (
            <div
              key={proposition.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectProposition(proposition)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {/* Icône du type */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isMarque ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isMarque ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          isMarque ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isMarque ? 'Marque' : 'Événement'}
                        </span>
                        <span className="text-sm text-gray-500">
                          #{proposition.id}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {isMarque ? marqueData?.nom : `${eventData?.marque_nom} - ${eventData?.description?.substring(0, 50)}...`}
                        </h3>
                        
                        {!isMarque && (
                          <div className="mt-1 text-sm text-gray-500">
                            <span>{eventData?.categorieId || (eventData as any)?.categorie || 'Non spécifiée'}</span>
                            {eventData?.date && <span> • {formatDate(eventData.date)}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Infos temporelles */}
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {formatDate(proposition.created_at)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Il y a {Math.floor((Date.now() - new Date(proposition.created_at).getTime()) / (1000 * 60 * 60))}h
                  </div>
                </div>
                
                {/* Flèche */}
                <div className="ml-4">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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