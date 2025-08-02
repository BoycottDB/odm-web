'use client';

import { useState, useEffect, useCallback } from 'react';
import { Proposition, Categorie } from '@/types';
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
  const [editedData, setEditedData] = useState(proposition);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [marqueSearch, setMarqueSearch] = useState('');
  const [marqueSearchResults, setMarqueSearchResults] = useState<{ id: number; nom: string }[]>([]);
  const [showMarqueResults, setShowMarqueResults] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [categorySearchResults, setCategorySearchResults] = useState<Categorie[]>([]);
  const [showCategoryResults, setShowCategoryResults] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Charger les catégories une seule fois au montage
  useEffect(() => {
    loadCategories();
  }, []);

  // Initialiser les champs quand les données changent
  useEffect(() => {
    if (editedData?.marque_nom) {
      setMarqueSearch(editedData.marque_nom);
    }
  }, [editedData?.marque_nom]);

  // Initialiser la recherche de catégorie quand les catégories sont chargées et qu'une catégorie est sélectionnée
  useEffect(() => {
    if (editedData?.categorie_id && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === editedData.categorie_id);
      if (selectedCategory) {
        setCategorySearch(selectedCategory.nom);
      }
    }
  }, [editedData?.categorie_id, categories]);

  // Fermer les résultats lors du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMarqueResults && !target.closest('.marque-search-container')) {
        setShowMarqueResults(false);
      }
      if (showCategoryResults && !target.closest('.category-search-container')) {
        setShowCategoryResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMarqueResults, showCategoryResults]);

  const loadCategories = async () => {
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

  const searchCategories = useCallback(async (query: string) => {
    if (query.length < 1) {
      setCategorySearchResults(categories);
      setShowCategoryResults(true);
      return;
    }
    
    const filtered = categories.filter(cat => 
      cat.nom.toLowerCase().includes(query.toLowerCase())
    );
    setCategorySearchResults(filtered);
    setShowCategoryResults(true);
  }, [categories]);

  const handleCategorySearch = (value: string) => {
    setCategorySearch(value);
    searchCategories(value);
    
    // Reset la catégorie sélectionnée si on change la recherche
    const existingCategory = categories.find(cat => cat.nom.toLowerCase() === value.toLowerCase());
    if (existingCategory) {
      handleFieldChange('categorie_id', existingCategory.id);
    } else {
      handleFieldChange('categorie_id', undefined);
    }
  };

  const selectCategory = (category: Categorie) => {
    setCategorySearch(category.nom);
    handleFieldChange('categorie_id', category.id);
    setShowCategoryResults(false);
  };

  const createCategoryFromSearch = async (categoryName: string) => {
    if (!categoryName.trim()) return;
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          nom: categoryName.trim()
        })
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setCategorySearch(newCategory.nom);
        handleFieldChange('categorie_id', newCategory.id);
        setShowCategoryResults(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
    }
  };

  const searchMarques = useCallback(async (query: string) => {
    if (query.length < 2) {
      setMarqueSearchResults([]);
      setShowMarqueResults(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/marques?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const marques = await response.json();
        setMarqueSearchResults(marques.slice(0, 5)); // Limiter à 5 résultats
        setShowMarqueResults(true);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de marques:', error);
    }
  }, []);

  const handleMarqueNameChange = (value: string) => {
    setMarqueSearch(value);
    handleFieldChange('marque_nom', value);
    searchMarques(value);
    
    // Reset marque_id si on change le nom
    if (editedData?.marque_id) {
      handleFieldChange('marque_id', undefined);
    }
  };

  const selectMarque = (marque: { id: number; nom: string }) => {
    setMarqueSearch(marque.nom);
    handleFieldChange('marque_nom', marque.nom);
    handleFieldChange('marque_id', marque.id);
    setShowMarqueResults(false);
  };

  const handleFieldChange = (field: string, value: string | number | undefined) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const validateFields = (): boolean => {
    const errors: string[] = [];
    
    if (!editedData.marque_nom?.trim()) {
      errors.push('Le nom de la marque est obligatoire');
    }
    if (!editedData.description?.trim()) {
      errors.push('La description est obligatoire');
    }
    if (!editedData.date) {
      errors.push('La date est obligatoire');
    }
    if (!editedData.categorie_id) {
      errors.push('La catégorie est obligatoire');
    }
    if (!editedData.source_url?.trim()) {
      errors.push('La source (URL) est obligatoire');
    } else if (!/^https?:\/\/.+/.test(editedData.source_url.trim())) {
      errors.push('La source doit être une URL valide (http:// ou https://)');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleDecision = async (statut: 'approuve' | 'rejete') => {
    // Valider les champs uniquement lors de l'approbation
    if (statut === 'approuve' && !validateFields()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Si on approuve, on met à jour les données éditées
      if (statut === 'approuve') {
        await updatePropositionData();
      }
      
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

  const updatePropositionData = async () => {
    try {
      const response = await fetch(`/api/propositions/${proposition.id}/data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(editedData) // Envoyer directement les champs modifiés
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des données');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      throw error;
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
                Signalement #{proposition.id}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                  Controverse
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails du signalement</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message du contributeur <span className="text-xs text-gray-500">(non modifiable)</span>
              </label>
              <div className="text-gray-900 bg-white p-3 rounded border border-gray-200">
                {editedData?.description}
              </div>
            </div>
            
            <div className="relative marque-search-container">
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque concernée *</label>
              <input
                type="text"
                value={marqueSearch}
                onChange={(e) => handleMarqueNameChange(e.target.value)}
                onFocus={() => {
                  if (marqueSearchResults.length > 0) {
                    setShowMarqueResults(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && marqueSearchResults.length > 0) {
                    e.preventDefault();
                    setShowMarqueResults(true);
                  }
                  if (e.key === 'Escape') {
                    setShowMarqueResults(false);
                  }
                }}
                placeholder="Rechercher ou saisir le nom de la marque"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
                required
              />
              
              {editedData?.marque_id && (
                <p className="text-sm text-green-600 mt-1">✅ Marque existante (ID: {editedData.marque_id})</p>
              )}
              
              {/* Résultats de recherche */}
              {showMarqueResults && marqueSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {marqueSearchResults.map((marque) => (
                    <div
                      key={marque.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectMarque(marque);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectMarque(marque);
                        }
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="font-medium text-gray-900">{marque.nom}</div>
                      <div className="text-sm text-gray-500">ID: {marque.id}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {!editedData?.marque_id && marqueSearch.trim() && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">ℹ️ Nouvelle marque</p>
                  <p className="text-xs text-blue-700">Cette marque sera créée automatiquement lors de l&apos;approbation.</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={editedData?.date || ''}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
                  required
                />
              </div>
              <div className="relative category-search-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => handleCategorySearch(e.target.value)}
                  onFocus={() => searchCategories(categorySearch)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && categorySearch.trim()) {
                      e.preventDefault();
                      const existingCategory = categories.find(cat => 
                        cat.nom.toLowerCase() === categorySearch.trim().toLowerCase()
                      );
                      if (!existingCategory) {
                        createCategoryFromSearch(categorySearch.trim());
                      }
                    }
                    if (e.key === 'Escape') {
                      setShowCategoryResults(false);
                    }
                  }}
                  placeholder="Rechercher ou créer une catégorie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
                  required
                />
                
                {editedData?.categorie_id && (
                  <p className="text-sm text-green-600 mt-1">✅ Catégorie sélectionnée (ID: {editedData.categorie_id})</p>
                )}
                
                {/* Résultats de recherche catégories */}
                {showCategoryResults && categorySearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {categorySearchResults.map((category) => (
                      <div
                        key={category.id}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectCategory(category);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectCategory(category);
                          }
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="font-medium text-gray-900">{category.nom}</div>
                        <div className="text-sm text-gray-500">ID: {category.id}</div>
                      </div>
                    ))}
                    {/* Option créer nouvelle catégorie */}
                    {categorySearch.trim() && !categorySearchResults.find(cat => 
                      cat.nom.toLowerCase() === categorySearch.trim().toLowerCase()
                    ) && (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          createCategoryFromSearch(categorySearch.trim());
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            createCategoryFromSearch(categorySearch.trim());
                          }
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-green-50 border-t border-green-200 cursor-pointer focus:bg-green-50 focus:outline-none bg-green-25"
                      >
                        <div className="font-medium text-green-700">+ Créer &quot;{categorySearch.trim()}&quot;</div>
                        <div className="text-sm text-green-600">Nouvelle catégorie</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source (URL) *</label>
              <input
                type="url"
                value={editedData?.source_url || ''}
                onChange={(e) => handleFieldChange('source_url', e.target.value)}
                placeholder="https://exemple.com/article"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Erreurs de validation */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">❌ Erreurs de validation :</h3>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
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