import { useEffect, useRef, useCallback } from 'react';
import { useHeaderSearch } from '@/contexts/HeaderSearchContext';

export function useStickySearchBar() {
  const { setShowHeaderSearch } = useHeaderSearch();
  const originalSearchBarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerHeight = 80; // Height du header sticky (approximative)

  const handleScroll = useCallback(() => {
    if (!originalSearchBarRef.current) return;

    const searchBarRect = originalSearchBarRef.current.getBoundingClientRect();
    const searchBarTop = searchBarRect.top;
    
    // Déclenchement intelligent : quand le header s'approche de la SearchBar
    const threshold = headerHeight - 65;
    
    // La SearchBar devient sticky dans le header quand elle va passer sous le header
    if (searchBarTop <= threshold) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowHeaderSearch(true);
    } 
    // La SearchBar disparaît du header quand on remonte
    else if (searchBarTop > threshold) {
      // Petit délai pour éviter le clignotement
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setShowHeaderSearch(false), 100);
    }
  }, [setShowHeaderSearch, headerHeight]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérification initiale
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);

  return {
    originalSearchBarRef,
    headerHeight
  };
}