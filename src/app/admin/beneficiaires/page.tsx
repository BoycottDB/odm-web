'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BeneficiaireWithMarques } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { User, Building2 } from 'lucide-react';

export default function BeneficiaireListPage() {
  const [beneficiaires, setBeneficiaires] = useState<BeneficiaireWithMarques[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    loadBeneficiaires();
  }, []);
  
  const loadBeneficiaires = async () => {
    try {
      const response = await fetch('/api/beneficiaires');
      if (response.ok) {
        const data = await response.json();
        setBeneficiaires(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bénéficiaires:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredBeneficiaires = beneficiaires.filter(beneficiaire =>
    beneficiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficiaire.marques.some(marque => 
      marque.nom.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => a.nom.localeCompare(b.nom));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement des bénéficiaires...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <AdminNavigation />
      <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="heading-main font-bold text-neutral-900">Bénéficiaires controversés</h2>
        <button
          onClick={() => router.push('/admin/beneficiaires/create')}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
        >
          + Nouveau bénéficiaire
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un bénéficiaire ou une marque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary">
          <div className="heading-main font-bold text-primary">{beneficiaires.length}</div>
          <div className="body-small text-primary">Bénéficiaires controversés</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral">
          <div className="heading-main font-bold text-neutral-900">
            {beneficiaires.filter(b => b.type_beneficiaire === 'individu').length}
          </div>
          <div className="body-small text-neutral-600">👤 Individus</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral">
          <div className="heading-main font-bold text-neutral-900">
            {beneficiaires.filter(b => b.type_beneficiaire === 'groupe').length}
          </div>
          <div className="body-small text-neutral-600">🏢 Groupes</div>
        </div>
      </div>
      
      {beneficiaires.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral p-12 text-center">
          <div className="text-neutral-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="body-large font-medium text-neutral-900 mb-2">Aucun bénéficiaire controversé</h3>
          <p className="text-neutral-600 mb-6">Commencez par ajouter un bénéficiaire controversé pour traquer les marques liées.</p>
          <button
            onClick={() => router.push('/admin/beneficiaires/create')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover"
          >
            Ajouter le premier bénéficiaire
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBeneficiaires.map((beneficiaire) => (
            <BeneficiaireCard 
              key={beneficiaire.id} 
              beneficiaire={beneficiaire} 
              onEdit={() => router.push(`/admin/beneficiaires/${beneficiaire.id}`)}
            />
          ))}
          
          {filteredBeneficiaires.length === 0 && searchTerm && (
            <div className="col-span-2 text-center py-12">
              <div className="text-neutral-500">Aucun bénéficiaire trouvé pour &quot;{searchTerm}&quot;</div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
}

interface BeneficiaireCardProps {
  beneficiaire: BeneficiaireWithMarques;
  onEdit: () => void;
}

function BeneficiaireCard({ beneficiaire, onEdit }: BeneficiaireCardProps) {
  const isGroupe = beneficiaire.type_beneficiaire === 'groupe';
  const Icon = isGroupe ? Building2 : User;
  const typeLabel = isGroupe ? 'Groupe' : 'Individu';

  return (
    <div 
      className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="heading-sub font-semibold text-neutral-900">{beneficiaire.nom}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isGroupe 
              ? 'bg-secondary-100 text-secondary-700' 
              : 'bg-secondary-100 text-secondary-700'
          }`}>
            {typeLabel}
          </span>
          <div className="text-info p-1 rounded" title="Gérer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
      </div>
      
      <p className="body-small text-neutral-600 mb-4 line-clamp-3">
        {beneficiaire.controverses && beneficiaire.controverses.length > 0
          ? beneficiaire.controverses.map(c => c.titre).join(' • ')
          : 'Aucune controverse documentée'
        }
      </p>
      
      <div className="mb-4">
        <div className="body-small font-medium text-neutral-700 mb-2">
          Marques liées ({beneficiaire.marques.length}) :
        </div>
        <div className="flex flex-wrap gap-2">
          {beneficiaire.marques.slice(0, 6).map((marque) => (
            <span 
              key={marque.id} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-primary-50 text-primary"
            >
              {marque.nom}
            </span>
          ))}
          {beneficiaire.marques.length > 6 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-neutral-100 text-neutral-800">
              +{beneficiaire.marques.length - 6} autres
            </span>
          )}
        </div>
      </div>
      
      <div className="body-xs text-neutral-500">
        {beneficiaire.controverses ? beneficiaire.controverses.length : 0} controverse(s) documentée(s)
      </div>
    </div>
  );
}