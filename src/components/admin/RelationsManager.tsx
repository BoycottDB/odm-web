'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface Beneficiaire {
  id: number;
  nom: string;
  type_beneficiaire: string;
}

interface BeneficiaireRelation {
  id: number;
  beneficiaire_source_id: number;
  beneficiaire_cible_id: number;
  description_relation: string;
  created_at: string;
  beneficiaire_source: Beneficiaire;
  beneficiaire_cible: Beneficiaire;
}

interface RelationsManagerProps {
  beneficiaireId: number;
  beneficiaireNom: string;
  onUpdate?: () => void;
}

export default function RelationsManager({ beneficiaireId, beneficiaireNom, onUpdate }: RelationsManagerProps) {
  const [relations, setRelations] = useState<BeneficiaireRelation[]>([]);
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiaire_source_id: '',
    beneficiaire_cible_id: '',
    description_relation: '',
    direction: 'sortante' as 'sortante' | 'entrante'
  });

  useEffect(() => {
    loadData();
  }, [beneficiaireId]);

  const loadData = async () => {
    try {
      // Charger toutes les relations
      const relationsResponse = await fetch('/api/relations-beneficiaires');
      if (relationsResponse.ok) {
        const allRelations = await relationsResponse.json();
        // Filtrer les relations qui concernent ce bénéficiaire
        const filteredRelations = allRelations.filter((rel: BeneficiaireRelation) => 
          rel.beneficiaire_source_id === beneficiaireId || rel.beneficiaire_cible_id === beneficiaireId
        );
        setRelations(filteredRelations);
      }

      // Charger tous les bénéficiaires pour les selects
      const beneficiairesResponse = await fetch('/api/beneficiaires');
      if (beneficiairesResponse.ok) {
        const beneficiairesData = await beneficiairesResponse.json();
        // Exclure le bénéficiaire actuel de la liste
        const filteredBeneficiaires = beneficiairesData.filter((b: Beneficiaire) => b.id !== beneficiaireId);
        setBeneficiaires(filteredBeneficiaires);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        beneficiaire_source_id: formData.direction === 'sortante' ? beneficiaireId : parseInt(formData.beneficiaire_cible_id),
        beneficiaire_cible_id: formData.direction === 'sortante' ? parseInt(formData.beneficiaire_cible_id) : beneficiaireId,
        description_relation: formData.description_relation
      };

      const response = await fetch('/api/relations-beneficiaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setFormData({
          beneficiaire_source_id: '',
          beneficiaire_cible_id: '',
          description_relation: '',
          direction: 'sortante'
        });
        onUpdate?.();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la relation');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette relation ?')) return;

    try {
      const response = await fetch(`/api/relations-beneficiaires?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
        onUpdate?.();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-neutral-600">Chargement des relations...</p>
      </div>
    );
  }

  const relationsEntrantes = relations.filter(rel => rel.beneficiaire_cible_id === beneficiaireId);
  const relationsSortantes = relations.filter(rel => rel.beneficiaire_source_id === beneficiaireId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">Relations avec d&apos;autres bénéficiaires</h3>
          <p className="text-sm text-neutral-600 mt-1">
            Gérez les relations financières et hiérarchiques (actionnariat, filiales, partenariats)
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle relation</span>
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
          <h4 className="font-medium text-neutral-900 mb-4">Créer une nouvelle relation</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type de relation */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Qui bénéficie des profits de qui ? *
              </label>
              <div className="space-y-3">
                <div className="border border-neutral-200 rounded-lg p-3 hover:border-primary-300 transition-colors">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      value="sortante"
                      checked={formData.direction === 'sortante'}
                      onChange={(e) => setFormData({...formData, direction: e.target.value as 'sortante' | 'entrante'})}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="font-medium text-neutral-900 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{beneficiaireNom}</span>
                        <span className="text-neutral-500">&rarr;</span>
                        <span className="text-neutral-600">autre bénéficiaire</span>
                      </div>
                      <div className="text-sm text-neutral-600 mt-1">
                        Les profits de <strong>{beneficiaireNom}</strong> profitent à l&apos;autre bénéficiaire
                        <br />
                        <span className="text-xs text-neutral-500">Ex: Les profits de Nestlé profitent à BlackRock (actionnaire)</span>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="border border-neutral-200 rounded-lg p-3 hover:border-primary-300 transition-colors">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      value="entrante"
                      checked={formData.direction === 'entrante'}
                      onChange={(e) => setFormData({...formData, direction: e.target.value as 'sortante' | 'entrante'})}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="font-medium text-neutral-900 flex items-center gap-2">
                        <span className="text-neutral-600">autre bénéficiaire</span>
                        <span className="text-neutral-500">&rarr;</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{beneficiaireNom}</span>
                      </div>
                      <div className="text-sm text-neutral-600 mt-1">
                        Les profits de l&apos;autre bénéficiaire profitent à <strong>{beneficiaireNom}</strong>
                        <br />
                        <span className="text-xs text-neutral-500">Ex: Les profits de Nestlé profitent à BlackRock (actionnaire)</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bénéficiaire lié */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {formData.direction === 'sortante' ? 'Bénéficiaire cible' : 'Bénéficiaire source'} *
              </label>
              <select
                value={formData.beneficiaire_cible_id}
                onChange={(e) => setFormData({...formData, beneficiaire_cible_id: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Sélectionner un bénéficiaire</option>
                {beneficiaires.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.nom} ({b.type_beneficiaire})
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description de la relation *
              </label>
              <textarea
                value={formData.description_relation}
                onChange={(e) => setFormData({...formData, description_relation: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Ex: Actionnaire principal avec 15% des parts DE [Bénéficiaire], Filiale à 100% depuis 2019 DE [Bénéficiaire], Partenaire commercial exclusif DE [Bénéficiaire]..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Créer la relation
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Relations sortantes */}
      {relationsSortantes.length > 0 && (
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Relations sortantes ({relationsSortantes.length})</h4>
          <div className="space-y-2">
            {relationsSortantes.map((relation) => (
              <div key={relation.id} className="bg-white border border-neutral-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-neutral-900">{beneficiaireNom}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                    <div className="text-center">
                      <div className="font-medium text-neutral-900">{relation.beneficiaire_cible.nom}</div>
                      <div className="text-xs text-neutral-500">{relation.beneficiaire_cible.type_beneficiaire}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(relation.id)}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer la relation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {relation.description_relation && (
                  <div className="text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded ml-6">
                    {relation.description_relation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relations entrantes */}
      {relationsEntrantes.length > 0 && (
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Relations entrantes ({relationsEntrantes.length})</h4>
          <div className="space-y-2">
            {relationsEntrantes.map((relation) => (
              <div key={relation.id} className="bg-white border border-neutral-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="font-medium text-neutral-900">{relation.beneficiaire_source.nom}</div>
                      <div className="text-xs text-neutral-500">{relation.beneficiaire_source.type_beneficiaire}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                    <span className="font-medium text-neutral-900">{beneficiaireNom}</span>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(relation.id)}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer la relation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {relation.description_relation && (
                  <div className="text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded ml-6">
                    {relation.description_relation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aperçu des relations transitives */}
      {(relationsSortantes.length > 0 || relationsEntrantes.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Impact transitif</h4>
          <p className="text-sm text-blue-800">
            Ces relations permettent l&apos;affichage transitif : les marques liées à <strong>{beneficiaireNom}</strong> afficheront 
            automatiquement tous les bénéficiaires en relation avec ce dernier, avec une distinction visuelle pour les liens indirects.
          </p>
        </div>
      )}

      {relations.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <p>Aucune relation définie pour ce bénéficiaire</p>
        </div>
      )}
    </div>
  );
}