'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Flag, CircleHelp } from 'lucide-react';

const classeBouton = 'flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-white border border-neutral-200 shadow-md text-neutral-900 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary';

// Barre fixée en bas d'écran, sur mobile et en page d'accueil : rechercher, signaler, questions fréquentes
export function BarreMobile() {
  const pathname = usePathname();
  const champRelaisRef = useRef<HTMLInputElement>(null);

  // Le clavier mobile ne s'ouvre que sur un focus déclenché par le geste : on le donne à un champ relais
  // qui reste dans le layout, puis la barre de recherche de /marques reprend le focus (clavier toujours ouvert)
  const ouvrirRecherche = () => {
    sessionStorage.setItem('focusRecherche', 'true');
    champRelaisRef.current?.focus();
  };

  return (
    <>
      <input
        ref={champRelaisRef}
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 w-px h-px opacity-0 pointer-events-none text-base"
      />
      {pathname === '/' && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-white"
          aria-label="Navigation mobile"
        >
          {/* Fondu au-dessus de la barre pour adoucir la coupure avec le contenu */}
          <div className="absolute inset-x-0 bottom-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Link
              href="/marques"
              onClick={ouvrirRecherche}
              className="flex-1 min-w-0 flex items-center gap-3 h-12 pl-4 pr-4 rounded-full bg-white border border-neutral-200 shadow-md text-neutral-500 body-base hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Search className="w-5 h-5 shrink-0" aria-hidden="true" />
              Rechercher
            </Link>
            <Link href="/signaler" aria-label="Signaler" className={classeBouton}>
              <Flag className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link href="/faq" aria-label="Questions fréquentes" className={classeBouton}>
              <CircleHelp className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
