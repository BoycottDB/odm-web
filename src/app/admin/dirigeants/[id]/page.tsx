'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DirigeantWithMarques, DirigeantCreateRequest, DirigeantUpdateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import DirigeantForm from '@/components/admin/DirigeantForm';

export default function DirigeantDetailPage() {
  const [dirigeant, setDirigeant] = useState<DirigeantWithMarques | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const dirigeantId = parseInt(params.id as string);

  useEffect(() => {
    if (dirigeantId) {
      loadDirigeant();
    }
  }, [dirigeantId]);

  const loadDirigeant = async () => {
    try {
      const response = await fetch('/api/dirigeants');
      if (response.ok) {
        const dirigeants = await response.json();
        const foundDirigeant = dirigeants.find((d: DirigeantWithMarques) => d.id === dirigeantId);
        
        if (!foundDirigeant) {
          setMessage({ type: 'error', text: 'Dirigeant introuvable' });
          return;
        }
        
        setDirigeant(foundDirigeant);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dirigeant:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement du dirigeant' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: DirigeantCreateRequest | DirigeantUpdateRequest) => {
    setSaving(true);
    setMessage(null);

    try {
      // Cette page est réservée à la modification d'un dirigeant existant
      if (!('id' in data)) {
        throw new Error('Ce formulaire est réservé à la modification');
      }
      const response = await fetch('/api/dirigeants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      setMessage({ type: 'success', text: 'Dirigeant modifié avec succès' });
      await loadDirigeant(); // Recharger les données
      
    } catch (error) {
      console.error('Erreur modification dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la modification' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!dirigeant) return;
    
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le dirigeant "${dirigeant.nom}" ?`);
    if (!confirmed) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/dirigeants?id=${dirigeant.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      setMessage({ type: 'success', text: 'Dirigeant supprimé avec succès' });
      
      // Redirection vers la liste
      setTimeout(() => {
        router.push('/admin/dirigeants');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur suppression dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la suppression' 
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
            <p className="text-neutral-600">Chargement du dirigeant...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dirigeant || message?.type === 'error') {
    return (
      <div>
        <AdminNavigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.push('/admin/dirigeants')}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="heading-hero font-bold text-neutral-900">Dirigeant introuvable</h1>
          </div>

          <div className="bg-error-light border border-error text-error p-4 rounded-lg">
            {message?.text || 'Ce dirigeant n\'existe pas ou n\'est plus accessible.'}
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
            onClick={() => router.push('/admin/dirigeants')}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="heading-main font-bold text-neutral-900">{dirigeant.nom}</h1>
            <p className="body-small text-neutral-600">Bénéficiaire controversé</p>
          </div>
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

        {/* Marques liées */}
        {dirigeant.marques.length > 0 && (
          <div className="mb-8 p-6 bg-primary-50 rounded-lg border border-primary">
            <h3 className="heading-sub font-semibold text-neutral-900 mb-4">
              Marques liées ({dirigeant.marques.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dirigeant.marques.map((marque) => (
                <div 
                  key={marque.id} 
                  className="bg-white p-4 rounded-lg border border-neutral hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="body-large font-medium text-neutral-900">{marque.nom}</h4>
                    <button
                      onClick={() => router.push(`/admin/marques/${marque.id}`)}
                      className="text-primary hover:text-primary-hover"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                  <div className="body-small text-neutral-600">
                    <p><strong>Lien :</strong> {marque.lien_financier}</p>
                    {marque.impact_specifique && (
                      <p><strong>Impact :</strong> {marque.impact_specifique}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire d'édition */}
        <div className="bg-white rounded-lg border border-neutral p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="body-large font-semibold text-neutral-900">
              Modifier les informations
            </h2>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="body-small text-error hover:text-error underline disabled:opacity-50"
            >
              Supprimer dirigeant
            </button>
          </div>
          
          <DirigeantForm
            initialData={{
              nom: dirigeant.nom,
              impactGenerique: dirigeant.impact_generique || '',
              typeBeneficiaire: (dirigeant.type_beneficiaire as 'individu' | 'groupe') || 'individu'
            }}
            onSave={handleSave}
            isLoading={saving}
            isEditing={true}
            dirigeantId={dirigeant.id}
          />
        </div>
      </div>
    </div>
  );
}