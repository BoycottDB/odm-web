import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchState, Marque, Evenement } from '@/types';

// ✅ Cache intelligent avec partage données
class SearchCache {
  private static instance: SearchCache;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static getInstance(): SearchCache {
    if (!SearchCache.instance) {
      SearchCache.instance = new SearchCache();
    }
    return SearchCache.instance;
  }

  set(key: string, data: any, ttlMs: number = 10 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  // ✅ Extraire suggestions intelligemment depuis les marques en cache
  extractSuggestionsFromMarques(query: string, limit: number = 10): Marque[] {
    const normalizedQuery = query.toLowerCase().trim();

    // Chercher dans toutes les marques déjà en cache
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith('marques_') && Date.now() - entry.timestamp <= entry.ttl) {
        const marques: Marque[] = entry.data;
        if (marques && Array.isArray(marques)) {
          // Utiliser la même logique que l'API: correspondance au début du nom uniquement (prefix match)
          return marques
            .filter(m => {
              const nom = m.nom.toLowerCase();
              return nom.startsWith(normalizedQuery);
            })
            .slice(0, limit);
        }
      }
    }

    return [];
  }
}

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cache = useMemo(() => SearchCache.getInstance(), []);

  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    results: [],
    marque: null,
    notFound: false,
    loading: true,
    hasPerformedSearch: false,
    // ✅ Suggestions intégrées
    suggestions: [],
    suggestionHighlighted: -1,
    showSuggestions: false
  });

  // ✅ DataService import centralisé
  const getDataService = useCallback(async () => {
    const { dataService } = await import('@/lib/services/dataService');
    return dataService;
  }, []);

  // ✅ Gestion d'erreurs centralisée
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Erreur lors de ${operation}:`, error);
    setSearchState(prev => ({
      ...prev,
      isSearching: false,
      notFound: true,
      loading: false,
      showSuggestions: false
    }));
  }, []);

  // ✅ Chargement événements avec cache
  const loadEvents = useCallback(async (limit: number = 10) => {
    const cacheKey = `events_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const dataService = await getDataService();
      const events = await dataService.getEvenements();
      const result = events.slice(0, limit);

      cache.set(cacheKey, result, 15 * 60 * 1000); // 15min cache
      return result;
    } catch (error) {
      handleError(error, 'chargement des événements');
      throw error;
    }
  }, [cache, getDataService, handleError]);

  // Suggestions intelligentes avec cache partagé
  const updateSuggestions = useCallback(async (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();

    if (normalizedQuery.length === 0) {
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        suggestionHighlighted: -1,
        showSuggestions: false
      }));
      return;
    }

    try {
      // 1. Toujours utiliser l'API dédiée suggestions pour être complet
      // (Le cache d'extraction n'est utilisé que si l'API échoue)
      const cacheKey = `suggestions_${normalizedQuery}`;
      let suggestions = cache.get(cacheKey);

      if (!suggestions) {
        const dataService = await getDataService();
        const apiSuggestions = await dataService.getSuggestions(normalizedQuery, 10);

        // Convertir vers format Marque complet (plus besoin de propriétés factices)
        suggestions = apiSuggestions.map(s => ({
          id: s.id,
          nom: s.nom,
          beneficiaires_marque: [] // Vide pour suggestions, sera rempli si sélectionné
        }));

        cache.set(cacheKey, suggestions, 5 * 60 * 1000); // 5min cache
      }

      setSearchState(prev => ({
        ...prev,
        suggestions,
        suggestionHighlighted: -1,
        showSuggestions: suggestions.length > 0
      }));
    } catch (error) {
      console.error('Erreur suggestions API:', error);

      // 2. Fallback vers l'extraction du cache en cas d'erreur API
      const cachedSuggestions = cache.extractSuggestionsFromMarques(normalizedQuery);
      setSearchState(prev => ({
        ...prev,
        suggestions: cachedSuggestions,
        suggestionHighlighted: -1,
        showSuggestions: cachedSuggestions.length > 0
      }));
    }
  }, [cache, getDataService]);

  // ✅ Recherche principale avec cache intelligent
  const performSearchInternal = useCallback(async (query: string) => {
    setSearchState(prev => ({ ...prev, query }));

    if (!query.trim()) {
      // Recherche vide : charger événements par défaut
      try {
        const events = await loadEvents(10);
        setSearchState(prev => ({
          ...prev,
          results: events,
          marque: null,
          notFound: false,
          isSearching: false,
          hasPerformedSearch: false,
          showSuggestions: false
        }));
      } catch (error) {
        handleError(error, 'chargement des événements par défaut');
      }
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isSearching: true,
      notFound: false,
      showSuggestions: false // Masquer suggestions pendant recherche
    }));

    try {
      const dataService = await getDataService();
      const normalizedQuery = query.toLowerCase().trim();

      // Cache pour recherche
      const cacheKey = `search_${normalizedQuery}`;
      let cachedResults = cache.get(cacheKey);

      if (!cachedResults) {
        // Recherche marque exacte uniquement (pas de mot-clé)
        const filteredMarques = await dataService.getMarques(normalizedQuery, 1);

        // ✅ Stocker marques dans cache pour suggestions futures
        cache.set(`marques_${normalizedQuery}`, filteredMarques, 20 * 60 * 1000);

        let filteredEvents: Evenement[] = [];
        let marque: Marque | null = null;

        if (filteredMarques && filteredMarques.length > 0) {
          marque = filteredMarques[0];

          // Utiliser les événements déjà fournis par l'API marques (normalisés)
          filteredEvents = Array.isArray(marque.evenements) ? marque.evenements : [];
        }

        cachedResults = { filteredEvents, marque };
        cache.set(cacheKey, cachedResults, 10 * 60 * 1000); // 10min cache
      }

      const { filteredEvents, marque } = cachedResults;
      const hasResults = filteredEvents.length > 0 || marque?.total_beneficiaires_chaine > 0;

      setSearchState(prev => ({
        ...prev,
        results: filteredEvents,
        marque: marque,
        notFound: !hasResults,
        isSearching: false,
        loading: false,
        hasPerformedSearch: true
      }));
    } catch (error) {
      handleError(error, 'recherche principale');
    }
  }, [cache, getDataService, loadEvents, handleError]);

  // ✅ Navigation suggestions (logique from useSuggestions)
  const highlightSuggestion = useCallback((index: number) => {
    setSearchState(prev => ({
      ...prev,
      suggestionHighlighted: Math.max(-1, Math.min(index, prev.suggestions.length - 1))
    }));
  }, []);

  const selectSuggestion = useCallback((index: number): Marque | null => {
    if (index >= 0 && index < searchState.suggestions.length) {
      const selected = searchState.suggestions[index];
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        suggestionHighlighted: -1,
        showSuggestions: false
      }));
      return selected;
    }
    return null;
  }, [searchState.suggestions]);

  const hideSuggestions = useCallback(() => {
    setSearchState(prev => ({ ...prev, showSuggestions: false }));
  }, []);

  const showSuggestionsIfAvailable = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      showSuggestions: prev.suggestions.length > 0
    }));
  }, []);

  // ✅ Initialisation (from useSearch)
  useEffect(() => {
    const initializeSearch = async () => {
      const queryParam = searchParams.get('q');

      if (queryParam) {
        // URL avec paramètre → recherche automatique (pour partage/liens directs)
        setSearchState(prev => ({ ...prev, query: queryParam }));
        await performSearchInternal(queryParam);
      } else {
        // Pas de paramètre → charger événements par défaut
        try {
          const events = await loadEvents(10);
          setSearchState(prev => ({
            ...prev,
            results: events,
            marque: null,
            loading: false,
            hasPerformedSearch: false
          }));
        } catch (error) {
          handleError(error, 'initialisation');
        }
      }
    };

    initializeSearch();
  }, [searchParams, loadEvents, performSearchInternal, handleError]);

  // ✅ API publique unifiée
  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  }, []);

  const performSearch = useCallback(async (query: string) => {
    // Mettre à jour URL
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/recherche${newUrl}`, { scroll: false });

    await performSearchInternal(query);
  }, [router, performSearchInternal]);

  const clearSearch = useCallback(() => {
    router.push('/recherche', { scroll: false });
    setSearchState({
      query: '',
      isSearching: false,
      results: [],
      marque: null,
      notFound: false,
      loading: false,
      hasPerformedSearch: false,
      suggestions: [],
      suggestionHighlighted: -1,
      showSuggestions: false
    });
  }, [router]);

  return {
    // ✅ État unifié
    searchState,

    // ✅ API recherche (compatible useSearch)
    updateQuery,
    performSearch,
    clearSearch,

    // ✅ API suggestions (compatible useSuggestions)
    updateSuggestions,
    highlightSuggestion,
    selectSuggestion,
    hideSuggestions,
    showSuggestions: showSuggestionsIfAvailable,

    // ✅ API cache pour debug/metrics
    clearCache: () => cache.clear()
  };
}