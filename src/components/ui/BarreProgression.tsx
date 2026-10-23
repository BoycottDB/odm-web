'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const EVENEMENT_DEPART = 'odm-navigation-depart';
// Navigation plus rapide que ce délai : la barre reste invisible (même valeur que l'animation-delay de .animate-progression)
const DELAI_AFFICHAGE_MS = 150;
const DUREE_FIN_MS = 300;

// À appeler avant un router.push : affiche la barre si l'adresse mène à une autre page du site
export function demarrerNavigation(href: string) {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
  window.dispatchEvent(new Event(EVENEMENT_DEPART));
}

// Clic gauche simple sur un lien qui s'ouvre dans l'onglet courant
function lienClique(e: MouseEvent) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const lien = e.target instanceof Element ? e.target.closest('a[href]') : null;
  if (!(lien instanceof HTMLAnchorElement) || lien.target === '_blank' || lien.hasAttribute('download')) return null;
  return lien;
}

// Fine barre en haut de l'écran pendant le chargement de la page suivante
export function BarreProgression() {
  const pathname = usePathname();
  const [etat, setEtat] = useState<'repos' | 'en-cours' | 'fin'>('repos');
  const departRef = useRef(0);

  useEffect(() => {
    const demarrer = () => {
      departRef.current = Date.now();
      setEtat('en-cours');
    };
    const surClic = (e: MouseEvent) => {
      const lien = lienClique(e);
      if (lien) demarrerNavigation(lien.href);
    };
    window.addEventListener(EVENEMENT_DEPART, demarrer);
    document.addEventListener('click', surClic);
    return () => {
      window.removeEventListener(EVENEMENT_DEPART, demarrer);
      document.removeEventListener('click', surClic);
    };
  }, []);

  // Nouvelle page affichée : la barre se complète puis s'efface (sauf si elle n'est jamais apparue)
  useEffect(() => {
    setEtat((etat) => {
      if (etat !== 'en-cours') return etat;
      return Date.now() - departRef.current < DELAI_AFFICHAGE_MS ? 'repos' : 'fin';
    });
  }, [pathname]);

  useEffect(() => {
    if (etat !== 'fin') return;
    const minuteur = setTimeout(() => setEtat('repos'), DUREE_FIN_MS);
    return () => clearTimeout(minuteur);
  }, [etat]);

  if (etat === 'repos') return null;

  return (
    <div aria-hidden="true" className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none">
      <div className={`h-full bg-primary ${etat === 'en-cours' ? 'animate-progression' : 'animate-progression-fin'}`} />
    </div>
  );
}
