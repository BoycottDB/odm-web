"use client";
import { KeyboardEvent } from "react";
import { useSearch } from '@/hooks/useSearch';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SearchBar } from '@/components/search/SearchBar';
import { EventList } from '@/components/events/EventList';
import { AddToHomeScreenBanner } from '@/components/ui/AddToHomeScreenBanner';
import { Marque } from '@/types';

export default function RechercherPage() {
  const { searchState, updateQuery, performSearch } = useSearch();
  const {
    suggestionState,
    updateSuggestions,
    highlightSuggestion,
    selectSuggestion,
    hideSuggestions,
    showSuggestions
  } = useSuggestions();

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

  // Au démarrage, on considère qu'une "recherche" a été effectuée (chargement initial)
  // Sinon, on vérifie si l'utilisateur a tapé quelque chose
  const hasSearched = searchState.query.length > 0 || (!searchState.loading && searchState.results.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-light">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            Rechercher une marque
          </h1>
          <p className="heading-sub font-light text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explorez notre base de données collaborative de controverses et dirigeants controversés.
          </p>

          {/* Barre de recherche */}
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
      </section>

      {/* Section Résultats */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-light">
        <div className="max-w-6xl mx-auto px-6">
          <EventList
            events={searchState.results}
            dirigeantResults={searchState.dirigeantResults}
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