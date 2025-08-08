'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Marque, MarqueDirigeantCreateRequest, SecteurMarque, MarqueUpdateRequest } from '@/types';
import MarqueDirigeantForm from '@/components/admin/MarqueDirigeantForm';

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
  const [secteurs, setSecteurs] = useState<SecteurMarque[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMarque, setSavingMarque] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [marqueFormData, setMarqueFormData] = useState({
    secteur_marque_id: null as number | null,
    message_boycott_tips: ''
  });
  const router = useRouter();
  
  useEffect(() => {
    loadMarqueData();
    loadSecteurs();
  }, [params.id]);
  
  const loadMarqueData = async () => {
    try {
      const response = await fetch(`/api/marques`);
      if (response.ok) {
        const marques = await response.json();
        const foundMarque = marques.find((m: Marque) => m.id === parseInt(params.id));
        if (foundMarque) {
          setMarque(foundMarque);
          setMarqueFormData({
            secteur_marque_id: foundMarque.secteur_marque_id || null,
            message_boycott_tips: foundMarque.message_boycott_tips || ''
          });
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

  const loadSecteurs = async () => {
    try {
      const response = await fetch('/api/secteurs-marque');
      if (response.ok) {
        const data = await response.json();
        setSecteurs(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error);
    }
  };
  
  const deleteLiaison = async () => {
    if (!marque?.dirigeant_controverse) return;
    
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer la liaison entre ${marque.dirigeant_controverse.dirigeant_nom} et ${marque.nom} ?`);
    if (!confirmed) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/marque-dirigeant?id=${marque.dirigeant_controverse.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
      
      setMessage({ type: 'success', text: 'Liaison supprimée avec succès' });
      await loadMarqueData();
    } catch (error) {
      console.error('Erreur suppression liaison:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la suppression' 
      });
    } finally {
      setSaving(false);
    }
  };

  const saveMarqueData = async () => {
    if (!marque) return;
    
    setSavingMarque(true);
    setMessage(null);
    
    try {
      const updateData: MarqueUpdateRequest = {
        id: marque.id,
        secteur_marque_id: marqueFormData.secteur_marque_id || undefined,
        message_boycott_tips: marqueFormData.message_boycott_tips?.trim() || undefined
      };
      
      const response = await fetch('/api/marques', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }
      
      setMessage({ type: 'success', text: 'Marque mise à jour avec succès' });
      await loadMarqueData();
    } catch (error) {
      console.error('Erreur sauvegarde marque:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' 
      });
    } finally {
      setSavingMarque(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement de la marque...</p>
        </div>
      </div>
    );
  }
  
  if (!marque) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h3 className="heading-sub font-bold text-neutral-900 mb-4">Marque non trouvée</h3>
          <button
            onClick={() => router.push('/admin/marques')}
            className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700"
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
          className="text-neutral-400 hover:text-neutral-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="heading-main font-bold text-neutral-900">
          Édition marque : {marque.nom}
        </h2>
      </div>
      
      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-success-light border border-success text-success' 
            : 'bg-error-light border border-error text-error'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Informations générales marque */}
      <div className="mb-8 p-6 bg-white rounded-lg border border-neutral">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-sub font-semibold text-neutral-900">Informations générales</h3>
          <button
            onClick={saveMarqueData}
            disabled={savingMarque}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {savingMarque ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block body-small font-medium text-neutral-700 mb-1">
              Nom de la marque
            </label>
            <input
              type="text"
              value={marque.nom}
              className="w-full px-3 py-2 border border-neutral rounded-lg bg-neutral-50"
              disabled
            />
          </div>
          <div>
            <label className="block body-small font-medium text-neutral-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={marque.id}
              className="w-full px-3 py-2 border border-neutral rounded-lg bg-neutral-50"
              disabled
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block body-small font-medium text-neutral-700 mb-1">
              Secteur d&apos;activité
            </label>
            <select
              value={marqueFormData.secteur_marque_id || ''}
              onChange={(e) => setMarqueFormData({ 
                ...marqueFormData, 
                secteur_marque_id: e.target.value ? parseInt(e.target.value) : null 
              })}
              className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Aucun secteur</option>
              {secteurs.map(secteur => (
                <option key={secteur.id} value={secteur.id}>
                  {secteur.nom}
                </option>
              ))}
            </select>
            {marque.secteur_marque && (
              <p className="body-xs text-neutral-500 mt-1">
                Secteur actuel : {marque.secteur_marque.nom}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block body-small font-medium text-neutral-700 mb-1">
            Message Boycott Tips spécifique
          </label>
          <textarea
            value={marqueFormData.message_boycott_tips}
            onChange={(e) => setMarqueFormData({ 
              ...marqueFormData, 
              message_boycott_tips: e.target.value 
            })}
            className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
            placeholder="Message spécifique pour cette marque (optionnel). Supporte le markdown : **gras**, listes • etc."
          />
          <p className="body-xs text-neutral-500 mt-1">
            Si renseigné, ce message sera prioritaire sur le message du secteur. Supporte le format Markdown.
          </p>
        </div>
      </div>
      
      {/* Section Boycott Tips preview */}
      {(marqueFormData.message_boycott_tips || (marque.secteur_marque?.message_boycott_tips)) && (
        <div className="mb-8 p-6 bg-warning-light rounded-lg border border-warning">
          <h3 className="heading-sub font-semibold text-neutral-900 mb-4">
            💡 Aperçu Boycott Tips
          </h3>
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="body-large font-medium mb-2">
              Comment bien boycotter {marque.nom} ?
            </h4>
            <div className="body-small text-neutral-600 whitespace-pre-wrap">
              {marqueFormData.message_boycott_tips ? (
                <>
                  <strong>Message spécifique :</strong>
                  <br />
                  {marqueFormData.message_boycott_tips}
                </>
              ) : marque.secteur_marque?.message_boycott_tips ? (
                <>
                  <strong>Message du secteur &quot;{marque.secteur_marque.nom}&quot; :</strong>
                  <br />
                  {marque.secteur_marque.message_boycott_tips}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Section dirigeant controversé */}
      <div className="mb-8 p-6 bg-primary-light rounded-lg border border-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-sub font-semibold text-neutral-900">
            ⚠️ Dirigeant controversé
          </h3>
          
          {marque.dirigeant_controverse && (
            <button
              onClick={deleteLiaison}
              disabled={saving}
              className="body-small text-error hover:text-error underline disabled:opacity-50"
            >
              Supprimer liaison
            </button>
          )}
        </div>
        
        {marque.dirigeant_controverse ? (
          <div>
            <div className="mb-6 p-4 bg-success-light border border-success rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="body-small text-success font-medium">
                  Dirigeant lié : <strong>{marque.dirigeant_controverse.dirigeant_nom}</strong>
                </p>
              </div>
              <div className="body-xs text-success">
                <p><strong>Lien financier :</strong> {marque.dirigeant_controverse.lien_financier}</p>
                <p><strong>Impact :</strong> {marque.dirigeant_controverse.impact_description}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (marque.dirigeant_controverse?.dirigeant_id) {
                    router.push(`/admin/dirigeants/${marque.dirigeant_controverse.dirigeant_id}`);
                  } else {
                    alert('ID du dirigeant non trouvé');
                  }
                }}
                className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700"
              >
                Éditer dirigeant
              </button>
              <button
                onClick={() => alert('Fonctionnalité d\'édition de liaison à implémenter')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
              >
                Modifier liaison
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-neutral-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h4 className="body-large font-medium text-neutral-900 mb-2">
              Aucun dirigeant controversé associé
            </h4>
            <p className="text-neutral-600 mb-4">
              Vous pouvez lier un dirigeant controversé existant à cette marque.
            </p>
            <button
              onClick={() => router.push(`/admin/marques/${marque.id}/lier-dirigeant`)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
            >
              Lier un dirigeant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}