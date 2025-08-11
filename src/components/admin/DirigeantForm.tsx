'use client';

import { useState } from 'react';
import { DirigeantCreateRequest, DirigeantUpdateRequest } from '@/types';

interface DirigeantFormData {
  nom: string;
  controverses: string;
  impactGenerique: string;
  sources: string[];
}

interface DirigeantFormProps {
  initialData?: Partial<DirigeantFormData>;
  onSave: (data: DirigeantCreateRequest | DirigeantUpdateRequest) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  dirigeantId?: number;
}

export default function DirigeantForm({ 
  initialData, 
  onSave, 
  isLoading = false,
  isEditing = false,
  dirigeantId
}: DirigeantFormProps) {
  const [data, setData] = useState<DirigeantFormData>({
    nom: initialData?.nom || '',
    controverses: initialData?.controverses || '',
    impactGenerique: initialData?.impactGenerique || '',
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
    
    const payload = isEditing ? {
      id: dirigeantId!,
      nom: data.nom.trim(),
      controverses: data.controverses.trim(),
      impact_generique: data.impactGenerique.trim() || undefined,
      sources: data.sources.filter(s => s.trim())
    } as DirigeantUpdateRequest : {
      nom: data.nom.trim(),
      controverses: data.controverses.trim(),
      impact_generique: data.impactGenerique.trim() || undefined,
      sources: data.sources.filter(s => s.trim())
    } as DirigeantCreateRequest;
    
    try {
      await onSave(payload);
      setErrors([]);
    } catch (error) {
      setErrors(['Erreur lors de la sauvegarde']);
    }
  };
  
  const updateSources = (value: string) => {
    const sourcesList = value.split('\n').filter(s => s.length > 0);
    setData({ ...data, sources: sourcesList });
  };
  
  return (
    <div className="space-y-4">
      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="p-3 bg-error-light border border-error rounded-lg">
          <div className="body-small font-medium text-error mb-1">Erreurs :</div>
          <ul className="body-small text-error list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Nom du dirigeant *
        </label>
        <input
          type="text"
          placeholder="Pierre-Édouard Stérin"
          value={data.nom}
          onChange={(e) => setData({ ...data, nom: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={255}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Controverses documentées *
        </label>
        <textarea
          placeholder="Projet Périclès : plan de financement de l'extrême droite française avec 150 millions d'euros sur 10 ans..."
          value={data.controverses}
          onChange={(e) => setData({ ...data, controverses: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          maxLength={2000}
          disabled={isLoading}
        />
        <p className="body-xs text-neutral-500 mt-1">
          {data.controverses.length}/2000 caractères (minimum 20)
        </p>
      </div>
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Impact générique (optionnel)
        </label>
        <input
          type="text"
          placeholder="Vos achats contribuent à la fortune de [NOM] et financent ses projets controversés"
          value={data.impactGenerique}
          onChange={(e) => setData({ ...data, impactGenerique: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
          disabled={isLoading}
        />
        <p className="body-xs text-neutral-500 mt-1">
          Message réutilisable pour toutes les marques liées. Laissez vide pour auto-génération.
        </p>
      </div>
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Sources (une par ligne) *
        </label>
        <textarea
          placeholder="https://www.franceinfo.fr/...&#10;https://en.wikipedia.org/wiki/Pierre-Édouard_Stérin"
          value={data.sources.join('\n')}
          onChange={(e) => updateSources(e.target.value)}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          disabled={isLoading}
        />
        <p className="body-xs text-neutral-500 mt-1">
          {data.sources.filter(s => s.trim()).length} source(s)
        </p>
      </div>
      
      {/* Aperçu en temps réel */}
      {data.nom && data.controverses && (
        <div className="mt-6 p-4 bg-white border border-primary rounded-lg">
          <h4 className="body-small font-medium text-neutral-700 mb-2">Aperçu dirigeant :</h4>
          <div className="body-small">
            <div className="font-semibold text-primary mb-2">⚠️ DIRIGEANT CONTROVERSÉ</div>
            <div className="font-medium text-primary mb-1">{data.nom}</div>
            {data.impactGenerique && (
              <div className="text-primary mb-2">
                <strong>Impact générique :</strong> {data.impactGenerique}
              </div>
            )}
            <div className="text-primary body-xs">
              <strong>Controverses :</strong> {data.controverses.substring(0, 150)}...
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sauvegarde...' : (isEditing ? 'Modifier dirigeant' : 'Créer dirigeant')}
      </button>
    </div>
  );
}