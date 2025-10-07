'use client';

import { useState, useEffect, KeyboardEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { dataService } from '@/lib/services/dataService';
import { slugify } from '@/lib/slug';
import { safeTrack } from '@/lib/analytics';

interface MarqueSuggestion {
  id: number;
  nom: string;
}

interface SearchHeroProps {
  placeholder?: string;
  source?: 'marques_list' | 'marque_detail';
}

export function SearchHero({ placeholder, source = 'marques_list' }: SearchHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MarqueSuggestion[]>([]);
  const [suggestionHighlighted, setSuggestionHighlighted] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mise à jour des suggestions avec debounce + AbortController
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const results = await dataService.getSuggestions(query, 10);
        // Vérifier si la requête n'a pas été annulée
        if (!abortController.signal.aborted) {
          setSuggestions(results);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Erreur chargement suggestions:', error);
          setSuggestions([]);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSuggestionHighlighted(-1);
  };

  const handleSuggestionSelect = useCallback((marque: MarqueSuggestion) => {
    const slug = slugify(marque.nom);
    setShowSuggestions(false);

    // Analytics
    safeTrack('search', {
      query: marque.nom,
      has_results: true,
      marque_id: marque.id,
      source
    });

    // Poser flag pour scroll après navigation
    sessionStorage.setItem('scrollToResults', 'true');

    router.push(`/marques/${slug}`);
  }, [router, source]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);

    // Recherche dans toutes les marques disponibles via l'API
    try {
      const normalizedQuery = searchQuery.toLowerCase().trim();

      // Chercher d'abord dans les suggestions déjà chargées
      let exactMatch = suggestions.find(m => m.nom.toLowerCase() === normalizedQuery);

      // Si pas trouvé dans suggestions, rechercher via l'API
      if (!exactMatch) {
        const results = await dataService.getSuggestions(normalizedQuery, 1);
        if (results.length > 0 && results[0].nom.toLowerCase() === normalizedQuery) {
          exactMatch = results[0];
        }
      }

      if (exactMatch) {
        const slug = slugify(exactMatch.nom);

        // Analytics
        safeTrack('search', {
          query: searchQuery,
          has_results: true,
          marque_id: exactMatch.id,
          source
        });

        // Poser flag pour scroll après navigation
        sessionStorage.setItem('scrollToResults', 'true');

        router.push(`/marques/${slug}`);
      } else {
        // Pas de correspondance exacte → redirection vers /marques?search=
        safeTrack('search', {
          query: searchQuery,
          has_results: false,
          marque_id: null,
          source
        });

        // Poser flag pour scroll vers liste après redirection
        sessionStorage.setItem('scrollToList', 'true');

        router.push(`/marques?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);

      // En cas d'erreur, redirection vers /marques?search=
      sessionStorage.setItem('scrollToList', 'true');
      router.push(`/marques?search=${encodeURIComponent(searchQuery)}`);
    }
  }, [suggestions, router, source]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (suggestions.length > 0) {
          e.preventDefault();
          setSuggestionHighlighted(prev =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        if (suggestions.length > 0) {
          e.preventDefault();
          setSuggestionHighlighted(prev => prev > 0 ? prev - 1 : -1);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestionHighlighted >= 0 && suggestions[suggestionHighlighted]) {
          handleSuggestionSelect(suggestions[suggestionHighlighted]);
        } else {
          // Permet de valider une recherche même sans suggestion exacte
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <SearchBar
      value={query}
      onChange={handleQueryChange}
      onSearch={handleSearch}
      suggestions={{
        items: suggestions,
        highlighted: suggestionHighlighted,
        visible: showSuggestions
      }}
      onSuggestionSelect={handleSuggestionSelect}
      onKeyDown={handleKeyDown}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      placeholder={placeholder}
    />
  );
}
