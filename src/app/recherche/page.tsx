"use client";
import { KeyboardEvent, Suspense, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useStickySearchBar } from '@/hooks/useStickySearchBar';
import { useHeaderSearch } from '@/contexts/HeaderSearchContext';
import { SearchBar } from '@/components/search/SearchBar';
import { EventList } from '@/components/events/EventList';
import { AddToHomeScreenBanner } from '@/components/ui/AddToHomeScreenBanner';
import { Marque } from '@/types';

function SearchPageContent() {
  const { searchState, updateQuery, performSearch, scrollToResults } = useSearch();
  const {
    suggestionState,
    updateSuggestions,
    highlightSuggestion,
    selectSuggestion,
    hideSuggestions,
    showSuggestions
  } = useSuggestions();
  const { originalSearchBarRef } = useStickySearchBar();
  const { setSearchProps } = useHeaderSearch();

  // Synchroniser les suggestions avec la recherche
  const handleSearchChange = useCallback((value: string) => {
    updateQuery(value);
    updateSuggestions(value);
  }, [updateQuery, updateSuggestions]);

  // Gestion de la sélection de suggestion
  const handleSuggestionSelect = useCallback((marque: Marque) => {
    updateQuery(marque.nom);
    hideSuggestions();
    performSearch(marque.nom);
  }, [updateQuery, hideSuggestions, performSearch]);

  // Navigation clavier dans les suggestions
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestionState.items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlightSuggestion(suggestionState.highlighted + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        highlightSuggestion(suggestionState.highlighted - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (suggestionState.highlighted >= 0) {
          const selected = selectSuggestion(suggestionState.highlighted);
          if (selected) {
            updateQuery(selected.nom);
            performSearch(selected.nom);
          }
        } else {
          performSearch(searchState.query);
        }
        break;
      case "Escape":
        hideSuggestions();
        break;
    }
  }, [suggestionState.items.length, suggestionState.highlighted, highlightSuggestion, selectSuggestion, updateQuery, performSearch, searchState.query, hideSuggestions]);

  // Gestion de la recherche
  const handleSearch = useCallback((query: string) => {
    performSearch(query);
    hideSuggestions();
  }, [performSearch, hideSuggestions]);

  // Une recherche a été effectuée si elle a été effectivement exécutée
  // (pas seulement quand on tape dans la barre de recherche)
  const hasSearched = searchState.hasPerformedSearch;

  // Synchroniser les props de recherche avec le header
  useEffect(() => {
    setSearchProps({
      value: searchState.query,
      onChange: handleSearchChange,
      onSearch: handleSearch,
      suggestions: suggestionState,
      onSuggestionSelect: handleSuggestionSelect,
      onKeyDown: handleKeyDown,
      onFocus: showSuggestions,
      onBlur: hideSuggestions,
    });
  }, [searchState.query, suggestionState, handleSearchChange, handleSearch, handleSuggestionSelect, handleKeyDown, showSuggestions, hideSuggestions, setSearchProps]);

  // Scroller vers les résultats quand on a des résultats et qu'une recherche a été effectuée
  useEffect(() => {
    if (searchState.hasPerformedSearch && 
        !searchState.isSearching && 
        !searchState.loading &&
        searchState.query.trim() &&
        (searchState.results.length > 0 || searchState.beneficiaireResults.length > 0)) {
      scrollToResults();
    }
  }, [searchState.hasPerformedSearch, searchState.isSearching, searchState.loading, searchState.query, searchState.results.length, searchState.beneficiaireResults.length, scrollToResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-light">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            Rechercher une marque
          </h1>
          <p className="heading-sub font-light text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explorez notre base de données collaborative de controverses et bénéficiaires controversés.
          </p>

          {/* Barre de recherche */}
          <div ref={originalSearchBarRef}>
            <SearchBar
              value={searchState.query}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              suggestions={suggestionState}
              onSuggestionSelect={handleSuggestionSelect}
              onKeyDown={handleKeyDown}
              onFocus={showSuggestions}
              onBlur={hideSuggestions}
            />
          </div>
          
          {/* Lien vers la liste des marques */}
          <div className="mt-4 relative w-full max-w-2xl mx-auto flex justify-end">
            <Link 
              href="/marques" 
              className="body-base align-right text-berry-600 underline hover:text-berry-700 transition-colors duration-200"
            >
              <strong>Consulter toutes les marques &gt;</strong>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Résultats */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-light">
        <div className="max-w-6xl mx-auto px-6">
          <EventList
            events={searchState.results}
            beneficiaireResults={searchState.beneficiaireResults}
            loading={searchState.loading}
            searching={searchState.isSearching}
            notFound={searchState.notFound}
            hasSearched={hasSearched}
          />
        </div>
      </section>

      {/* Composant mobile pour l'ajout à l'écran d'accueil */}
      <AddToHomeScreenBanner />
    </div>
  );
}

export default function RechercherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white to-primary-light flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Chargement...</p>
      </div>
    </div>}>
      <SearchPageContent />
    </Suspense>
  );
}