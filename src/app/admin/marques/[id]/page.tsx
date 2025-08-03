'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Marque, MarqueDirigeantCreateRequest } from '@/types';
import DirigentForm from '@/components/admin/DirigentForm';

interface MarqueEditPageProps {
  params: Promise<{ id: string }>;
}

export default function MarqueEditPage({ params }: MarqueEditPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);
  
  if (!resolvedParams) {
    return <div>Loading...</div>;
  }
  
  return <MarqueEditContent params={resolvedParams} />;
}

function MarqueEditContent({ params }: { params: { id: string } }) {
  const [marque, setMarque] = useState<Marque | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    loadMarqueData();
  }, [params.id]);
  
  const loadMarqueData = async () => {
    try {
      const response = await fetch(`/api/marques`);
      if (response.ok) {
        const marques = await response.json();
        const foundMarque = marques.find((m: Marque) => m.id === parseInt(params.id));
        if (foundMarque) {
          setMarque(foundMarque);
        } else {
          setMessage({ type: 'error', text: 'Marque non trouvée' });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la marque:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
    } finally {
      setLoading(false);
    }
  };
  
  const saveDirigeantData = async (data: MarqueDirigeantCreateRequest) => {
    setSaving(true);
    setMessage(null);
    
    try {
      if (marque?.dirigeant_controverse) {
        // Mise à jour
        const response = await fetch(`/api/dirigeants`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: marque.dirigeant_controverse.id, 
            ...data 
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la mise à jour');
        }
        
        setMessage({ type: 'success', text: 'Dirigeant mis à jour avec succès' });
      } else {
        // Création
        const response = await fetch('/api/dirigeants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la création');
        }
        
        setMessage({ type: 'success', text: 'Dirigeant créé avec succès' });
        
        // Redirection vers la page de détail du dirigeant après création
        setTimeout(() => {
          router.push(`/admin/dirigeants/${encodeURIComponent(data.dirigeant_nom)}`);
        }, 1000);
      }
      
      // Recharger les données (seulement pour les mises à jour)
      if (marque?.dirigeant_controverse) {
        await loadMarqueData();
      }
    } catch (error) {
      console.error('Erreur sauvegarde dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' 
      });
    } finally {
      setSaving(false);
    }
  };
  
  const deleteDirigeant = async () => {
    if (!marque?.dirigeant_controverse) return;
    
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer ce dirigeant controversé ?');
    if (!confirmed) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/dirigeants?id=${marque.dirigeant_controverse.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
      
      setMessage({ type: 'success', text: 'Dirigeant supprimé avec succès' });
      await loadMarqueData();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-berry-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la marque...</p>
        </div>
      </div>
    );
  }
  
  if (!marque) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Marque non trouvée</h1>
          <button
            onClick={() => router.push('/admin/marques')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.push('/admin/marques')}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Édition marque : {marque.nom}
        </h1>
      </div>
      
      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Informations générales marque */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la marque
            </label>
            <input
              type="text"
              value={marque.nom}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={marque.id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
      </div>
      
      {/* Section dirigeant controversé */}
      <div className="p-6 bg-berry-50 rounded-lg border border-berry-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            ⚠️ Dirigeant controversé
          </h2>
          
          {marque.dirigeant_controverse && (
            <button
              onClick={deleteDirigeant}
              disabled={saving}
              className="text-sm text-red-600 hover:text-red-800 underline disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
        
        {marque.dirigeant_controverse && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800 font-medium">
                Dirigeant configuré : <strong>{marque.dirigeant_controverse.dirigeant_nom}</strong>
              </p>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Le badge apparaît sur la fiche publique de la marque
            </p>
          </div>
        )}
        
        <DirigentForm
          marqueId={marque.id}
          initialData={marque.dirigeant_controverse ? {
            nom: marque.dirigeant_controverse.dirigeant_nom,
            controverses: marque.dirigeant_controverse.controverses,
            lienFinancier: marque.dirigeant_controverse.lien_financier,
            impact: marque.dirigeant_controverse.impact_description,
            sources: marque.dirigeant_controverse.sources
          } : undefined}
          onSave={saveDirigeantData}
          isLoading={saving}
        />
      </div>
    </div>
  );
}