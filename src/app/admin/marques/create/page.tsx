'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function CreateMarquePage() {
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      setMessage({ type: 'error', text: 'Le nom de la marque est obligatoire' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/marques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      const newMarque = await response.json();
      setMessage({ type: 'success', text: 'Marque créée avec succès' });
      
      // Redirection vers la page de détail de la marque
      setTimeout(() => {
        router.push(`/admin/marques/${newMarque.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur création marque:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la création' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push('/admin/marques')}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle marque</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la marque *
              </label>
              <input
                type="text"
                placeholder="Ex: Tesla, Apple, Nestlé..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-berry-500"
                maxLength={255}
                disabled={loading}
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading || !nom.trim()}
                className="flex-1 bg-berry-600 text-white px-4 py-2 rounded-lg hover:bg-berry-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer la marque'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/marques')}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}