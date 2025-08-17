'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BeneficiaireWithMarques, BeneficiaireUpdateRequest, BeneficiaireCreateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { BeneficiaireForm } from '@/components/admin/BeneficiaireForm';
import { ControversesManager } from '@/components/admin/ControversesManager';
import RelationsManager from '@/components/admin/RelationsManager';
import { User, Building2, Trash2 } from 'lucide-react';

export default function BeneficiaireDetailPage() {
  const [beneficiaire, setBeneficiaire] = useState<BeneficiaireWithMarques | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const beneficiaireId = params.id as string;

  useEffect(() => {
    if (beneficiaireId) {
      loadBeneficiaire();
    }
  }, [beneficiaireId]);

  const loadBeneficiaire = async () => {
    try {
      const response = await fetch(`/api/beneficiaires?id=${beneficiaireId}`);
      if (response.ok) {
        const data = await response.json();
        setBeneficiaire(data);
      } else {
        setError('Bénéficiaire introuvable');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du bénéficiaire:', error);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: BeneficiaireUpdateRequest) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/beneficiaires', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, id: parseInt(beneficiaireId) }),
      });

      if (response.ok) {
        await loadBeneficiaire(); // Reload data
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour bénéficiaire:', error);
      setError('Erreur de connexion');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/beneficiaires', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(beneficiaireId) }),
      });

      if (response.ok) {
        router.push('/admin/beneficiaires');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression bénéficiaire:', error);
      setError('Erreur de connexion');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement du bénéficiaire...</p>
        </div>
      </div>
    );
  }

  if (!beneficiaire) {
    return (
      <div>
        <AdminNavigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Bénéficiaire introuvable</h1>
            <p className="text-neutral-600 mb-6">Ce bénéficiaire n&apos;existe pas ou a été supprimé.</p>
            <button
              onClick={() => router.push('/admin/beneficiaires')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isGroupe = beneficiaire.type_beneficiaire === 'groupe';
  const Icon = isGroupe ? Building2 : User;
  const typeLabel = isGroupe ? 'Groupe' : 'Individu';

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-primary hover:text-primary-600 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{beneficiaire.nom}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isGroupe 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {typeLabel}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-600">{beneficiaire.marques?.length || 0} marque(s) liée(s)</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Marques liées */}
        {beneficiaire.marques && beneficiaire.marques.length > 0 && (
          <div className="bg-primary-light border border-primary rounded-lg p-4 mb-6">
            <h3 className="font-medium text-primary mb-3">Marques liées :</h3>
            <div className="flex flex-wrap gap-2">
              {beneficiaire.marques.map((marque) => (
                <span 
                  key={marque.id} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-primary border border-primary"
                >
                  {marque.nom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informations de base */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Informations générales</h2>
          <BeneficiaireForm
            beneficiaire={{
              ...beneficiaire,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }}
            onSubmit={(data: BeneficiaireCreateRequest | BeneficiaireUpdateRequest) => {
              if ('id' in data) {
                handleUpdate(data as BeneficiaireUpdateRequest);
              }
            }}
            onCancel={() => router.back()}
            loading={updating}
          />
        </div>

        {/* Gestion des relations */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <RelationsManager 
            beneficiaireId={parseInt(beneficiaireId)}
            beneficiaireNom={beneficiaire.nom}
            onUpdate={() => {
              loadBeneficiaire(); // Recharger les données du bénéficiaire
            }}
          />
        </div>

        {/* Gestion des controverses */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Controverses documentées</h2>
          <ControversesManager 
            beneficiaireId={parseInt(beneficiaireId)}
            onUpdate={() => {
              loadBeneficiaire(); // Recharger les données du bénéficiaire
            }}
          />
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-neutral-600 mb-6">
                Êtes-vous sûr de vouloir supprimer <strong>{beneficiaire.nom}</strong> ?
                Cette action supprimera également toutes les liaisons avec les marques.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-neutral-200 text-neutral-800 py-2 px-4 rounded-md font-medium hover:bg-neutral-300 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}