'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DirigeantWithMarques, Marque } from '@/types';

interface DirigeantDetailClientProps {
  dirigeantNom: string;
}

export function DirigeantDetailClient({ dirigeantNom }: DirigeantDetailClientProps) {
  const [dirigeant, setDirigent] = useState<DirigeantWithMarques | null>(null);
  const [availableMarques, setAvailableMarques] = useState<Marque[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    controverses: '',
    sources: ['']
  });
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    loadData();
  }, [dirigeantNom]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadData = async () => {
    try {
      // Charger les dirigeants
      const [dirigeantsResponse, marquesResponse] = await Promise.all([
        fetch('/api/dirigeants'),
        fetch('/api/marques')
      ]);
      
      if (dirigeantsResponse.ok && marquesResponse.ok) {
        const dirigeants = await dirigeantsResponse.json();
        const marques = await marquesResponse.json();
        
        const foundDirigent = dirigeants.find((d: DirigeantWithMarques) => d.nom === dirigeantNom);
        if (foundDirigent) {
          setDirigent(foundDirigent);
          
          // Initialiser le formulaire d'édition
          setEditForm({
            nom: foundDirigent.nom,
            controverses: foundDirigent.controverses,
            sources: foundDirigent.sources
          });
          
          // Marques disponibles = toutes les marques - celles déjà liées à ce dirigeant
          const linkedMarqueIds = foundDirigent.marques.map((m: Marque & { liaison_id?: number }) => m.id);
          const available = marques.filter((m: Marque) => 
            !linkedMarqueIds.includes(m.id) && !m.dirigeant_controverse
          );
          setAvailableMarques(available);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
    } finally {
      setLoading(false);
    }
  };
  
  
  const unlinkMarque = async (marqueId: number, marqueNom: string) => {
    const confirmed = confirm(`Supprimer la liaison avec ${marqueNom} ?`);
    if (!confirmed) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      // Trouver l'ID de la liaison depuis les données du dirigeant
      const marqueToUnlink = dirigeant?.marques.find(m => m.id === marqueId);
      
      if (!marqueToUnlink || !('liaison_id' in marqueToUnlink) || !(marqueToUnlink as { liaison_id?: number }).liaison_id) {
        throw new Error('ID de liaison introuvable');
      }
      
      const deleteResponse = await fetch(`/api/dirigeants?id=${(marqueToUnlink as { liaison_id: number }).liaison_id}`, {
        method: 'DELETE'
      });
      
      if (!deleteResponse.ok) {
        const error = await deleteResponse.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }
      
      setMessage({ type: 'success', text: `Liaison avec ${marqueNom} supprimée` });
      await loadData();
      
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

  const updateSources = (sourcesText: string) => {
    const sources = sourcesText.split('\n').filter(s => s.trim());
    const newEditForm = { ...editForm, sources };
    setEditForm(newEditForm);
    checkForChanges(newEditForm);
  };

  const updateEditForm = (field: string, value: string) => {
    const newEditForm = { ...editForm, [field]: value };
    setEditForm(newEditForm);
    checkForChanges(newEditForm);
  };

  const checkForChanges = (formData: typeof editForm) => {
    if (!dirigeant) return;
    
    const hasChanged = 
      formData.nom !== dirigeant.nom ||
      formData.controverses !== dirigeant.controverses ||
      JSON.stringify(formData.sources.sort()) !== JSON.stringify(dirigeant.sources.sort());
    
    setHasChanges(hasChanged);
  };

  const saveDirigeantEdit = async () => {
    if (!dirigeant || !editForm.nom.trim() || !editForm.controverses.trim() || editForm.sources.length === 0) {
      setMessage({ type: 'error', text: 'Tous les champs sont obligatoires' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // Trouver l'ID d'une liaison existante pour cet update
      const marqueWithLiaison = dirigeant.marques[0];
      if (!marqueWithLiaison || !('liaison_id' in marqueWithLiaison) || !(marqueWithLiaison as { liaison_id?: number }).liaison_id) {
        throw new Error('Impossible de trouver l\'ID de liaison pour la mise à jour');
      }

      const updateData = {
        id: (marqueWithLiaison as { liaison_id: number }).liaison_id,
        dirigeant_nom: editForm.nom.trim(),
        controverses: editForm.controverses.trim(),
        sources: editForm.sources.filter(s => s.trim())
      };

      const response = await fetch('/api/dirigeants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      setMessage({ type: 'success', text: 'Dirigeant mis à jour avec succès' });
      setHasChanges(false);
      
      // Si le nom a changé, rediriger vers la nouvelle URL
      if (editForm.nom !== dirigeant.nom) {
        setTimeout(() => {
          router.push(`/admin/dirigeants/${encodeURIComponent(editForm.nom)}`);
        }, 1000);
      } else {
        await loadData();
      }

    } catch (error) {
      console.error('Erreur mise à jour dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' 
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
          <p className="text-gray-600">Chargement du dirigeant...</p>
        </div>
      </div>
    );
  }
  
  if (!dirigeant) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dirigeant non trouvé</h1>
          <button
            onClick={() => router.push('/admin/dirigeants')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.push('/admin/dirigeants')}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={editForm.nom}
            onChange={(e) => updateEditForm('nom', e.target.value)}
            className="text-3xl font-bold text-gray-900 bg-transparent border-2 border-transparent hover:border-gray-300 focus:border-berry-500 focus:outline-none rounded px-2 py-1 w-full"
            maxLength={255}
            disabled={saving}
          />
        </div>
        {hasChanges && (
          <button
            onClick={saveDirigeantEdit}
            disabled={saving || !editForm.nom.trim() || !editForm.controverses.trim() || editForm.sources.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        )}
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations dirigeant - Éditables */}
        <div className="bg-berry-50 rounded-lg border border-berry-200 p-6">
          <h2 className="text-xl font-semibold text-berry-900 mb-4">Informations dirigeant</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-berry-800 mb-2">
                Controverses documentées *
              </label>
              <textarea
                value={editForm.controverses}
                onChange={(e) => updateEditForm('controverses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500 bg-white"
                rows={6}
                maxLength={2000}
                disabled={saving}
                placeholder="Décrivez les controverses documentées..."
              />
              <p className="text-xs text-berry-600 mt-1">
                {editForm.controverses.length}/2000 caractères (minimum 20)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-berry-800 mb-2">
                Sources (une par ligne) *
              </label>
              <textarea
                value={editForm.sources.join('\n')}
                onChange={(e) => updateSources(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500 bg-white"
                rows={4}
                disabled={saving}
                placeholder="https://exemple1.com&#10;https://exemple2.com"
              />
              <p className="text-xs text-berry-600 mt-1">
                {editForm.sources.filter(s => s.trim()).length} source(s)
              </p>
              
              {/* Aperçu des sources */}
              {editForm.sources.filter(s => s.trim()).length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-berry-700 mb-1">Aperçu des sources :</div>
                  <div className="space-y-1">
                    {editForm.sources.filter(s => s.trim()).map((source, index) => (
                      <div key={index} className="text-xs">
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {source.includes('://') ? new URL(source).hostname : source}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Marques liées */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Marques liées ({dirigeant.marques.length})
            </h2>
            <button
              onClick={() => router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}/lier-marque`)}
              className="bg-berry-600 text-white px-3 py-1.5 rounded text-sm hover:bg-berry-700"
              disabled={availableMarques.length === 0}
            >
              + Lier marque
            </button>
          </div>
          
          {dirigeant.marques.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>Aucune marque liée</p>
              <p className="text-sm mt-1">Commencez par lier une marque à ce dirigeant</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dirigeant.marques.map((marque) => (
                <div key={marque.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{marque.nom}</h3>
                    <button
                      onClick={() => unlinkMarque(marque.id, marque.nom)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
                      title="Supprimer la liaison"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Lien :</strong> {marque.lien_financier}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Impact :</strong> {marque.impact_description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}