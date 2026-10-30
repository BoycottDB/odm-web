'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Flag, Megaphone, CircleHelp, type LucideIcon } from 'lucide-react';

interface Onglet {
  href: string;
  libelle: string;
  icone: LucideIcon;
  misEnAvant?: boolean;
}

const ONGLETS: Onglet[] = [
  { href: '/marques', libelle: 'Rechercher', icone: Search },
  { href: '/boycotter', libelle: 'Boycotter ?', icone: Megaphone, misEnAvant: true },
  { href: '/signaler', libelle: 'Signaler', icone: Flag },
  { href: '/faq', libelle: 'FAQ', icone: CircleHelp },
];

// Masquée sur la recherche (clavier ouvert, champ en haut) et dans l'administration
export function barreMobileVisible(pathname: string) {
  return pathname !== '/marques' && !pathname.startsWith('/admin');
}

// Un onglet reste actif sur ses sous-pages (/faq/moderation, /marques/[slug])
function ongletActif(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Champ de saisie : le clavier mobile s'ouvre et la barre lui prendrait de la place
function estChampDeSaisie(element: EventTarget | null) {
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true;
  if (element instanceof HTMLInputElement) return !['checkbox', 'radio', 'button', 'submit', 'reset', 'file'].includes(element.type);
  return element instanceof HTMLElement && element.isContentEditable;
}

// Barre d'onglets fixée en bas d'écran sur mobile : rechercher, boycotter, signaler, FAQ
export function BarreMobile() {
  const pathname = usePathname();
  const [saisieEnCours, setSaisieEnCours] = useState(false);

  // Masque la barre tant qu'un champ de saisie a le focus (formulaire de signalement, recherche des fiches)
  useEffect(() => {
    const surFocus = (e: FocusEvent) => setSaisieEnCours(estChampDeSaisie(e.target));
    // relatedTarget : élément qui reçoit le focus, pour ne pas faire clignoter la barre entre deux champs
    const surPerteFocus = (e: FocusEvent) => setSaisieEnCours(estChampDeSaisie(e.relatedTarget));
    document.addEventListener('focusin', surFocus);
    document.addEventListener('focusout', surPerteFocus);
    return () => {
      document.removeEventListener('focusin', surFocus);
      document.removeEventListener('focusout', surPerteFocus);
    };
  }, []);

  if (!barreMobileVisible(pathname) || saisieEnCours) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-primary-medium shadow-[0_-2px_8px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Navigation mobile"
    >
      <ul className="grid grid-cols-4">
        {ONGLETS.map(({ href, libelle, icone: Icone, misEnAvant }) => {
          const actif = ongletActif(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={actif ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 pt-2 pb-2 text-xs ${misEnAvant ? 'font-bold' : 'font-medium'} transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${actif ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
              >
                {/* Pastille sous l'icône de l'onglet actif */}
                <span className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${actif ? 'bg-primary-light' : ''}`}>
                  <Icone className="w-6 h-6" strokeWidth={actif ? 2.25 : 2} aria-hidden="true" />
                </span>
                {libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
