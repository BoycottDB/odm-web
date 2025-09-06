"use client";
import { KeyboardEvent, Suspense, useRef, useEffect } from "react";
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SearchBar } from '@/components/search/SearchBar';
import { EventList } from '@/components/events/EventList';
import { AddToHomeScreenBanner } from '@/components/ui/AddToHomeScreenBanner';
import { Marque } from '@/types';

function SearchPageContent() {
  const { searchState, updateQuery, performSearch } = useSearch();
  const {
    suggestionState,
    updateSuggestions,
    highlightSuggestion,
    selectSuggestion,
    hideSuggestions,
    showSuggestions
  } = useSuggestions();
  
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers la barre de recherche quand les résultats apparaissent
  useEffect(() => {
    if (searchState.hasPerformedSearch && searchBarRef.current) {
      const searchBarElement = searchBarRef.current;
      const offset = 20; // Quelques pixels au-dessus
      const elementTop = searchBarElement.offsetTop - offset;
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }, [searchState.hasPerformedSearch]);

  // Synchroniser les suggestions avec la recherche
  const handleSearchChange = (value: string) => {
    updateQuery(value);
    updateSuggestions(value);
  };

  // Gestion de la sélection de suggestion
  const handleSuggestionSelect = (marque: Marque) => {
    updateQuery(marque.nom);
    hideSuggestions();
    performSearch(marque.nom);
  };

  // Navigation clavier dans les suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
  };

  // Gestion de la recherche
  const handleSearch = (query: string) => {
    performSearch(query);
    hideSuggestions();
  };

  // Une recherche a été effectuée si elle a été effectivement exécutée
  // (pas seulement quand on tape dans la barre de recherche)
  const hasSearched = searchState.hasPerformedSearch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-50">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-primary-50 via-violet-magenta-50 to-lavande-50 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            Rechercher une marque
          </h1>
          <p className="heading-sub font-light text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explorez notre base de données collaborative de controverses et bénéficiaires controversés.
          </p>

          {/* Barre de recherche */}
          <div ref={searchBarRef}>
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
              className="body-base align-right text-primary-500 underline hover:text-primary-600 transition-colors duration-200"
            >
              <strong>Consulter toutes les marques &gt;</strong>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Résultats */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
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
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white to-primary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Chargement...</p>
      </div>
    </div>}>
      <SearchPageContent />
    </Suspense>
  );
}