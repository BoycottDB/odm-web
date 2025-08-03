'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DirigeantWithMarques } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function DirigeantListPage() {
  const [dirigeants, setDirigeants] = useState<DirigeantWithMarques[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    loadDirigeants();
  }, []);
  
  const loadDirigeants = async () => {
    try {
      const response = await fetch('/api/dirigeants');
      if (response.ok) {
        const data = await response.json();
        setDirigeants(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dirigeants:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredDirigeants = dirigeants.filter(dirigeant =>
    dirigeant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dirigeant.marques.some(marque => 
      marque.nom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => a.nom.localeCompare(b.nom));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-berry-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des dirigeants...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dirigeants controversés</h1>
        <button
          onClick={() => router.push('/admin/dirigeants/create')}
          className="bg-berry-600 text-white px-4 py-2 rounded-lg hover:bg-berry-700"
        >
          + Nouveau dirigeant
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un dirigeant ou une marque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
        />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-berry-50 p-4 rounded-lg border border-berry-200">
          <div className="text-2xl font-bold text-berry-900">{dirigeants.length}</div>
          <div className="text-sm text-berry-700">Dirigeants controversés</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {dirigeants.reduce((sum, d) => sum + d.marques.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Marques liées</div>
        </div>
      </div>
      
      {dirigeants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dirigeant controversé</h3>
          <p className="text-gray-600 mb-6">Commencez par ajouter un dirigeant controversé pour traquer les marques liées.</p>
          <button
            onClick={() => router.push('/admin/dirigeants/create')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Ajouter le premier dirigeant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDirigeants.map((dirigeant) => (
            <DirigeantCard 
              key={dirigeant.nom} 
              dirigeant={dirigeant} 
              onEdit={() => router.push(`/admin/dirigeants/${encodeURIComponent(dirigeant.nom)}`)}
            />
          ))}
          
          {filteredDirigeants.length === 0 && searchTerm && (
            <div className="col-span-2 text-center py-12">
              <div className="text-gray-500">Aucun dirigeant trouvé pour &quot;{searchTerm}&quot;</div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DirigeantCardProps {
  dirigeant: DirigeantWithMarques;
  onEdit: () => void;
}

function DirigeantCard({ dirigeant, onEdit }: DirigeantCardProps) {
  return (
    <div 
      className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{dirigeant.nom}</h3>
        <div className="flex space-x-2">
          <div className="text-blue-600 p-1 rounded" title="Gérer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {dirigeant.controverses.length > 200 
          ? `${dirigeant.controverses.substring(0, 200)}...`
          : dirigeant.controverses
        }
      </p>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Marques liées ({dirigeant.marques.length}) :
        </div>
        <div className="flex flex-wrap gap-2">
          {dirigeant.marques.slice(0, 6).map((marque) => (
            <span 
              key={marque.id} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-berry-100 text-berry-800"
            >
              {marque.nom}
            </span>
          ))}
          {dirigeant.marques.length > 6 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{dirigeant.marques.length - 6} autres
            </span>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {dirigeant.sources.length} source(s) documentée(s)
      </div>
    </div>
  );
}