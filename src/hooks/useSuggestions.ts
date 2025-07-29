import { useState, useEffect, useCallback } from 'react';
import { Marque, SuggestionState } from '@/types';

export function useSuggestions() {
  const [allMarques, setAllMarques] = useState<Marque[]>([]);
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    items: [],
    highlighted: -1,
    visible: false
  });

  // Charger toutes les marques au démarrage
  useEffect(() => {
    const loadMarques = async () => {
      try {
        const response = await fetch('/api/marques', { cache: 'no-store' });
        const data: Marque[] = await response.json();
        setAllMarques(data);
      } catch (error) {
        console.error('Erreur lors du chargement des marques:', error);
      }
    };

    loadMarques();
  }, []);

  const updateSuggestions = useCallback((query: string) => {
    if (query.trim().length === 0) {
      setSuggestionState({
        items: [],
        highlighted: -1,
        visible: false
      });
      return;
    }

    const filtered = allMarques.filter((marque) =>
      marque.nom.toLowerCase().includes(query.trim().toLowerCase())
    );

    setSuggestionState({
      items: filtered,
      highlighted: -1,
      visible: filtered.length > 0
    });
  }, [allMarques]);

  const highlightSuggestion = useCallback((index: number) => {
    setSuggestionState(prev => ({
      ...prev,
      highlighted: Math.max(-1, Math.min(index, prev.items.length - 1))
    }));
  }, []);

  const selectSuggestion = useCallback((index: number): Marque | null => {
    if (index >= 0 && index < suggestionState.items.length) {
      const selected = suggestionState.items[index];
      setSuggestionState({
        items: [],
        highlighted: -1,
        visible: false
      });
      return selected;
    }
    return null;
  }, [suggestionState.items]);

  const hideSuggestions = useCallback(() => {
    setSuggestionState(prev => ({ ...prev, visible: false }));
  }, []);

  const showSuggestions = useCallback(() => {
    setSuggestionState(prev => ({ 
      ...prev, 
      visible: prev.items.length > 0 
    }));
  }, []);

  return {
    suggestionState,
    updateSuggestions,
    highlightSuggestion,
    selectSuggestion,
    hideSuggestions,
    showSuggestions,
    allMarques
  };
}
