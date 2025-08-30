import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Evenement, SearchState, Marque, BeneficiaireResult, TypeBeneficiaire, BeneficiaireComplet } from '@/types';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isSearching: false,
    results: [],
    beneficiaireResults: [],
    notFound: false,
    loading: true,
    hasPerformedSearch: false
  });

  // Fonction helper pour charger les événements (sans dirigeants pour l'affichage initial)
  const loadEvents = useCallback(async (limit: number = 10) => {
    try {
      // Utiliser dataService pour cohérence architecturale
      const { dataService } = await import('@/lib/services/dataService');
      const allEvenements = await dataService.getEvenements();
      return allEvenements.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      throw error;
    }
  }, []);

  // Fonction interne pour effectuer la recherche sans mettre à jour l'URL
  const performSearchInternal = useCallback(async (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    if (!query.trim()) {
      // Si la recherche est vide, recharger les événements initiaux
      try {
        const events = await loadEvents(10);
        setSearchState(prev => ({
          ...prev,
          results: events,
          beneficiaireResults: [],
          notFound: false,
          isSearching: false,
          hasPerformedSearch: false
        }));
      } catch (error) {
        setSearchState(prev => ({
          ...prev,
          results: [],
          beneficiaireResults: [],
          notFound: true,
          isSearching: false,
          hasPerformedSearch: false
        }));
      }
      return;
    }

    setSearchState(prev => ({ ...prev, isSearching: true, notFound: false }));

    try {
      // Utiliser dataService pour cohérence architecturale
      const { dataService } = await import('@/lib/services/dataService');
      const [allEvenements, allMarques] = await Promise.all([
        dataService.getEvenements(),
        dataService.getMarques()
      ]);
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Filtrer les événements existants et enrichir avec les données complètes des marques
      const filteredEvents = allEvenements.filter(event =>
        event.marque?.nom.toLowerCase().includes(normalizedQuery) ||
        event.titre.toLowerCase().includes(normalizedQuery) ||
        event.categorie?.nom.toLowerCase().includes(normalizedQuery)
      ).map(event => {
        // Trouver la marque complète correspondante dans allMarques
        const marqueComplete = allMarques.find(m => m.id === event.marque?.id);
        return {
          ...event,
          marque: marqueComplete || event.marque
        };
      });
      
      // Trouver les marques avec bénéficiaires controversés qui correspondent à la recherche
      const marquesWithBeneficiaires = allMarques.filter((marque: Marque) => 
        marque.nom.toLowerCase().includes(normalizedQuery) &&
        marque.beneficiaires_marque && marque.beneficiaires_marque.length > 0
      );
      
      // Créer des résultats spécifiques pour les bénéficiaires
      const beneficiaireResults: BeneficiaireResult[] = [];
      
      marquesWithBeneficiaires.forEach((marque: Marque) => {
        if (marque.beneficiaires_marque) {
          marque.beneficiaires_marque.forEach((liaison) => {
            if (liaison.beneficiaire) {
              beneficiaireResults.push({
                id: `beneficiaire-${liaison.id}`,
                type: 'beneficiaire' as const,
                marque: marque,
                beneficiaire: {
                  id: liaison.beneficiaire.id,
                  nom: liaison.beneficiaire.nom,
                  controverses: liaison.beneficiaire.controverses || [],
                  lien_financier: liaison.lien_financier,
                  impact_description: liaison.impact_specifique || liaison.beneficiaire.impact_generique || 'Impact à définir',
                  marque_id: marque.id,
                  marque_nom: marque.nom,
                  liaison_id: liaison.id,
                  type_beneficiaire: liaison.beneficiaire.type_beneficiaire as TypeBeneficiaire,
                  source_lien: liaison.source_lien || 'direct',
                  toutes_marques: liaison.beneficiaire.toutes_marques || [{ id: marque.id, nom: marque.nom }],
                  marques_directes: liaison.beneficiaire.marques_directes || [],
                  marques_indirectes: liaison.beneficiaire.marques_indirectes || {},
                  beneficiaire_parent_nom: liaison.beneficiaire_parent_nom
                } as BeneficiaireComplet
              });
            }
          });
        }
      });
      

      const hasResults = filteredEvents.length > 0 || beneficiaireResults.length > 0;

      setSearchState(prev => ({
        ...prev,
        results: filteredEvents,
        beneficiaireResults: beneficiaireResults,
        notFound: !hasResults,
        isSearching: false,
        loading: false,
        hasPerformedSearch: true
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        notFound: true,
        loading: false,
        results: [],
        beneficiaireResults: [],
        hasPerformedSearch: true
      }));
    }
  }, [loadEvents]);

  // Charger les événements au démarrage et gérer les paramètres URL
  useEffect(() => {
    const initializeSearch = async () => {
      const queryParam = searchParams.get('q');
      
      if (queryParam) {
        // Si il y a un paramètre de recherche, effectuer la recherche
        setSearchState(prev => ({ ...prev, query: queryParam }));
        await performSearchInternal(queryParam);
      } else {
        // Sinon, charger les événements par défaut
        try {
          const events = await loadEvents(10);
          setSearchState(prev => ({
            ...prev,
            results: events,
            beneficiaireResults: [],
            loading: false,
            hasPerformedSearch: false
          }));
        } catch (error) {
          setSearchState(prev => ({
            ...prev,
            loading: false,
            notFound: true,
            beneficiaireResults: [],
            hasPerformedSearch: false
          }));
        }
      }
    };

    initializeSearch();
  }, [searchParams, loadEvents, performSearchInternal]);

  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  }, []);

  // Fonction publique pour effectuer la recherche et mettre à jour l'URL
  const performSearch = useCallback(async (query: string) => {
    // Mettre à jour l'URL
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/recherche${newUrl}`, { scroll: false });
    
    // Effectuer la recherche
    await performSearchInternal(query);
  }, [router, performSearchInternal]);

  const clearSearch = useCallback(() => {
    // Réinitialiser l'URL
    router.push('/recherche', { scroll: false });
    
    setSearchState({
      query: '',
      isSearching: false,
      results: [],
      beneficiaireResults: [],
      notFound: false,
      loading: false,
      hasPerformedSearch: false
    });
  }, [router]);

  // Fonction pour scroller vers les résultats quand une recherche a des résultats
  const scrollToResults = useCallback(() => {
    // Détection mobile vs desktop basée sur la largeur d'écran
    const isMobile = window.innerWidth < 768; // breakpoint md de Tailwind
    const scrollPosition = isMobile ? 320 : 423; // Valeurs différentes mobile/desktop
    
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }, []);

  return {
    searchState,
    updateQuery,
    performSearch,
    clearSearch,
    scrollToResults
  };
}
