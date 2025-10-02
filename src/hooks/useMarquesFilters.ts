import { useReducer, useCallback, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarqueStats } from '@/types';

export type SortField = 'nom' | 'evenements' | 'beneficiaires' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface MarquesFiltersState {
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  beneficiaireFilter: number | null;
  secteurFilter: number | null;
}

export interface FilterOptions {
  beneficiaires: Array<{ id: number; nom: string; count: number }>;
  secteurs: Array<{ id: number; nom: string; count: number }>;
}

// Actions pour le reducer
type FilterAction =
  | { type: 'UPDATE_SEARCH'; payload: string }
  | { type: 'UPDATE_SORT'; payload: { field: SortField; order: SortOrder } }
  | { type: 'UPDATE_BENEFICIAIRE'; payload: number | null }
  | { type: 'UPDATE_SECTEUR'; payload: number | null }
  | { type: 'RESET_FILTERS' };

// Reducer pour gestion d'état optimisée
function filtersReducer(state: MarquesFiltersState, action: FilterAction): MarquesFiltersState {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'UPDATE_SORT':
      return { ...state, sortField: action.payload.field, sortOrder: action.payload.order };
    case 'UPDATE_BENEFICIAIRE':
      return { ...state, beneficiaireFilter: action.payload };
    case 'UPDATE_SECTEUR':
      return { ...state, secteurFilter: action.payload };
    case 'RESET_FILTERS':
      return {
        searchQuery: '',
        sortField: 'nom',
        sortOrder: 'asc',
        beneficiaireFilter: null,
        secteurFilter: null
      };
    default:
      return state;
  }
}

export function useMarquesFilters(initialMarques: MarqueStats[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Refs pour debouncing
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const urlDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // État initial depuis URL
  const initialState: MarquesFiltersState = useMemo(() => ({
    searchQuery: searchParams.get('search') || '',
    sortField: (searchParams.get('sort') as SortField) || 'nom',
    sortOrder: (searchParams.get('order') as SortOrder) || 'asc',
    beneficiaireFilter: searchParams.get('beneficiaire') ? parseInt(searchParams.get('beneficiaire')!) : null,
    secteurFilter: searchParams.get('secteur') ? parseInt(searchParams.get('secteur')!) : null
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filters, dispatch] = useReducer(filtersReducer, initialState);

  const filterOptions = useMemo<FilterOptions>(() => {
    const beneficiairesMap = new Map<number, { nom: string; count: number }>();
    const secteursMap = new Map<number, { nom: string; count: number }>();

    initialMarques.forEach(marque => {
      marque.beneficiairesControverses?.forEach(b => {
        if (b && typeof b === 'object' && b.id && b.nom) {
          const existing = beneficiairesMap.get(b.id);
          if (existing) {
            existing.count++;
          } else {
            beneficiairesMap.set(b.id, { nom: b.nom, count: 1 });
          }
        }
      });
      if (marque.secteur && typeof marque.secteur === 'object' && marque.secteur.id && marque.secteur.nom) {
        const existing = secteursMap.get(marque.secteur.id);
        if (existing) {
          existing.count++;
        } else {
          secteursMap.set(marque.secteur.id, { nom: marque.secteur.nom, count: 1 });
        }
      }
    });

    return {
      beneficiaires: Array.from(beneficiairesMap.entries())
        .map(([id, data]) => ({ id, nom: data.nom, count: data.count }))
        .sort((a, b) => a.nom.localeCompare(b.nom, 'fr')),
      secteurs: Array.from(secteursMap.entries())
        .map(([id, data]) => ({ id, nom: data.nom, count: data.count }))
        .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    };
  }, [initialMarques]);

  // Index pour recherche optimisée O(1)
  const searchIndex = useMemo(() => {
    const index = new Map<number, string>();
    initialMarques.forEach(m => {
      index.set(m.id, m.nom.toLowerCase());
    });
    return index;
  }, [initialMarques]);

  // Marques filtrées et triées (optimisé)
  const filteredMarques = useMemo(() => {
    let result = initialMarques;

    // Filtre recherche avec index
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(m => searchIndex.get(m.id)?.includes(query));
    }

    // Filtre bénéficiaire
    if (filters.beneficiaireFilter) {
      result = result.filter(m =>
        m.beneficiairesControverses?.some(b => b.id === filters.beneficiaireFilter)
      );
    }

    if (filters.secteurFilter) {
      result = result.filter(m =>
        m.secteur && typeof m.secteur === 'object' && m.secteur.id === filters.secteurFilter
      );
    }

    // Filtre "avec bénéficiaires uniquement" automatique si tri par bénéficiaires
    if (filters.sortField === 'beneficiaires') {
      result = result.filter(m => (m.nbBeneficiairesControverses || 0) > 0);
    }

    // Tri optimisé (shallow copy uniquement si nécessaire)
    if (filters.sortField !== 'nom' || filters.sortOrder !== 'asc') {
      result = [...result].sort((a, b) => {
        let comparison = 0;

        switch (filters.sortField) {
          case 'nom':
            comparison = a.nom.localeCompare(b.nom, 'fr');
            break;
          case 'evenements':
            comparison = (a.nbControverses || 0) - (b.nbControverses || 0);
            break;
          case 'beneficiaires':
            comparison = (a.nbBeneficiairesControverses || 0) - (b.nbBeneficiairesControverses || 0);
            break;
          case 'updated_at':
            comparison = new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime();
            break;
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [initialMarques, filters, searchIndex]);

  // Mise à jour URL avec debouncing (500ms)
  const updateURL = useCallback((newFilters: MarquesFiltersState) => {
    // Clear previous timeout
    if (urlDebounceRef.current) {
      clearTimeout(urlDebounceRef.current);
    }

    // Debounce URL updates
    urlDebounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      if (newFilters.searchQuery) params.set('search', newFilters.searchQuery);
      if (newFilters.sortField !== 'nom') params.set('sort', newFilters.sortField);
      if (newFilters.sortOrder !== 'asc') params.set('order', newFilters.sortOrder);
      if (newFilters.beneficiaireFilter) params.set('beneficiaire', newFilters.beneficiaireFilter.toString());
      if (newFilters.secteurFilter) params.set('secteur', newFilters.secteurFilter.toString());

      const newUrl = params.toString() ? `/marques?${params.toString()}` : '/marques';
      router.replace(newUrl, { scroll: false });
    }, 500);
  }, [router]);

  // Sync URL après changements de filtres
  useEffect(() => {
    updateURL(filters);
  }, [filters, updateURL]);

  // Actions optimisées (pas de dépendance à filters)
  const updateSearchQuery = useCallback((query: string) => {
    // Debounce search pour éviter trop de re-renders
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      dispatch({ type: 'UPDATE_SEARCH', payload: query });
    }, 300);
  }, []);

  const updateSearchQueryImmediate = useCallback((query: string) => {
    // Version immédiate pour l'input (pas de debounce visuel)
    dispatch({ type: 'UPDATE_SEARCH', payload: query });
  }, []);

  const updateSort = useCallback((field: SortField, order: SortOrder) => {
    dispatch({ type: 'UPDATE_SORT', payload: { field, order } });
  }, []);

  const updateBeneficiaireFilter = useCallback((beneficiaire: number | null) => {
    dispatch({ type: 'UPDATE_BENEFICIAIRE', payload: beneficiaire });
  }, []);

  const updateSecteurFilter = useCallback((secteur: number | null) => {
    dispatch({ type: 'UPDATE_SECTEUR', payload: secteur });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
    router.push('/marques', { scroll: false });
  }, [router]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    };
  }, []);

  // Statistiques
  const stats = useMemo(() => ({
    total: initialMarques.length,
    filtered: filteredMarques.length,
    hasActiveFilters:
      filters.searchQuery !== '' ||
      filters.beneficiaireFilter !== null ||
      filters.secteurFilter !== null ||
      filters.sortField !== 'nom' ||
      filters.sortOrder !== 'asc'
  }), [initialMarques.length, filteredMarques.length, filters]);

  return {
    filters,
    filterOptions,
    filteredMarques,
    stats,
    updateSearchQuery,
    updateSearchQueryImmediate,
    updateSort,
    updateBeneficiaireFilter,
    updateSecteurFilter,
    resetFilters
  };
}
