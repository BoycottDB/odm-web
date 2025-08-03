'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DirigeantWithMarques, Marque, MarqueDirigeantCreateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';

interface LierMarqueClientProps {
  dirigeantNom: string;
}

export function LierMarqueClient({ dirigeantNom }: LierMarqueClientProps) {
  const [dirigeant, setDirigeant] = useState<DirigeantWithMarques | null>(null);
  const [availableMarques, setAvailableMarques] = useState<Marque[]>([]);
  const [selectedMarque, setSelectedMarque] = useState<number | null>(null);
  const [lienFinancier, setLienFinancier] = useState('');
  const [impact, setImpact] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [dirigeantNom]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const [dirigeantsResponse, marquesResponse] = await Promise.all([
        fetch('/api/dirigeants'),
        fetch('/api/marques')
      ]);

      if (dirigeantsResponse.ok && marquesResponse.ok) {
        const dirigeants = await dirigeantsResponse.json();
        const marques = await marquesResponse.json();

        const foundDirigent = dirigeants.find((d: DirigeantWithMarques) => d.nom === dirigeantNom);
        if (foundDirigent) {
          setDirigeant(foundDirigent);

          // Marques disponibles = toutes les marques - celles déjà liées à ce dirigeant
          const linkedMarqueIds = foundDirigent.marques.map((m: Marque & { liaison_id?: number }) => m.id);
          const available = marques.filter((m: Marque) => 
            !linkedMarqueIds.includes(m.id) && !m.dirigeant_controverse
          );
          setAvailableMarques(available);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement' });
    } finally {
      setLoading(false);
    }
  };

  const linkMarque = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMarque || !lienFinancier.trim() || !impact.trim() || !dirigeant) {
      setMessage({ type: 'error', text: 'Tous les champs sont obligatoires' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const payload: MarqueDirigeantCreateRequest = {
        marque_id: selectedMarque,
        dirigeant_nom: dirigeant.nom,
        controverses: dirigeant.controverses,
        lien_financier: lienFinancier.trim(),
        impact_description: impact.trim(),
        sources: dirigeant.sources
      };

      const response = await fetch('/api/dirigeants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la liaison');
      }

      setMessage({ type: 'success', text: 'Marque liée avec succès' });
      
      // Redirection vers la page de détail du dirigeant après liaison réussie
      setTimeout(() => {
        router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}`);
      }, 1000);

    } catch (error) {
      console.error('Erreur liaison marque:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la liaison' 
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

  if (!dirigeant) {
    return (
      <div>
        <AdminNavigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h2 className="heading-main font-bold text-neutral-900 mb-4">Dirigeant non trouvé</h2>
            <button
              onClick={() => router.push('/admin/dirigeants')}
              className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700"
            >
              Retour à la liste
            </button>
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
            onClick={() => router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}`)}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="heading-sub font-bold text-neutral-900">
            Lier une marque à {dirigeant.nom}
          </h2>
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

        {availableMarques.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral p-12 text-center">
            <div className="text-neutral-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="body-large font-medium text-neutral-900 mb-2">Aucune marque disponible</h3>
            <p className="text-neutral-600 mb-6">Toutes les marques sont déjà liées à des dirigeants controversés.</p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/admin/marques/create')}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
              >
                Créer une nouvelle marque
              </button>
              <button
                onClick={() => router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}`)}
                className="bg-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-400"
              >
                Retour
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral p-6">
            <form onSubmit={linkMarque} className="space-y-6">
              <div>
                <label className="block body-small font-medium text-neutral-700 mb-2">
                  Marque à lier *
                </label>
                <select
                  value={selectedMarque || ''}
                  onChange={(e) => setSelectedMarque(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={saving}
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

              <div>
                <label className="block body-small font-medium text-neutral-700 mb-2">
                  Lien financier avec la marque *
                </label>
                <input
                  type="text"
                  placeholder="Co-fondateur et actionnaire via Otium Capital (100%)"
                  value={lienFinancier}
                  onChange={(e) => setLienFinancier(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block body-small font-medium text-neutral-700 mb-2">
                  Impact de l&apos;achat *
                </label>
                <input
                  type="text"
                  placeholder="100% de vos achats contribuent au financement du projet Périclès"
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                  required
                  disabled={saving}
                />
              </div>

              <div className="bg-primary-light rounded-lg border border-primary p-4">
                <h3 className="body-small font-medium text-primary mb-2">Aperçu du dirigeant</h3>
                <div className="body-small text-primary font-medium">{dirigeant.nom}</div>
                <div className="body-xs text-primary mt-1 line-clamp-2">
                  {dirigeant.controverses.length > 150 
                    ? `${dirigeant.controverses.substring(0, 150)}…`
                    : dirigeant.controverses
                  }
                </div>
                <div className="body-xs text-primary mt-1">
                  {dirigeant.sources.length} source(s) documentée(s)
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={saving || !selectedMarque || !lienFinancier.trim() || !impact.trim()}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Liaison en cours...' : 'Lier la marque'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}`)}
                  className="flex-1 bg-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}