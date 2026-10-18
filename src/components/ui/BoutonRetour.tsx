'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// Bouton retour du header mobile, hors page d'accueil (comme une app)
export function BoutonRetour() {
  const pathname = usePathname();
  const router = useRouter();
  const premierePageRef = useRef(pathname);
  const aNavigueRef = useRef(false);

  // Retient si l'utilisateur a navigué dans le site depuis son arrivée
  useEffect(() => {
    if (pathname !== premierePageRef.current) aNavigueRef.current = true;
  }, [pathname]);

  if (pathname === '/') return null;

  // Arrivée directe sur la page (lien partagé, moteur de recherche) : retour à l'accueil plutôt que hors du site
  const retour = () => {
    if (aNavigueRef.current) router.back();
    else router.push('/');
  };

  return (
    <button
      type="button"
      onClick={retour}
      aria-label="Retour"
      className="md:hidden absolute left-2 flex items-center justify-center w-9 h-9 rounded-full text-primary hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <ChevronLeft className="w-6 h-6" aria-hidden="true" />
    </button>
  );
}
