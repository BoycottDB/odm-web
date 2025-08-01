'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier s'il y a un token admin
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Rediriger vers la modération si connecté
      router.replace('/admin/moderation');
    } else {
      // Rediriger vers le login si pas connecté
      router.replace('/admin/login');
    }
  }, [router]);

  // Page de chargement pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}