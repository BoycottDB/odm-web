'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Marque, MarqueDirigeantCreateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import DirigentForm from '@/components/admin/DirigentForm';

export default function CreateDirigeantPage() {
  const [availableMarques, setAvailableMarques] = useState<Marque[]>([]);
  const [selectedMarque, setSelectedMarque] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadAvailableMarques();
  }, []);

  const loadAvailableMarques = async () => {
    try {
      const response = await fetch('/api/marques');
      if (response.ok) {
        const marques = await response.json();
        // Marques sans dirigeant controversé
        const available = marques.filter((m: Marque) => !m.dirigeant_controverse);
        setAvailableMarques(available);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des marques' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: MarqueDirigeantCreateRequest) => {
    if (!selectedMarque) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une marque' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...data,
        marque_id: selectedMarque
      };

      const response = await fetch('/api/dirigeants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setMessage({ type: 'success', text: 'Dirigeant créé avec succès' });
      
      // Redirection vers la page de détail du dirigeant
      setTimeout(() => {
        router.push(`/admin/dirigeants/${encodeURIComponent(data.dirigeant_nom)}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur création dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la création' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push('/admin/dirigeants')}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="heading-hero font-bold text-neutral-900">Nouveau dirigeant controversé</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-success-light border border-success text-success' 
              : 'bg-error-light border border-error text-error'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg border border-neutral p-6 mb-6">
          <h2 className="body-large font-semibold text-neutral-900 mb-4">Sélection de la marque</h2>
          
          {availableMarques.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-neutral-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="body-large font-medium text-neutral-900 mb-2">Aucune marque disponible</h3>
              <p className="text-neutral-600 mb-4">Toutes les marques ont déjà un dirigeant controversé associé.</p>
              <button
                onClick={() => router.push('/admin/marques/create')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
              >
                Créer une nouvelle marque
              </button>
            </div>
          ) : (
            <div>
              <label className="block body-small font-medium text-neutral-700 mb-2">
                Marque à associer *
              </label>
              <select
                value={selectedMarque || ''}
                onChange={(e) => setSelectedMarque(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Sélectionnez une marque</option>
                {availableMarques.map((marque) => (
                  <option key={marque.id} value={marque.id}>
                    {marque.nom}
                  </option>
                ))}
              </select>
              <p className="body-xs text-neutral-500 mt-1">
                {availableMarques.length} marque(s) disponible(s)
              </p>
            </div>
          )}
        </div>

        {selectedMarque && (
          <DirigentForm
            marqueId={selectedMarque}
            onSave={handleSave}
            isLoading={saving}
          />
        )}
      </div>
    </div>
  );
}