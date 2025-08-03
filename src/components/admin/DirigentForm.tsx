'use client';

import { useState } from 'react';
import { MarqueDirigeantCreateRequest } from '@/types';

interface DirigentFormData {
  nom: string;
  controverses: string;
  lienFinancier: string;
  impact: string;
  sources: string[];
}

interface DirigentFormProps {
  marqueId: number;
  initialData?: Partial<DirigentFormData>;
  onSave: (data: MarqueDirigeantCreateRequest) => Promise<void>;
  isLoading?: boolean;
  showPreview?: boolean;
}

export default function DirigentForm({ 
  marqueId, 
  initialData, 
  onSave, 
  isLoading = false,
  showPreview = true 
}: DirigentFormProps) {
  const [data, setData] = useState<DirigentFormData>({
    nom: initialData?.nom || '',
    controverses: initialData?.controverses || '',
    lienFinancier: initialData?.lienFinancier || '',
    impact: initialData?.impact || '',
    sources: initialData?.sources || ['']
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  
  const validateData = (): boolean => {
    const newErrors: string[] = [];
    
    if (!data.nom.trim()) {
      newErrors.push('Le nom du dirigeant est obligatoire');
    }
    
    if (!data.controverses.trim() || data.controverses.length < 20) {
      newErrors.push('La description des controverses doit faire au moins 20 caractères');
    }
    
    if (!data.lienFinancier.trim()) {
      newErrors.push('Le lien financier est obligatoire');
    }
    
    if (!data.impact.trim()) {
      newErrors.push('La description de l\'impact est obligatoire');
    }
    
    const validSources = data.sources.filter(s => s.trim());
    if (validSources.length === 0) {
      newErrors.push('Au moins une source est obligatoire');
    }
    
    // Validation des URLs
    validSources.forEach((source, index) => {
      try {
        new URL(source);
      } catch {
        newErrors.push(`Source ${index + 1} : URL invalide`);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSave = async () => {
    if (!validateData()) return;
    
    const payload: MarqueDirigeantCreateRequest = {
      marque_id: marqueId,
      dirigeant_nom: data.nom.trim(),
      controverses: data.controverses.trim(),
      lien_financier: data.lienFinancier.trim(),
      impact_description: data.impact.trim(),
      sources: data.sources.filter(s => s.trim())
    };
    
    try {
      await onSave(payload);
      setErrors([]);
    } catch (error) {
      setErrors(['Erreur lors de la sauvegarde']);
    }
  };
  
  const updateSources = (value: string) => {
    const sourcesList = value.split('\n');
    setData({ ...data, sources: sourcesList });
  };
  
  return (
    <div className="space-y-4">
      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="body-small font-medium text-red-800 mb-1">Erreurs :</div>
          <ul className="body-small text-red-700 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <label className="block body-small font-medium text-gray-700 mb-2">
          Nom du dirigeant *
        </label>
        <input
          type="text"
          placeholder="Pierre-Edouard Stérin"
          value={data.nom}
          onChange={(e) => setData({ ...data, nom: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
          maxLength={255}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block body-small font-medium text-gray-700 mb-2">
          Controverses documentées *
        </label>
        <textarea
          placeholder="Projet Périclès : plan de financement de l'extrême droite française avec 150 millions d'euros sur 10 ans..."
          value={data.controverses}
          onChange={(e) => setData({ ...data, controverses: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
          rows={4}
          maxLength={2000}
          disabled={isLoading}
        />
        <p className="body-xs text-gray-500 mt-1">
          {data.controverses.length}/2000 caractères (minimum 20)
        </p>
      </div>
      
      <div>
        <label className="block body-small font-medium text-gray-700 mb-2">
          Lien financier avec la marque *
        </label>
        <input
          type="text"
          placeholder="Co-fondateur et actionnaire via Otium Capital (100%)"
          value={data.lienFinancier}
          onChange={(e) => setData({ ...data, lienFinancier: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
          maxLength={500}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block body-small font-medium text-gray-700 mb-2">
          Impact de l&apos;achat *
        </label>
        <input
          type="text"
          placeholder="100% de vos achats contribuent au financement du projet Périclès"
          value={data.impact}
          onChange={(e) => setData({ ...data, impact: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
          maxLength={500}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block body-small font-medium text-gray-700 mb-2">
          Sources (une par ligne) *
        </label>
        <textarea
          placeholder="https://www.franceinfo.fr/...&#10;https://en.wikipedia.org/wiki/Pierre-Édouard_Stérin"
          value={data.sources.join('\n')}
          onChange={(e) => updateSources(e.target.value)}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
          rows={3}
          disabled={isLoading}
        />
        <p className="body-xs text-gray-500 mt-1">
          {data.sources.filter(s => s.trim()).length} source(s)
        </p>
      </div>
      
      {/* Aperçu en temps réel */}
      {showPreview && data.nom && data.controverses && (
        <div className="mt-6 p-4 bg-white border border-berry-300 rounded-lg">
          <h4 className="body-small font-medium text-gray-700 mb-2">Aperçu public :</h4>
          <div className="body-small">
            <div className="font-semibold text-berry-800 mb-2">⚠️ DIRIGEANT CONTROVERSÉ</div>
            <div className="font-medium text-berry-900 mb-1">{data.nom}</div>
            <div className="text-berry-700 mb-2">
              {data.lienFinancier && <span><strong>Lien :</strong> {data.lienFinancier}</span>}
            </div>
            <div className="text-berry-700 mb-2">
              {data.impact && <span><strong>Impact :</strong> {data.impact}</span>}
            </div>
            <div className="text-berry-700 body-xs">
              {data.controverses.substring(0, 150)}...
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-berry-600 text-white px-4 py-2 rounded-lg hover:bg-berry-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder dirigeant'}
      </button>
    </div>
  );
}