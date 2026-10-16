'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      // Le serveur vérifie le token et le range dans un cookie httpOnly
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        router.push('/admin/moderation');
      } else if (response.status === 401) {
        setError('Token invalide');
      } else {
        setError('Erreur serveur, réessayez plus tard');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center heading-main text-neutral-900">
            Administration
          </h2>
          <p className="mt-2 text-center body-small text-neutral-600">
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
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-neutral-200 placeholder-neutral-400 text-neutral-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:body-small"
              placeholder="Token d'administration"
            />
          </div>

          {error && (
            <div className="text-error body-small text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="bouton-primaire group relative w-full flex py-2 px-4 border border-transparent body-small focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}