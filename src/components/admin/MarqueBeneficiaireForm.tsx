'use client';

import { useState, useEffect } from 'react';
import { MarqueBeneficiaireCreateRequest, MarqueBeneficiaireUpdateRequest, MarqueBeneficiaire, Beneficiaire, Marque } from '@/types';

interface MarqueBeneficiaireFormProps {
  liaison?: MarqueBeneficiaire;
  marque?: Marque;
  onSubmit: (data: MarqueBeneficiaireCreateRequest | MarqueBeneficiaireUpdateRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function MarqueBeneficiaireForm({ liaison, marque, onSubmit, onCancel, loading }: MarqueBeneficiaireFormProps) {
  const [formData, setFormData] = useState({
    marque_id: liaison?.marque_id || marque?.id || 0,
    beneficiaire_id: liaison?.beneficiaire_id || 0,
    lien_financier: liaison?.lien_financier || '',
    impact_specifique: liaison?.impact_specifique || ''
  });

  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les bénéficiaires et marques disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        const [beneficiairesRes, marquesRes] = await Promise.all([
          fetch('/api/beneficiaires'),
          fetch('/api/marques')
        ]);

        if (beneficiairesRes.ok) {
          const beneficiairesData = await beneficiairesRes.json();
          setBeneficiaires(beneficiairesData);
        }

        if (marquesRes.ok) {
          const marquesData = await marquesRes.json();
          setMarques(marquesData);
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.marque_id) {
      newErrors.marque_id = 'Veuillez sélectionner une marque';
    }

    if (!formData.beneficiaire_id) {
      newErrors.beneficiaire_id = 'Veuillez sélectionner un bénéficiaire';
    }

    if (!formData.lien_financier.trim()) {
      newErrors.lien_financier = 'Le lien financier est requis';
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
      marque_id: formData.marque_id,
      beneficiaire_id: formData.beneficiaire_id,
      lien_financier: formData.lien_financier.trim(),
      impact_specifique: formData.impact_specifique.trim() || undefined
    };

    if (liaison) {
      onSubmit({ id: liaison.id, ...submitData });
    } else {
      onSubmit(submitData);
    }
  };

  const selectedBeneficiaire = beneficiaires.find(b => b.id === formData.beneficiaire_id);
  const isGroupe = selectedBeneficiaire?.type_beneficiaire === 'groupe';

  if (loadingData) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-neutral-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Marque */}
      <div>
        <label htmlFor="marque_id" className="block text-sm font-medium text-neutral-900 mb-2">
          Marque *
        </label>
        <select
          id="marque_id"
          value={formData.marque_id}
          onChange={(e) => setFormData(prev => ({ ...prev, marque_id: parseInt(e.target.value) }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.marque_id ? 'border-red-500' : 'border-neutral-300'
          }`}
          disabled={!!marque} // Désactivé si marque pré-sélectionnée
          required
        >
          <option value="">-- Sélectionner une marque --</option>
          {marques.map(m => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
        {errors.marque_id && <p className="text-red-500 text-sm mt-1">{errors.marque_id}</p>}
      </div>

      {/* Bénéficiaire */}
      <div>
        <label htmlFor="beneficiaire_id" className="block text-sm font-medium text-neutral-900 mb-2">
          Bénéficiaire *
        </label>
        <select
          id="beneficiaire_id"
          value={formData.beneficiaire_id}
          onChange={(e) => setFormData(prev => ({ ...prev, beneficiaire_id: parseInt(e.target.value) }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.beneficiaire_id ? 'border-red-500' : 'border-neutral-300'
          }`}
          required
        >
          <option value="">-- Sélectionner un bénéficiaire --</option>
          {beneficiaires.map(b => (
            <option key={b.id} value={b.id}>
              {b.type_beneficiaire === 'groupe' ? '🏢' : '👤'} {b.nom}
            </option>
          ))}
        </select>
        {errors.beneficiaire_id && <p className="text-red-500 text-sm mt-1">{errors.beneficiaire_id}</p>}
      </div>

      {/* Lien financier */}
      <div>
        <label htmlFor="lien_financier" className="block text-sm font-medium text-neutral-900 mb-2">
          Lien financier *
        </label>
        <textarea
          id="lien_financier"
          value={formData.lien_financier}
          onChange={(e) => setFormData(prev => ({ ...prev, lien_financier: e.target.value }))}
          placeholder={
            isGroupe
              ? "Ex: Filiale à 100% depuis 2022"
              : "Ex: PDG depuis 2020, détient 25% des parts"
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.lien_financier ? 'border-red-500' : 'border-neutral-300'
          }`}
          rows={3}
          required
        />
        {errors.lien_financier && <p className="text-red-500 text-sm mt-1">{errors.lien_financier}</p>}
        <p className="text-xs text-neutral-600 mt-1">
          Décrivez précisément la relation financière entre la marque et ce bénéficiaire.
        </p>
      </div>

      {/* Impact spécifique */}
      <div>
        <label htmlFor="impact_specifique" className="block text-sm font-medium text-neutral-900 mb-2">
          Impact spécifique (optionnel)
        </label>
        <textarea
          id="impact_specifique"
          value={formData.impact_specifique}
          onChange={(e) => setFormData(prev => ({ ...prev, impact_specifique: e.target.value }))}
          placeholder={
            isGroupe
              ? "Ex: Tous les profits de cette marque alimentent directement le groupe parent"
              : "Ex: En tant que dirigeant principal, il influence directement la stratégie de l'entreprise"
          }
          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
        <p className="text-xs text-neutral-600 mt-1">
          Impact spécifique à cette relation. Si vide, l&apos;impact générique du bénéficiaire sera utilisé.
          {selectedBeneficiaire && selectedBeneficiaire.impact_generique && (
            <>
              <br />
              <strong>Impact générique actuel :</strong> {selectedBeneficiaire.impact_generique}
            </>
          )}
        </p>
      </div>

      {/* Prévisualisation du bénéficiaire sélectionné */}
      {selectedBeneficiaire && (
        <div className="bg-neutral-50 p-4 rounded-lg">
          <h4 className="font-medium text-neutral-900 mb-2">
            {selectedBeneficiaire.type_beneficiaire === 'groupe' ? '🏢' : '👤'} {selectedBeneficiaire.nom}
          </h4>
          <div className="text-sm text-neutral-700">
            <strong>Controverses :</strong> {selectedBeneficiaire.controverses && selectedBeneficiaire.controverses.length > 0
              ? selectedBeneficiaire.controverses.map(c => c.titre).join(' • ').substring(0, 200) + (selectedBeneficiaire.controverses.map(c => c.titre).join(' • ').length > 200 ? '...' : '')
              : 'Aucune controverse documentée'
            }
          </div>
          {selectedBeneficiaire.controverses && selectedBeneficiaire.controverses.length > 0 && (
            <div className="text-sm text-neutral-600 mt-2">
              <strong>Sources :</strong> {selectedBeneficiaire.controverses.length} controverse(s) documentée(s)
            </div>
          )}
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-dark text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : (liaison ? 'Mettre à jour' : 'Créer la liaison')}
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

export default MarqueBeneficiaireForm;