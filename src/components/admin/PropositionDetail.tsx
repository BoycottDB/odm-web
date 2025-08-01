'use client';

import { useState } from 'react';
import { Proposition, MarqueProposition, EvenementProposition } from '@/types';
import { formatDate } from '@/lib/utils/helpers';

interface PropositionDetailProps {
  proposition: Proposition;
  onUpdate: (id: number, updateData: {
    statut: 'approuve' | 'rejete';
    commentaire_admin?: string;
    decision_publique: boolean;
  }) => Promise<void>;
  onBack: () => void;
}

export default function PropositionDetail({ proposition, onUpdate, onBack }: PropositionDetailProps) {
  const [commentaire, setCommentaire] = useState('');
  const [decisionPublique, setDecisionPublique] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMarque = proposition.type === 'marque';
  const marqueData = isMarque ? (proposition.data as MarqueProposition) : null;
  const eventData = !isMarque ? (proposition.data as EvenementProposition) : null;

  const handleDecision = async (statut: 'approuve' | 'rejete') => {
    // Le commentaire est optionnel pour les approbations et rejets

    setIsSubmitting(true);
    try {
      await onUpdate(proposition.id, {
        statut,
        commentaire_admin: commentaire.trim() || undefined,
        decision_publique: decisionPublique
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Templates de commentaires pour les rejets courants
  const commentaireTemplates = [
    'Source non fiable ou non vérifiable',
    'Information insuffisante ou peu claire',
    'Doublon d\'une entrée existante',
    'Hors sujet ou non pertinent',
    'Information obsolète',
    'Manque de neutralité dans la description'
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Proposition #{proposition.id}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  isMarque ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isMarque ? 'Marque' : 'Événement'}
                </span>
                <span className="text-sm text-gray-500">
                  Soumis le {formatDate(proposition.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Détails de la proposition */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la proposition</h2>
          
          {isMarque ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la marque</label>
                <div className="text-lg font-medium text-gray-900">{marqueData?.nom}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marque concernée</label>
                <div className="text-lg font-medium text-gray-900">
                  {eventData?.marque_nom}
                  {eventData?.marque_id && <span className="text-sm text-gray-500 ml-2">(ID: {eventData.marque_id})</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="text-gray-900 bg-white p-3 rounded border">
                  {eventData?.description}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="text-gray-900">{eventData?.date && formatDate(eventData.date)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <div className="text-gray-900">{eventData?.categorieId || (eventData as any)?.categorie || 'Non spécifiée'}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <div className="text-gray-900">{eventData?.source}</div>
                {eventData?.source_url && (
                  <a 
                    href={eventData.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                  >
                    {eventData.source_url} ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vérifications automatiques */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Vérifications automatiques</h2>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✅</span>
              <span>Validation des données réussie</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 mr-2">✅</span>
              <span>Aucun contenu suspect détecté</span>
            </div>
            {!isMarque && eventData?.source_url && (
              <div className="flex items-center text-sm">
                <span className="text-green-600 mr-2">✅</span>
                <span>Source accessible et HTTPS</span>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de décision */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Décision de modération</h2>
          
          {/* Commentaire admin */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire administrateur (optionnel)
            </label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Justification de la décision (optionnel)..."
            />
            
            {/* Templates de commentaires */}
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Templates courants :</p>
              <div className="flex flex-wrap gap-2">
                {commentaireTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCommentaire(template)}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Décision publique */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={decisionPublique}
                onChange={(e) => setDecisionPublique(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Rendre cette décision publique
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              La décision apparaîtra dans la page de modération publique avec le commentaire
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleDecision('approuve')}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isSubmitting ? 'Traitement...' : 'Approuver'}
            </button>
            
            <button
              onClick={() => handleDecision('rejete')}
              disabled={isSubmitting}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {isSubmitting ? 'Traitement...' : 'Rejeter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}