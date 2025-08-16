'use client';

import { useState } from 'react';
import { DirigeantCreateRequest, DirigeantUpdateRequest } from '@/types';
import { ControversesManager } from './ControversesManager';

interface DirigeantFormData {
  nom: string;
  impactGenerique: string;
  typeBeneficiaire: 'individu' | 'groupe';
}

interface DirigeantFormProps {
  initialData?: Partial<DirigeantFormData>;
  onSave: (data: DirigeantCreateRequest | DirigeantUpdateRequest) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  dirigeantId?: number;
  onSaveSuccess?: () => void;
}

export default function DirigeantForm({ 
  initialData, 
  onSave, 
  isLoading = false,
  isEditing = false,
  dirigeantId,
  onSaveSuccess
}: DirigeantFormProps) {
  const [data, setData] = useState<DirigeantFormData>({
    nom: initialData?.nom || '',
    impactGenerique: initialData?.impactGenerique || '',
    typeBeneficiaire: initialData?.typeBeneficiaire || 'individu'
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  
  const validateData = (): boolean => {
    const newErrors: string[] = [];
    
    if (!data.nom.trim()) {
      newErrors.push('Le nom du bénéficiaire est obligatoire');
    }
    
    if (data.nom.trim().length < 2) {
      newErrors.push('Le nom doit faire au moins 2 caractères');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSave = async () => {
    if (!validateData()) return;
    
    const payload = isEditing ? {
      id: dirigeantId!,
      nom: data.nom.trim(),
      impact_generique: data.impactGenerique.trim() || undefined,
      type_beneficiaire: data.typeBeneficiaire
    } as DirigeantUpdateRequest : {
      nom: data.nom.trim(),
      impact_generique: data.impactGenerique.trim() || undefined,
      type_beneficiaire: data.typeBeneficiaire
    } as DirigeantCreateRequest;
    
    try {
      await onSave(payload);
      setErrors([]);
      onSaveSuccess?.();
    } catch (error) {
      setErrors(['Erreur lors de la sauvegarde']);
    }
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
          Nom du bénéficiaire *
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
          Type de bénéficiaire *
        </label>
        <select
          value={data.typeBeneficiaire}
          onChange={(e) => setData({ ...data, typeBeneficiaire: e.target.value as 'individu' | 'groupe' })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        >
          <option value="individu">Individu</option>
          <option value="groupe">Groupe</option>
        </select>
        <p className="body-xs text-neutral-500 mt-1">
          Individu = personne physique, Groupe = organisation/entreprise
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
      
      {/* Aperçu en temps réel */}
      {data.nom && (
        <div className="mt-6 p-4 bg-white border border-primary rounded-lg">
          <h4 className="body-small font-medium text-neutral-700 mb-2">Aperçu bénéficiaire :</h4>
          <div className="body-small">
            <div className="font-semibold text-primary mb-2">⚠️ BÉNÉFICIAIRE CONTROVERSÉ</div>
            <div className="font-medium text-primary mb-1">{data.nom}</div>
            <div className="text-neutral-600 text-xs mb-2">Type: {data.typeBeneficiaire}</div>
            {data.impactGenerique && (
              <div className="text-primary mb-2">
                <strong>Impact générique :</strong> {data.impactGenerique}
              </div>
            )}
            <div className="text-neutral-500 text-xs">
              Les controverses seront gérées séparément après création.
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sauvegarde...' : (isEditing ? 'Modifier bénéficiaire' : 'Créer bénéficiaire')}
      </button>
      
      {/* Gestionnaire de controverses - seulement en mode édition */}
      {isEditing && dirigeantId && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <ControversesManager 
            beneficiaireId={dirigeantId}
            onUpdate={() => {
              console.log('Controverses mises à jour');
            }}
          />
        </div>
      )}
    </div>
  );
}