import { useState, useEffect, useCallback } from 'react';
import { Evenement, SearchState } from '@/types';

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    results: [],
    notFound: false,
    loading: true
  });

  // Fonction helper pour charger les événements
  const loadEvents = useCallback(async (limit: number = 10) => {
    try {
      const response = await fetch('/api/evenements', { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allEvenements: Evenement[] = await response.json();
      return allEvenements.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      throw error;
    }
  }, []);

  // Charger les événements au démarrage
  useEffect(() => {
    const loadInitialEvents = async () => {
      try {
        const events = await loadEvents(10);
        setSearchState(prev => ({
          ...prev,
          results: events,
          loading: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          loading: false,
          notFound: true
        }));
      }
    };

    loadInitialEvents();
  }, [loadEvents]);

  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  }, []);

  const performSearch = useCallback(async (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    if (!query.trim()) {
      // Si la recherche est vide, recharger les événements initiaux
      try {
        const events = await loadEvents(10);
        setSearchState(prev => ({
          ...prev,
          results: events,
          notFound: false,
          isSearching: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          notFound: true,
          isSearching: false
        }));
      }
      return;
    }

    setSearchState(prev => ({ ...prev, isSearching: true, notFound: false }));

    try {
      const response = await fetch('/api/evenements', { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allEvenements: Evenement[] = await response.json();
      
      const normalizedQuery = query.toLowerCase().trim();
      const filtered = allEvenements.filter(event =>
        event.marque?.nom.toLowerCase().includes(normalizedQuery) ||
        event.description.toLowerCase().includes(normalizedQuery) ||
        event.categorie?.nom.toLowerCase().includes(normalizedQuery)
      );

      setSearchState(prev => ({
        ...prev,
        results: filtered,
        notFound: filtered.length === 0,
        isSearching: false,
        loading: false
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        notFound: true,
        loading: false,
        results: []
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      isSearching: false,
      results: [],
      notFound: false,
      loading: false
    });
  }, []);

  return {
    searchState,
    updateQuery,
    performSearch,
    clearSearch
  };
}
