'use client';

import { useState, useMemo, KeyboardEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { dataService } from '@/lib/services/dataService';
import { slugify } from '@/lib/slug';
import { safeTrack } from '@/lib/analytics';
import { MarqueNom, filtrerMarques, marqueExacte } from '@/lib/rechercheMarques';

// Noms de toutes les marques, chargés une seule fois par visite (partagés entre les barres)
let nomsEnCours: Promise<MarqueNom[]> | null = null;
const chargerNomsMarques = () => {
  nomsEnCours ??= dataService.getMarquesNoms().catch((error) => {
    nomsEnCours = null; // un échec sera retenté au prochain focus
    throw error;
  });
  return nomsEnCours;
};

interface SearchHeroProps {
  source?: 'marques_list' | 'marque_detail';
}

export function SearchHero({ source = 'marques_list' }: SearchHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [marques, setMarques] = useState<MarqueNom[]>([]);
  const [suggestionHighlighted, setSuggestionHighlighted] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrage sur place, sans appel réseau à chaque frappe
  const suggestions = useMemo(() => filtrerMarques(marques, query), [marques, query]);

  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
    chargerNomsMarques()
      .then(setMarques)
      .catch((error) => console.error('Erreur chargement des marques:', error));
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSuggestionHighlighted(-1);
  };

  const handleSuggestionSelect = useCallback((marque: MarqueNom) => {
    const slug = slugify(marque.nom);
    setShowSuggestions(false);

    // Analytics
    safeTrack('search', {
      query: marque.nom,
      has_results: true,
      marque_id: marque.id,
      source
    });

    router.push(`/marques/${slug}`);
  }, [router, source]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);

    // Recherche dans toutes les marques (liste déjà chargée au focus, sinon chargée ici)
    try {
      const exactMatch = marqueExacte(await chargerNomsMarques(), searchQuery);

      if (exactMatch) {
        const slug = slugify(exactMatch.nom);

        // Analytics
        safeTrack('search', {
          query: searchQuery,
          has_results: true,
          marque_id: exactMatch.id,
          source
        });

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
  }, [router, source]);

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
      onFocus={handleFocus}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
    />
  );
}
