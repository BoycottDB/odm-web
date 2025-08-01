'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth/admin';
import { apiService } from '@/lib/services/api';
import { Proposition } from '@/types';
import PropositionDetail from '@/components/admin/PropositionDetail';
import PropositionList from '@/components/admin/PropositionList';

export default function AdminModeration() {
  const [propositions, setPropositions] = useState<Proposition[]>([]);
  const [selectedProposition, setSelectedProposition] = useState<Proposition | null>(null);
  // Plus besoin de filtre - il n'y a que des événements
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
        throw new Error('Erreur lors du chargement des propositions');
      }
      
      const data = await response.json();
      setPropositions(data);
    } catch (err) {
      setError('Erreur lors du chargement des propositions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropositionUpdate = async (id: number, updateData: {
    statut: 'approuve' | 'rejete';
    commentaire_admin?: string;
    decision_publique: boolean;
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
      alert('Erreur lors de la mise à jour de la proposition');
    }
  };

  const handleLogout = () => {
    adminAuth.removeToken();
    router.push('/admin/login');
  };

  const filteredPropositions = propositions.filter(p => p.statut === 'en_attente'); // Seulement les propositions en attente

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des propositions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadPropositions}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Modération
              </h1>
              <div className="ml-6 flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredPropositions.length} événements en attente
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedProposition(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Vue liste
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProposition ? (
          <PropositionDetail
            proposition={selectedProposition}
            onUpdate={handlePropositionUpdate}
            onBack={() => setSelectedProposition(null)}
          />
        ) : (
          <div>
            {/* Plus besoin de filtres - il n'y a que des événements */}

            {/* Liste des propositions */}
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