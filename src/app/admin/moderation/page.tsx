'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth/admin';
import { Proposition } from '@/types';
import PropositionDetail from '@/components/admin/PropositionDetail';
import PropositionList from '@/components/admin/PropositionList';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function AdminModeration() {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [selectedProposition, setSelectedProposition] = useState<Proposition | null>(null);
  // Plus besoin de filtre - il n'y a que des controverses
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    
    loadPropositions();
  }, [router]);

  const loadPropositions = async () => {
    try {
      setIsLoading(true);
      // Utilisation directe de fetch avec les headers d'authentification
      const response = await fetch('/api/propositions', {
        headers: adminAuth.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des signalements');
      }
      
      const data = await response.json();
      setPropositions(data);
    } catch (err) {
      setError('Erreur lors du chargement des signalements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropositionUpdate = async (id: number, updateData: {
    statut: 'approuve' | 'rejete';
    commentaire_admin?: string;
    condamnation_judiciaire?: boolean;
  }) => {
    try {
      const response = await fetch(`/api/propositions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...adminAuth.getAuthHeaders()
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      await loadPropositions();
      setSelectedProposition(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour du signalement');
    }
  };

  // const handleLogout = () => {
  //   adminAuth.removeToken();
  //   router.push('/admin/login');
  // };

  const filteredPropositions = propositions.filter(p => p.statut === 'en_attente'); // Seulement les signalements en attente

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement des signalements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-error-light border border-error text-error px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadPropositions}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNavigation />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="heading-main font-bold text-neutral-900">
              Modération des signalements
            </h2>
            <div className="ml-6 flex items-center space-x-4">
              <span className="bg-info-light text-info px-3 py-1 rounded-full body-small font-medium">
                {filteredPropositions.length} signalements en attente
              </span>
            </div>
          </div>
        </div>
        {selectedProposition ? (
          <PropositionDetail
            proposition={selectedProposition}
            onUpdate={handlePropositionUpdate}
            onBack={() => setSelectedProposition(null)}
          />
        ) : (
          <div>
            {/* Plus besoin de filtres - il n'y a que des controverses */}

            {/* Liste des signalements */}
            <PropositionList
              propositions={filteredPropositions}
              onSelectProposition={setSelectedProposition}
            />
          </div>
        )}
      </div>
    </div>
  );
}