'use client';

import { useState, useEffect } from 'react';
import { ControverseBeneficiaire, Categorie } from '@/types';
import { Plus, Trash2, ExternalLink, GripVertical, Edit2, Check, X, MessageCircle } from 'lucide-react';

interface ControversesManagerProps {
  beneficiaireId: number;
  onUpdate?: () => void;
}

export function ControversesManager({ beneficiaireId, onUpdate }: ControversesManagerProps) {
  const [controverses, setControverses] = useState<ControverseBeneficiaire[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newControverse, setNewControverse] = useState({ 
    titre: '', 
    source_url: '',
    date: '',
    categorie_id: undefined as number | undefined,
    condamnation_judiciaire: false,
    reponse: ''
  });
  const [editData, setEditData] = useState({ 
    titre: '', 
    source_url: '',
    date: '',
    categorie_id: undefined as number | undefined,
    condamnation_judiciaire: false,
    reponse: ''
  });

  // Charger les controverses et catégories existantes
  useEffect(() => {
    fetchControverses();
    fetchCategories();
  }, [beneficiaireId]);

  const fetchControverses = async () => {
    try {
      const response = await fetch(`/api/controverses-beneficiaire?beneficiaire_id=${beneficiaireId}`);
      if (response.ok) {
        const data = await response.json();
        setControverses(data);
      } else {
        console.error('Erreur lors du chargement des controverses');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des controverses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const ajouterControverse = async () => {
    if (!newControverse.titre.trim() || !newControverse.source_url.trim()) {
      alert('Titre et source sont requis');
      return;
    }

    if (newControverse.titre.trim().length < 10) {
      alert('Le titre doit faire au moins 10 caractères');
      return;
    }

    // Validation URL basique
    try {
      new URL(newControverse.source_url);
    } catch {
      alert('URL source invalide');
      return;
    }

    try {
      const response = await fetch('/api/controverses-beneficiaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaire_id: beneficiaireId,
          titre: newControverse.titre.trim(),
          source_url: newControverse.source_url.trim(),
          ordre: controverses.length,
          date: newControverse.date || undefined,
          categorie_id: newControverse.categorie_id || undefined,
          condamnation_judiciaire: newControverse.condamnation_judiciaire,
          reponse: newControverse.reponse.trim() || undefined
        })
      });

      if (response.ok) {
        const nouvelle = await response.json();
        setControverses([...controverses, nouvelle]);
        setNewControverse({ 
          titre: '', 
          source_url: '',
          date: '',
          categorie_id: undefined,
          condamnation_judiciaire: false,
          reponse: ''
        });
        setIsAdding(false);
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'ajout de la controverse');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de la controverse');
    }
  };

  const startEdit = (controverse: ControverseBeneficiaire) => {
    setEditingId(controverse.id);
    setEditData({
      titre: controverse.titre,
      source_url: controverse.source_url,
      date: controverse.date || '',
      categorie_id: controverse.categorie_id || undefined,
      condamnation_judiciaire: controverse.condamnation_judiciaire || false,
      reponse: controverse.reponse || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ 
      titre: '', 
      source_url: '',
      date: '',
      categorie_id: undefined,
      condamnation_judiciaire: false,
      reponse: ''
    });
  };

  const saveEdit = async (id: number) => {
    if (!editData.titre.trim() || !editData.source_url.trim()) {
      alert('Titre et source sont requis');
      return;
    }

    if (editData.titre.trim().length < 10) {
      alert('Le titre doit faire au moins 10 caractères');
      return;
    }

    try {
      new URL(editData.source_url);
    } catch {
      alert('URL source invalide');
      return;
    }

    try {
      const response = await fetch('/api/controverses-beneficiaire', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          titre: editData.titre.trim(),
          source_url: editData.source_url.trim(),
          date: editData.date || undefined,
          categorie_id: editData.categorie_id || undefined,
          condamnation_judiciaire: editData.condamnation_judiciaire,
          reponse: editData.reponse.trim() || undefined
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setControverses(controverses.map(c => 
          c.id === id ? updated : c
        ));
        setEditingId(null);
        setEditData({ 
          titre: '', 
          source_url: '',
          date: '',
          categorie_id: undefined,
          condamnation_judiciaire: false,
          reponse: ''
        });
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  const supprimerControverse = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette controverse ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/controverses-beneficiaire?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setControverses(controverses.filter(c => c.id !== id));
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-8 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Controverses détaillées</h4>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Liste des controverses existantes */}
      {controverses.length > 0 ? (
        <div className="space-y-3">
          {controverses.map((controverse) => (
            <div 
              key={controverse.id} 
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
            >
              {editingId === controverse.id ? (
                // Mode édition
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de la controverse *
                    </label>
                    <input
                      type="text"
                      value={editData.titre}
                      onChange={(e) => setEditData({...editData, titre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  
                  {/* NOUVEAU : Date de la controverse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de la controverse
                    </label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({...editData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  
                  {/* NOUVEAU : Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={editData.categorie_id || ''}
                      onChange={(e) => setEditData({...editData, categorie_id: e.target.value ? parseInt(e.target.value) : undefined})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">-- Sélectionner une catégorie --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* NOUVEAU : Condamnation judiciaire */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`condamnation-edit-${controverse.id}`}
                      checked={editData.condamnation_judiciaire}
                      onChange={(e) => setEditData({...editData, condamnation_judiciaire: e.target.checked})}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`condamnation-edit-${controverse.id}`} className="text-sm font-medium text-gray-700">
                      ⚖️ Condamnation judiciaire
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL source *
                    </label>
                    <input
                      type="url"
                      value={editData.source_url}
                      onChange={(e) => setEditData({...editData, source_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  
                  {/* NOUVEAU : Réponse officielle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réponse officielle (optionnel)
                    </label>
                    <input
                      type="url"
                      value={editData.reponse}
                      onChange={(e) => setEditData({...editData, reponse: e.target.value})}
                      placeholder="https://exemple.com/reponse-officielle"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(controverse.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Sauver
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {/* Badge condamnation judiciaire */}
                    {controverse.condamnation_judiciaire && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                          ⚖️ Condamnation judiciaire
                        </span>
                      </div>
                    )}
                    
                    <div className="font-medium text-gray-900 mb-1 leading-tight">
                      {controverse.titre}
                    </div>
                    
                    {/* Métadonnées : Date + Catégorie */}
                    <div className="flex items-center gap-2 mb-2">
                      {controverse.date && (
                        <span className="text-xs text-neutral-600">
                          {new Date(controverse.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                      
                      {controverse.Categorie && (
                        <span 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: controverse.Categorie.couleur + '20',
                            color: controverse.Categorie.couleur
                          }}
                        >
                          {controverse.Categorie.emoji} {controverse.Categorie.nom}
                        </span>
                      )}
                    </div>
                    
                    {/* Liens : Source + Réponse */}
                    <div className="flex items-center gap-3">
                      <a 
                        href={controverse.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-lavande-600 hover:text-lavande-700 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Source
                      </a>
                      
                      {controverse.reponse && (
                        <a 
                          href={controverse.reponse}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-green-600 hover:text-green-700 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Réponse officielle
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(controverse)}
                      className="p-2 text-lavande-600 hover:text-lavande-700 hover:bg-lavande-50 rounded transition-colors"
                      title="Modifier cette controverse"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => supprimerControverse(controverse.id)}
                      className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                      title="Supprimer cette controverse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <div className="mb-2">Aucune controverse détaillée</div>
          <div className="text-sm">Utilisez le bouton &quot;Ajouter&quot; pour en créer une.</div>
        </div>
      )}

      {/* Formulaire d'ajout */}
      {isAdding && (
        <div className="border border-primary rounded-lg p-4 bg-primary-50">
          <h5 className="font-medium mb-3 text-gray-900">Nouvelle controverse</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de la controverse *
              </label>
              <input
                type="text"
                value={newControverse.titre}
                onChange={(e) => setNewControverse({...newControverse, titre: e.target.value})}
                placeholder="Ex: Condamnation pour évasion fiscale"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                Minimum 10 caractères
              </div>
            </div>
            
            {/* NOUVEAU : Date de la controverse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de la controverse
              </label>
              <input
                type="date"
                value={newControverse.date}
                onChange={(e) => setNewControverse({...newControverse, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            
            {/* NOUVEAU : Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={newControverse.categorie_id || ''}
                onChange={(e) => setNewControverse({...newControverse, categorie_id: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.nom}
                  </option>
                ))}
              </select>
            </div>
            
            {/* NOUVEAU : Condamnation judiciaire */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="condamnation"
                checked={newControverse.condamnation_judiciaire}
                onChange={(e) => setNewControverse({...newControverse, condamnation_judiciaire: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="condamnation" className="text-sm font-medium text-gray-700">
                ⚖️ Condamnation judiciaire
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL source *
              </label>
              <input
                type="url"
                value={newControverse.source_url}
                onChange={(e) => setNewControverse({...newControverse, source_url: e.target.value})}
                placeholder="https://exemple.com/article"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                URL complète avec https://
              </div>
            </div>
            
            {/* NOUVEAU : Réponse officielle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Réponse officielle (optionnel)
              </label>
              <input
                type="url"
                value={newControverse.reponse}
                onChange={(e) => setNewControverse({...newControverse, reponse: e.target.value})}
                placeholder="https://exemple.com/reponse-officielle"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={ajouterControverse}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewControverse({ 
                    titre: '', 
                    source_url: '',
                    date: '',
                    categorie_id: undefined,
                    condamnation_judiciaire: false,
                    reponse: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}