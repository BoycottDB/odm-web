'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { BeneficiaireForm } from '@/components/admin/BeneficiaireForm';
import { BeneficiaireCreateRequest, BeneficiaireUpdateRequest } from '@/types';

export default function CreateBeneficiairePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: BeneficiaireCreateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/beneficiaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/beneficiaires');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création bénéficiaire:', error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-neutral-900">
            Nouveau bénéficiaire controversé
          </h1>
          <p className="text-neutral-600 mt-2">
            Ajoutez un individu ou groupe controversé qui bénéficie financièrement de marques.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <BeneficiaireForm
            onSubmit={(data: BeneficiaireCreateRequest | BeneficiaireUpdateRequest) => {
              if (!('id' in data)) {
                handleSubmit(data as BeneficiaireCreateRequest);
              }
            }}
            onCancel={() => router.back()}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}