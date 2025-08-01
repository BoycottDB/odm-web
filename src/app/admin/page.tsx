'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth/admin';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attendre que le composant soit monté pour éviter les problèmes de SSR
    const checkAuth = async () => {
      // Petit délai pour s'assurer que localStorage est disponible
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (adminAuth.isAuthenticated()) {
        // Rediriger vers la modération si connecté
        router.replace('/admin/moderation');
      } else {
        // Rediriger vers le login si pas connecté
        router.replace('/admin/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Page de chargement pendant la redirection
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-berry-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Cette partie ne devrait normalement pas être atteinte à cause des redirections
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
}