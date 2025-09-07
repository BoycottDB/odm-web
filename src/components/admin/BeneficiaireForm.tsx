'use client';

import { useState } from 'react';
import { BeneficiaireCreateRequest, BeneficiaireUpdateRequest, Beneficiaire, TypeBeneficiaire } from '@/types';

interface BeneficiaireFormProps {
  beneficiaire?: Beneficiaire;
  onSubmit: (data: BeneficiaireCreateRequest | BeneficiaireUpdateRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function BeneficiaireForm({ beneficiaire, onSubmit, onCancel, loading }: BeneficiaireFormProps) {
  const [formData, setFormData] = useState({
    nom: beneficiaire?.nom || '',
    impact_generique: beneficiaire?.impact_generique || '',
    type_beneficiaire: (beneficiaire?.type_beneficiaire || 'individu') as TypeBeneficiaire
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit faire au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submitData = {
      nom: formData.nom.trim(),
      impact_generique: formData.impact_generique.trim() || undefined,
      type_beneficiaire: formData.type_beneficiaire
    };

    if (beneficiaire) {
      onSubmit({ id: beneficiaire.id, ...submitData });
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-neutral-900 mb-2">
          Nom du bénéficiaire *
        </label>
        <input
          type="text"
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          placeholder="Ex: Pierre-Édouard Stérin, Nestlé SA"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.nom ? 'border-error' : 'border-neutral'
          }`}
          required
          maxLength={255}
          disabled={loading}
        />
        {errors.nom && <p className="text-error text-sm mt-1">{errors.nom}</p>}
      </div>

      {/* Type de bénéficiaire */}
      <div>
        <label htmlFor="type_beneficiaire" className="block text-sm font-medium text-neutral-900 mb-2">
          Type de bénéficiaire *
        </label>
        <select
          id="type_beneficiaire"
          value={formData.type_beneficiaire}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            type_beneficiaire: e.target.value as TypeBeneficiaire
          }))}
          className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        >
          <option value="individu">👤 Individu (personne physique)</option>
          <option value="groupe">🏢 Groupe (entreprise, fonds, etc.)</option>
        </select>
        <p className="text-xs text-neutral-600 mt-1">
          Choisissez &quot;Individu&quot; pour une personne (PDG, fondateur...) ou &quot;Groupe&quot; pour une entreprise, fonds, etc.
        </p>
      </div>

      {/* Impact générique */}
      <div>
        <label htmlFor="impact_generique" className="block text-sm font-medium text-neutral-900 mb-2">
          Impact générique (optionnel)
        </label>
        <textarea
          id="impact_generique"
          value={formData.impact_generique}
          onChange={(e) => setFormData(prev => ({ ...prev, impact_generique: e.target.value }))}
          placeholder="Vos achats contribuent à la fortune de [NOM] et financent ses projets controversés..."
          className="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          maxLength={500}
          disabled={loading}
        />
        <p className="text-xs text-neutral-600 mt-1">
          Message d&apos;impact réutilisable pour toutes les marques liées à ce bénéficiaire. Laissez vide pour auto-génération.
        </p>
      </div>

      {/* Note sur les controverses */}
      {beneficiaire && (
        <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-4">
          <div className="text-sm text-secondary-700">
            <strong>Note :</strong> Les controverses sont maintenant gérées dans la section dédiée ci-dessous. 
            Vous pouvez ajouter, modifier et supprimer chaque controverse individuellement avec sa source spécifique.
          </div>
        </div>
      )}

      {/* Aperçu en temps réel */}
      {formData.nom && (
        <div className="mt-6 p-4 bg-white border border-primary rounded-lg">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Aperçu bénéficiaire :</h4>
          <div className="text-sm">
            <div className="font-semibold text-primary mb-2">⚠️ BÉNÉFICIAIRE CONTROVERSÉ</div>
            <div className="font-medium text-primary mb-1">{formData.nom}</div>
            <div className="text-neutral-600 text-xs mb-2">Type: {formData.type_beneficiaire}</div>
            {formData.impact_generique && (
              <div className="text-primary mb-2">
                <strong>Impact générique :</strong> {formData.impact_generique}
              </div>
            )}
            {!beneficiaire && (
              <div className="text-neutral-500 text-xs">
                Les controverses pourront être ajoutées après création du bénéficiaire.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : (beneficiaire ? 'Mettre à jour les informations' : 'Créer le bénéficiaire')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-neutral-light text-neutral-dark py-2 px-4 rounded-md font-medium hover:bg-neutral disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default BeneficiaireForm;