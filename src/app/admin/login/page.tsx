'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth/admin';

export default function AdminLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Tester le token en faisant un appel API
      const response = await fetch('/api/propositions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        adminAuth.setToken(token);
        router.push('/admin/moderation');
      } else {
        setError('Token invalide');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Administration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accès réservé aux modérateurs
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token" className="sr-only">
              Token d&apos;administration
            </label>
            <input
              id="token"
              name="token"
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-berry-500 focus:border-berry-500 focus:z-10 sm:text-sm"
              placeholder="Token d'administration"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-berry-600 hover:bg-berry-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-berry-500 disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}