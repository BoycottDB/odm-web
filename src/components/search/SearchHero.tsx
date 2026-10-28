'use client';

import { useState, useMemo, KeyboardEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { dataService } from '@/lib/services/dataService';
import { slugify } from '@/lib/slug';
import { demarrerNavigation } from '@/components/ui/BarreProgression';
import { safeTrack } from '@/lib/analytics';
import { Suggestion, construireSuggestions, filtrerSuggestions, suggestionExacte } from '@/lib/rechercheMarques';

// Noms des marques et des bénéficiaires, chargés une seule fois par visite (partagés entre les barres)
let nomsEnCours: Promise<Suggestion[]> | null = null;
const chargerNoms = () => {
  nomsEnCours ??= Promise.all([
    dataService.getMarquesNoms(),
    dataService.getBeneficiairesNoms(),
  ]).then(([marques, beneficiaires]) => construireSuggestions(marques, beneficiaires)).catch((error) => {
    nomsEnCours = null; // un échec sera retenté au prochain focus
    throw error;
  });
  return nomsEnCours;
};

interface SearchHeroProps {
  source?: 'marques_list' | 'marque_detail' | 'recherche';
}

export function SearchHero({ source = 'marques_list' }: SearchHeroProps) {
  const router = useRouter();
  const naviguer = useCallback((href: string) => {
    demarrerNavigation(href);
    router.push(href);
  }, [router]);
  const [query, setQuery] = useState('');
  const [noms, setNoms] = useState<Suggestion[]>([]);
  const [suggestionHighlighted, setSuggestionHighlighted] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtrage sur place, sans appel réseau à chaque frappe
  const suggestions = useMemo(() => filtrerSuggestions(noms, query), [noms, query]);

  const handleFocus = useCallback(() => {
    setShowSuggestions(true);
    chargerNoms()
      .then(setNoms)
      .catch((error) => console.error('Erreur chargement des noms:', error));
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSuggestionHighlighted(-1);
  };

  // Marque ou autre nom → sa page (celle de la marque, vue depuis l'autre nom) ; bénéficiaire → liste des marques filtrée sur lui
  const ouvrirSuggestion = useCallback((suggestion: Suggestion, query: string) => {
    if (suggestion.type === 'marque') {
      safeTrack('search', { query, has_results: true, result: suggestion.nom, result_type: 'marque', source });
      naviguer(`/marques/${slugify(suggestion.nom)}`);
    } else {
      safeTrack('search', { query, has_results: true, result: suggestion.nom, result_type: 'beneficiaire', source });
      sessionStorage.setItem('scrollToList', 'true');
      naviguer(`/marques?beneficiaire=${suggestion.id}`);
    }
  }, [naviguer, source]);

  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    setShowSuggestions(false);
    ouvrirSuggestion(suggestion, suggestion.nom);
  }, [ouvrirSuggestion]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);

    // Recherche dans les marques et bénéficiaires (liste déjà chargée au focus, sinon chargée ici)
    try {
      const tousLesNoms = await chargerNoms();
      const exactMatch = suggestionExacte(tousLesNoms, searchQuery);

      if (exactMatch) {
        ouvrirSuggestion(exactMatch, searchQuery);
        return;
      }

      safeTrack('search', {
        query: searchQuery,
        has_results: false,
        source
      });

      // La liste /marques ne filtre que sur le nom principal : un autre nom partiel passe par /recherche
      if (filtrerSuggestions(tousLesNoms, searchQuery).some((suggestion) => suggestion.type === 'marque' && suggestion.nom === suggestion.nomMarque)) {
        // Marques dont le nom contient la saisie → liste filtrée, avec scroll vers la liste après redirection
        sessionStorage.setItem('scrollToList', 'true');
        naviguer(`/marques?search=${encodeURIComponent(searchQuery)}`);
      } else {
        // Aucune correspondance → page qui reprend la saisie et invite à contribuer
        naviguer(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);

      // En cas d'erreur, redirection vers /marques?search=
      sessionStorage.setItem('scrollToList', 'true');
      naviguer(`/marques?search=${encodeURIComponent(searchQuery)}`);
    }
  }, [naviguer, source, ouvrirSuggestion]);

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
