'use client';

import { useState, useEffect } from 'react';
import { SecteurMarque, SecteurMarqueCreateRequest, SecteurMarqueUpdateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function SecteursMarquePage() {
  const [secteurs, setSecteurs] = useState<SecteurMarque[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSecteur, setEditingSecteur] = useState<SecteurMarque | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<SecteurMarqueCreateRequest>({
    nom: '',
    description: '',
    message_boycott_tips: ''
  });

  useEffect(() => {
    loadSecteurs();
  }, []);

  const loadSecteurs = async () => {
    try {
      const response = await fetch('/api/secteurs-marque');
      if (response.ok) {
        const data = await response.json();
        setSecteurs(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des secteurs' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      let response;
      if (editingSecteur) {
        // Mise à jour
        const updateData: SecteurMarqueUpdateRequest = {
          id: editingSecteur.id,
          ...formData
        };
        response = await fetch('/api/secteurs-marque', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
      } else {
        // Création
        response = await fetch('/api/secteurs-marque', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      setMessage({ 
        type: 'success', 
        text: editingSecteur ? 'Secteur mis à jour avec succès' : 'Secteur créé avec succès' 
      });
      
      // Reset form
      setFormData({ nom: '', description: '', message_boycott_tips: '' });
      setEditingSecteur(null);
      setIsCreating(false);
      
      // Reload data
      await loadSecteurs();
    } catch (error) {
      console.error('Erreur sauvegarde secteur:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde' 
      });
    }
  };

  const handleEdit = (secteur: SecteurMarque) => {
    setEditingSecteur(secteur);
    setFormData({
      nom: secteur.nom,
      description: secteur.description || '',
      message_boycott_tips: secteur.message_boycott_tips || ''
    });
    setIsCreating(true);
  };

  const handleDelete = async (secteur: SecteurMarque) => {
    const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le secteur "${secteur.nom}" ?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/secteurs-marque?id=${secteur.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      setMessage({ type: 'success', text: 'Secteur supprimé avec succès' });
      await loadSecteurs();
    } catch (error) {
      console.error('Erreur suppression secteur:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la suppression' 
      });
    }
  };

  const handleCancel = () => {
    setFormData({ nom: '', description: '', message_boycott_tips: '' });
    setEditingSecteur(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement des secteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-main font-bold text-neutral-900">Gestion des secteurs marque</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
            disabled={isCreating}
          >
            + Nouveau secteur
          </button>
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

        {/* Formulaire de création/édition */}
        {isCreating && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-neutral shadow-sm">
            <h3 className="heading-sub font-semibold text-neutral-900 mb-4">
              {editingSecteur ? 'Modifier le secteur' : 'Nouveau secteur'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block body-small font-medium text-neutral-700 mb-1">
                  Nom du secteur *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ex: Mode, Tech/Hardware, Réseaux sociaux..."
                />
              </div>

              <div>
                <label className="block body-small font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-20"
                  placeholder="Description du secteur d'activité..."
                />
              </div>

              <div>
                <label className="block body-small font-medium text-neutral-700 mb-1">
                  Message Boycott Tips
                </label>
                <textarea
                  value={formData.message_boycott_tips}
                  onChange={(e) => setFormData({ ...formData, message_boycott_tips: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
                  placeholder="Message avec conseils de boycott pour ce secteur (supporte le markdown : **gras**, listes • etc.)"
                />
                <p className="body-xs text-neutral-500 mt-1">
                  Supporte le format Markdown : **gras**, *italique*, listes avec •
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
                >
                  {editingSecteur ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des secteurs */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral">
            <h2 className="body-large font-medium text-neutral-900">
              {secteurs.length} secteur(s)
            </h2>
          </div>
          
          <div className="divide-y divide-neutral-200">
            {secteurs.map((secteur) => (
              <div key={secteur.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="body-large font-medium text-neutral-900 mb-2">
                      {secteur.nom}
                    </h3>
                    
                    {secteur.description && (
                      <p className="body-small text-neutral-600 mb-3">
                        {secteur.description}
                      </p>
                    )}
                    
                    {secteur.message_boycott_tips && (
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <p className="body-small font-medium text-neutral-700 mb-1">
                          Message Boycott Tips :
                        </p>
                        <div className="body-small text-neutral-600 whitespace-pre-wrap">
                          {secteur.message_boycott_tips.substring(0, 200)}
                          {secteur.message_boycott_tips.length > 200 && '...'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(secteur)}
                      className="body-small text-primary hover:text-primary underline"
                      disabled={isCreating}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(secteur)}
                      className="body-small text-error hover:text-error underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {secteurs.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="text-neutral-500">Aucun secteur créé</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}