'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MarqueBeneficiaireCreateRequest, MarqueDirigeantUpdateRequest, Marque } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import MarqueDirigeantForm from '@/components/admin/MarqueDirigeantForm';

export default function LierDirigeantPage() {
  const [marque, setMarque] = useState<Marque | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const marqueId = parseInt(params.id as string);

  const loadMarque = useCallback(async () => {
    try {
      const response = await fetch(`/api/marques`);
      if (response.ok) {
        const marques = await response.json();
        const foundMarque = marques.find((m: Marque) => m.id === marqueId);
        
        if (!foundMarque) {
          setMessage({ type: 'error', text: 'Marque introuvable' });
          return;
        }
        
        if (foundMarque.beneficiaires_marque && foundMarque.beneficiaires_marque.length > 0) {
          setMessage({ type: 'error', text: 'Cette marque a déjà un bénéficiaire controversé associé' });
          return;
        }
        
        setMarque(foundMarque);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la marque:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement de la marque' });
    } finally {
      setLoading(false);
    }
  }, [marqueId]);

  useEffect(() => {
    if (marqueId) {
      loadMarque();
    }
  }, [marqueId, loadMarque]);

  const handleSave = async (data: MarqueBeneficiaireCreateRequest | MarqueDirigeantUpdateRequest) => {
    setSaving(true);
    setMessage(null);

    try {
      // Cette page est réservée à la création d'une liaison
      if ('id' in data) {
        throw new Error('Ce formulaire est réservé à la création d\'une liaison');
      }
      const response = await fetch('/api/marque-dirigeant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la liaison');
      }

      setMessage({ type: 'success', text: 'Liaison créée avec succès' });
      
      // Redirection vers la page de la marque
      setTimeout(() => {
        router.push(`/admin/marques/${marqueId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur création liaison:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la liaison' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!marque || message?.type === 'error') {
    return (
      <div>
        <AdminNavigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.push('/admin/marques')}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="heading-hero font-bold text-neutral-900">Lier bénéficiaire controversé</h1>
          </div>

          <div className="bg-error-light border border-error text-error p-4 rounded-lg">
            {message?.text || 'Une erreur est survenue'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push(`/admin/marques/${marqueId}`)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="heading-hero font-bold text-neutral-900">
            Lier bénéficiaire controversé
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-success-light border border-success text-success' 
              : 'bg-error-light border border-error text-error'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg border border-neutral p-6">
          <h2 className="body-large font-semibold text-neutral-900 mb-4">
            Liaison dirigeant-marque
          </h2>
          <p className="body-small text-neutral-600 mb-6">
            Sélectionnez un bénéficiaire controversé existant et définissez son lien avec cette marque.
          </p>
          
          <MarqueDirigeantForm
            marqueId={marqueId}
            marqueNom={marque.nom}
            onSave={handleSave}
            isLoading={saving}
            isEditing={false}
          />
        </div>
      </div>
    </div>
  );
}