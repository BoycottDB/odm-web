'use client';

import { useState, useEffect } from 'react';
import { MarqueBeneficiaireCreateRequest, BeneficiaireWithMarques } from '@/types';

interface MarqueBeneficiaireFormProps {
  marqueId: number;
  marqueNom: string;
  onSave: (data: MarqueBeneficiaireCreateRequest) => Promise<void>;
  isLoading?: boolean;
}

const champClassName = 'bg-white w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export default function MarqueBeneficiaireForm({ marqueId, marqueNom, onSave, isLoading = false }: MarqueBeneficiaireFormProps) {
  const [beneficiaireId, setBeneficiaireId] = useState<number | null>(null);
  const [lienFinancier, setLienFinancier] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [partDetenue, setPartDetenue] = useState('');
  const [beneficiaires, setBeneficiaires] = useState<BeneficiaireWithMarques[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingBeneficiaires, setLoadingBeneficiaires] = useState(true);

  useEffect(() => {
    const loadBeneficiaires = async () => {
      try {
        const response = await fetch('/api/beneficiaires');
        if (response.ok) {
          setBeneficiaires(await response.json());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bénéficiaires:', error);
      } finally {
        setLoadingBeneficiaires(false);
      }
    };

    loadBeneficiaires();
  }, []);

  const selectedBeneficiaire = beneficiaires.find(b => b.id === beneficiaireId);

  const validateData = (): boolean => {
    const newErrors: string[] = [];

    if (!beneficiaireId) {
      newErrors.push('La sélection d\'un bénéficiaire est obligatoire');
    }
    if (!lienFinancier.trim()) {
      newErrors.push('Le lien financier est obligatoire');
    }
    if (!/^https?:\/\/.+/.test(sourceUrl.trim())) {
      newErrors.push('La source du lien est obligatoire (URL en http:// ou https://)');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateData()) return;

    try {
      await onSave({
        marque_id: marqueId,
        beneficiaire_id: beneficiaireId!,
        lien_financier: lienFinancier.trim(),
        source_url: sourceUrl.trim(),
        part_detenue: partDetenue.trim() || undefined
      });
      setErrors([]);
    } catch {
      setErrors(['Erreur lors de la sauvegarde']);
    }
  };

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="p-3 bg-error-light border border-error-medium rounded-lg">
          <div className="body-small font-medium text-error mb-1">Erreurs :</div>
          <ul className="body-small text-error list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-3 bg-primary-50 border border-primary rounded-lg">
        <div className="body-small font-medium text-primary">
          Liaison avec la marque : <strong>{marqueNom}</strong>
        </div>
      </div>

      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Bénéficiaire *
        </label>
        {loadingBeneficiaires ? (
          <div className="p-2 text-neutral-500">Chargement des bénéficiaires...</div>
        ) : (
          <select
            value={beneficiaireId || ''}
            onChange={(e) => setBeneficiaireId(parseInt(e.target.value) || null)}
            className={champClassName}
            disabled={isLoading}
          >
            <option value="">-- Sélectionner un bénéficiaire --</option>
            {beneficiaires.map(beneficiaire => (
              <option key={beneficiaire.id} value={beneficiaire.id}>
                {beneficiaire.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedBeneficiaire && (
        <div className="p-3 bg-white border border-neutral-200 rounded-lg body-small">
          <div className="font-medium text-neutral-900 mb-1">{selectedBeneficiaire.nom}</div>
          <div className="text-neutral-600 body-xs">
            {selectedBeneficiaire.controverses.length > 0
              ? `${selectedBeneficiaire.controverses.length} controverse(s) documentée(s)`
              : 'Aucune controverse documentée : un bénéficiaire n\'est ajouté que s\'il a des controverses.'
            }
          </div>
        </div>
      )}

      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Lien financier avec {marqueNom} * <span className="font-normal text-neutral-500">(affiché sur le site)</span>
        </label>
        <input
          type="text"
          placeholder={`Des fonds gérés par BlackRock possèdent une partie de ${marqueNom}`}
          value={lienFinancier}
          onChange={(e) => setLienFinancier(e.target.value)}
          className={champClassName}
          maxLength={500}
          disabled={isLoading}
        />
        <p className="body-xs text-neutral-500 mt-1">
          Langage courant, sans pourcentage ni « minoritaire ».
        </p>
      </div>

      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Source du lien * <span className="font-normal text-neutral-500">(interne, non affichée)</span>
        </label>
        <input
          type="url"
          placeholder="https://… (rapport annuel, page « nos marques », proxy statement…)"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className={champClassName}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Part détenue <span className="font-normal text-neutral-500">(optionnel, interne, non affichée)</span>
        </label>
        <input
          type="text"
          placeholder="7,3 % (proxy 2026)"
          value={partDetenue}
          onChange={(e) => setPartDetenue(e.target.value)}
          className={champClassName}
          maxLength={500}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading || !beneficiaireId}
        className="bouton-primaire px-4 py-2"
      >
        {isLoading ? 'Sauvegarde...' : 'Créer liaison'}
      </button>
    </div>
  );
}
