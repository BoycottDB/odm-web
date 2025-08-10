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
    controverses: beneficiaire?.controverses || '',
    sources: beneficiaire?.sources || [''],
    impact_generique: beneficiaire?.impact_generique || '',
    type_beneficiaire: (beneficiaire?.type_beneficiaire || 'individu') as TypeBeneficiaire
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.controverses.trim()) {
      newErrors.controverses = 'Les controverses sont requises';
    }

    if (formData.sources.filter(s => s.trim()).length === 0) {
      newErrors.sources = 'Au moins une source est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const cleanedSources = formData.sources.filter(s => s.trim()).map(s => s.trim());
    
    const submitData = {
      nom: formData.nom.trim(),
      controverses: formData.controverses.trim(),
      sources: cleanedSources,
      impact_generique: formData.impact_generique.trim() || undefined,
      type_beneficiaire: formData.type_beneficiaire
    };

    if (beneficiaire) {
      onSubmit({ id: beneficiaire.id, ...submitData });
    } else {
      onSubmit(submitData);
    }
  };

  const addSource = () => {
    setFormData(prev => ({
      ...prev,
      sources: [...prev.sources, '']
    }));
  };

  const removeSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
    }));
  };

  const updateSource = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.map((s, i) => i === index ? value : s)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-neutral-900 mb-2">
          Nom *
        </label>
        <input
          type="text"
          id="nom"
          value={formData.nom}
          onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
          placeholder="Ex: Elon Musk ou Nestlé SA"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.nom ? 'border-red-500' : 'border-neutral-300'
          }`}
          required
        />
        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
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
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="individu">👤 Individu (personne physique)</option>
          <option value="groupe">🏢 Groupe (entreprise, fonds, etc.)</option>
        </select>
        <p className="text-xs text-neutral-600 mt-1">
          Choisissez "Individu" pour une personne (PDG, fondateur...) ou "Groupe" pour une entreprise, fonds, etc.
        </p>
      </div>

      {/* Controverses */}
      <div>
        <label htmlFor="controverses" className="block text-sm font-medium text-neutral-900 mb-2">
          Controverses documentées *
        </label>
        <textarea
          id="controverses"
          value={formData.controverses}
          onChange={(e) => setFormData(prev => ({ ...prev, controverses: e.target.value }))}
          placeholder={
            formData.type_beneficiaire === 'individu'
              ? "Décrivez les controverses de cette personne..."
              : "Décrivez les controverses de cette organisation..."
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.controverses ? 'border-red-500' : 'border-neutral-300'
          }`}
          rows={5}
          required
        />
        {errors.controverses && <p className="text-red-500 text-sm mt-1">{errors.controverses}</p>}
      </div>

      {/* Sources */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-neutral-900">
            Sources *
          </label>
          <button
            type="button"
            onClick={addSource}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            + Ajouter une source
          </button>
        </div>
        <div className="space-y-2">
          {formData.sources.map((source, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={source}
                onChange={(e) => updateSource(index, e.target.value)}
                placeholder="https://example.com/source"
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {formData.sources.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.sources && <p className="text-red-500 text-sm mt-1">{errors.sources}</p>}
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
          placeholder="Description de l'impact général sur les consommateurs..."
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
        <p className="text-xs text-neutral-600 mt-1">
          Message d'impact réutilisable pour toutes les marques liées à ce bénéficiaire. Peut être remplacé par un impact spécifique dans chaque liaison.
        </p>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : (beneficiaire ? 'Mettre à jour' : 'Créer')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-neutral-200 text-neutral-800 py-2 px-4 rounded-md font-medium hover:bg-neutral-300 disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default BeneficiaireForm;