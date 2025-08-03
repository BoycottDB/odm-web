import { useState, useEffect, useCallback } from 'react';
import { Evenement, SearchState, Marque, DirigeantResult } from '@/types';

export function useSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    results: [],
    dirigeantResults: [],
    notFound: false,
    loading: true
  });

  // Fonction helper pour charger les événements (sans dirigeants pour l'affichage initial)
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
          dirigeantResults: [],
          loading: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          loading: false,
          notFound: true,
          dirigeantResults: []
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
          dirigeantResults: [],
          notFound: false,
          isSearching: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          dirigeantResults: [],
          notFound: true,
          isSearching: false
        }));
      }
      return;
    }

    setSearchState(prev => ({ ...prev, isSearching: true, notFound: false }));

    try {
      const [evenementsResponse, marquesResponse] = await Promise.all([
        fetch('/api/evenements', { cache: 'no-store' }),
        fetch('/api/marques', { cache: 'no-store' })
      ]);
      
      if (!evenementsResponse.ok || !marquesResponse.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      
      const allEvenements: Evenement[] = await evenementsResponse.json();
      const allMarques: Marque[] = await marquesResponse.json();
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Filtrer les événements existants
      const filteredEvents = allEvenements.filter(event =>
        event.marque?.nom.toLowerCase().includes(normalizedQuery) ||
        event.titre.toLowerCase().includes(normalizedQuery) ||
        event.categorie?.nom.toLowerCase().includes(normalizedQuery)
      );
      
      // Trouver les marques avec dirigeants controversés qui correspondent à la recherche
      const marquesWithDirigeants = allMarques.filter((marque: Marque) => 
        marque.nom.toLowerCase().includes(normalizedQuery) &&
        marque.dirigeant_controverse
      );
      
      // Créer des résultats spécifiques pour les dirigeants
      const dirigeantResults: DirigeantResult[] = marquesWithDirigeants.map((marque: Marque) => ({
        id: `dirigeant-${marque.id}`,
        type: 'dirigeant' as const,
        marque: marque,
        dirigeant: marque.dirigeant_controverse!
      }));

      const hasResults = filteredEvents.length > 0 || dirigeantResults.length > 0;

      setSearchState(prev => ({
        ...prev,
        results: filteredEvents,
        dirigeantResults: dirigeantResults,
        notFound: !hasResults,
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
        results: [],
        dirigeantResults: []
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      isSearching: false,
      results: [],
      dirigeantResults: [],
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
