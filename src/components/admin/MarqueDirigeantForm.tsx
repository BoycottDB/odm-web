'use client';

import { useState, useEffect } from 'react';
import { MarqueDirigeantUpdateRequest, MarqueBeneficiaireCreateRequest, Dirigeant } from '@/types';

interface MarqueDirigeantFormData {
  dirigeantId: number | null;
  lienFinancier: string;
  impactSpecifique: string;
}

interface MarqueDirigeantFormProps {
  marqueId: number;
  marqueNom: string;
  initialData?: Partial<MarqueDirigeantFormData>;
  onSave: (data: MarqueBeneficiaireCreateRequest | MarqueDirigeantUpdateRequest) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  liaisonId?: number;
}

export default function MarqueDirigeantForm({ 
  marqueId, 
  marqueNom,
  initialData, 
  onSave, 
  isLoading = false,
  isEditing = false,
  liaisonId
}: MarqueDirigeantFormProps) {
  const [data, setData] = useState<MarqueDirigeantFormData>({
    dirigeantId: initialData?.dirigeantId || null,
    lienFinancier: initialData?.lienFinancier || '',
    impactSpecifique: initialData?.impactSpecifique || ''
  });
  
  const [dirigeants, setDirigeants] = useState<Dirigeant[]>([]);
  const [selectedDirigeant, setSelectedDirigeant] = useState<Dirigeant | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingDirigeants, setLoadingDirigeants] = useState(true);
  
  // Charger la liste des dirigeants
  useEffect(() => {
    loadDirigeants();
  }, []);
  
  // Charger le dirigeant sélectionné
  useEffect(() => {
    if (data.dirigeantId) {
      const dirigeant = dirigeants.find(d => d.id === data.dirigeantId);
      setSelectedDirigeant(dirigeant || null);
    } else {
      setSelectedDirigeant(null);
    }
  }, [data.dirigeantId, dirigeants]);
  
  const loadDirigeants = async () => {
    try {
      const response = await fetch('/api/dirigeants');
      if (response.ok) {
        const dirigeantsList = await response.json();
        // Extraire les dirigeants uniques de la réponse
        const uniqueDirigeants: Dirigeant[] = dirigeantsList.map((d: Dirigeant) => ({
          id: d.id,
          nom: d.nom,
          controverses: d.controverses || [],
          impact_generique: d.impact_generique,
          created_at: '',
          updated_at: ''
        }));
        setDirigeants(uniqueDirigeants);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dirigeants:', error);
    } finally {
      setLoadingDirigeants(false);
    }
  };
  
  const validateData = (): boolean => {
    const newErrors: string[] = [];
    
    if (!data.dirigeantId) {
      newErrors.push('La sélection d\'un dirigeant est obligatoire');
    }
    
    if (!data.lienFinancier.trim()) {
      newErrors.push('Le lien financier est obligatoire');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSave = async () => {
    if (!validateData()) return;
    
    const payload = isEditing ? {
      id: liaisonId!,
      lien_financier: data.lienFinancier.trim(),
      impact_specifique: data.impactSpecifique.trim() || undefined
    } as MarqueDirigeantUpdateRequest : {
      marque_id: marqueId,
      beneficiaire_id: data.dirigeantId!,
      lien_financier: data.lienFinancier.trim(),
      impact_specifique: data.impactSpecifique.trim() || undefined
    } as MarqueBeneficiaireCreateRequest;
    
    try {
      await onSave(payload);
      setErrors([]);
    } catch {
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
      
      {/* Information marque */}
      <div className="p-3 bg-primary-50 border border-primary rounded-lg">
        <div className="body-small font-medium text-primary">
          Liaison avec la marque : <strong>{marqueNom}</strong>
        </div>
      </div>
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
Bénéficiaire controversé *
        </label>
        {loadingDirigeants ? (
          <div className="p-2 text-neutral-500">Chargement des dirigeants...</div>
        ) : (
          <select
            value={data.dirigeantId || ''}
            onChange={(e) => setData({ ...data, dirigeantId: parseInt(e.target.value) || null })}
            className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading || isEditing} // Pas de changement de dirigeant en édition
          >
            <option value="">-- Sélectionner un dirigeant --</option>
            {dirigeants.map(dirigeant => (
              <option key={dirigeant.id} value={dirigeant.id}>
                {dirigeant.nom}
              </option>
            ))}
          </select>
        )}
        {isEditing && (
          <p className="body-xs text-neutral-500 mt-1">
            Le dirigeant ne peut pas être modifié après création
          </p>
        )}
      </div>
      
      {/* Aperçu dirigeant sélectionné */}
      {selectedDirigeant && (
        <div className="p-3 bg-white border border-neutral rounded-lg">
          <h4 className="body-small font-medium text-neutral-700 mb-2">Dirigeant sélectionné :</h4>
          <div className="body-small">
            <div className="font-medium text-neutral-900 mb-1">{selectedDirigeant.nom}</div>
            <div className="text-neutral-600 body-xs mb-2">
              {selectedDirigeant.controverses && selectedDirigeant.controverses.length > 0
                ? selectedDirigeant.controverses.map(c => c.titre).join(' • ').substring(0, 100) + '...'
                : 'Aucune controverse documentée'
              }
            </div>
            {selectedDirigeant.impact_generique && (
              <div className="text-neutral-600 body-xs">
                <strong>Impact générique :</strong> {selectedDirigeant.impact_generique}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Lien financier avec {marqueNom} *
        </label>
        <input
          type="text"
          placeholder="Co-fondateur et actionnaire via Otium Capital (100%)"
          value={data.lienFinancier}
          onChange={(e) => setData({ ...data, lienFinancier: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block body-small font-medium text-neutral-700 mb-2">
          Impact spécifique pour {marqueNom} (optionnel)
        </label>
        <input
          type="text"
          placeholder="100% de vos achats Smartbox contribuent au financement du projet Périclès"
          value={data.impactSpecifique}
          onChange={(e) => setData({ ...data, impactSpecifique: e.target.value })}
          className="bg-white w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
          disabled={isLoading}
        />
        <p className="body-xs text-neutral-500 mt-1">
          Si vide, utilisera l&apos;impact générique du dirigeant. Sinon, ce message sera prioritaire.
        </p>
      </div>
      
      {/* Aperçu en temps réel */}
      {selectedDirigeant && data.lienFinancier && (
        <div className="mt-6 p-4 bg-white border border-primary rounded-lg">
          <h4 className="body-small font-medium text-neutral-700 mb-2">Aperçu public :</h4>
          <div className="body-small">
            <div className="font-semibold text-primary mb-2">⚠️ BÉNÉFICIAIRE CONTROVERSÉ</div>
            <div className="text-primary body-small mb-1">
              Un bénéficiaire controversé est associé à la marque <strong>{marqueNom}</strong>
            </div>
            <div className="font-medium text-primary mb-1">{selectedDirigeant.nom}</div>
            <div className="text-primary mb-2">
              <strong>Lien :</strong> {data.lienFinancier}
            </div>
            <div className="text-primary mb-2">
              <strong>Impact :</strong> {data.impactSpecifique || selectedDirigeant.impact_generique || 'Impact à définir'}
            </div>
            <div className="text-primary body-xs">
              {selectedDirigeant.controverses && selectedDirigeant.controverses.length > 0
                ? selectedDirigeant.controverses.map(c => c.titre).join(' • ').substring(0, 150) + '...'
                : 'Aucune controverse documentée'
              }
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={isLoading || !data.dirigeantId}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sauvegarde...' : (isEditing ? 'Modifier liaison' : 'Créer liaison')}
      </button>
    </div>
  );
}