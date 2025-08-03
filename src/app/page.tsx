"use client";
import { KeyboardEvent } from "react";
import { useSearch } from '@/hooks/useSearch';
import { useSuggestions } from '@/hooks/useSuggestions';
import { SearchBar } from '@/components/search/SearchBar';
import { EventList } from '@/components/events/EventList';
import { APP_CONFIG } from '@/lib/utils/constants';
import { Marque } from '@/types';

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-white to-berry-50">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-berry-50 via-purple-50 to-indigo-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            L&apos;Observatoire des Marques
          </h1>
          <p className="text-xl font-light text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Une plateforme collaborative et transparente pour documenter les controverses des marques et encourager une consommation éthique et responsable.
          </p>
          
          {/* Encadré informatif */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-3xl mx-auto border border-berry-100 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-berry-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-berry-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-base font-light text-gray-700 mb-4 text-center">
              Ce projet est <strong>open source</strong> et <strong>non lucratif</strong>. Notre objectif est de fournir des informations factuelles et vérifiées pour aider les consommateurs à faire des choix éclairés.
            </p>
            <div className="text-center">
              <a
                href={APP_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-berry-500 to-berry-500 text-white font-medium rounded-full hover:from-berry-600 hover:to-berry-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Contribuer sur GitHub
              </a>
            </div>
          </div>

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
      <section className="py-16 bg-gradient-to-b from-white to-berry-50">
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
    </div>
  );
}
