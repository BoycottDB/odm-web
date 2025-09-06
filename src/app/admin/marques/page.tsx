'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Marque } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function MarquesListPage() {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    loadMarques();
  }, []);
  
  const loadMarques = async () => {
    try {
      const response = await fetch('/api/marques');
      if (response.ok) {
        const data = await response.json();
        setMarques(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredMarques = marques.filter(marque =>
    marque.nom.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.nom.localeCompare(b.nom));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement des marques...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-main font-bold text-neutral-900">Gestion des marques</h2>
        <button
          onClick={() => router.push('/admin/marques/create')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
        >
          + Nouvelle marque
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une marque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral">
          <div className="heading-main font-bold text-neutral-900">{marques.length}</div>
          <div className="body-small text-neutral-600">Marques total</div>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg border border-primary">
          <div className="heading-main font-bold text-primary">
            {marques.filter(m => 
              (m.beneficiaires_marque && m.beneficiaires_marque.length > 0)
            ).length}
          </div>
          <div className="body-small text-primary">Avec bénéficiaire controversé</div>
        </div>
      </div>
      
      {/* Liste des marques */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral">
          <h2 className="body-large font-medium text-neutral-900">
            {filteredMarques.length} marque(s)
          </h2>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {filteredMarques.map((marque) => (
            <div
              key={marque.id}
              className="px-6 py-4 hover:bg-neutral-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/admin/marques/${marque.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h3 className="body-large font-medium text-neutral-900">
                        {marque.nom}
                      </h3>
                      
                      {/* Affichage des bénéficiaires (nouveau système ou legacy) */}
                      {(() => {
                        // Priorité au nouveau système beneficiaires_marque
                        if (marque.beneficiaires_marque && marque.beneficiaires_marque.length > 0) {
                          const nombreBeneficiaires = marque.beneficiaires_marque.length;
                          const premierBeneficiaire = marque.beneficiaires_marque[0];
                          
                          return (
                            <div className="mt-1 flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-primary-50 text-primary">
                                ⚠️ {nombreBeneficiaires} Bénéficiaire{nombreBeneficiaires > 1 ? 's' : ''} controversé{nombreBeneficiaires > 1 ? 's' : ''}
                              </span>
                              <span className="body-small text-neutral-600">
                                {premierBeneficiaire.beneficiaire.nom}
                                {nombreBeneficiaires > 1 && ` et ${nombreBeneficiaires - 1} autre${nombreBeneficiaires > 2 ? 's' : ''}`}
                              </span>
                            </div>
                          );
                        }
                        
                        // Plus de fallback legacy nécessaire
                        
                        // Aucun bénéficiaire
                        return (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-neutral-100 text-neutral-800">
                              Aucun bénéficiaire controversé
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* Flèche */}
                <div className="ml-4">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          
          {filteredMarques.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-neutral-500">
                {searchTerm ? 'Aucune marque trouvée' : 'Aucune marque'}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}