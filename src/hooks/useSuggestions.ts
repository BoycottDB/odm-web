import { useState, useCallback } from 'react';
import { Marque, SuggestionState } from '@/types';

export function useSuggestions() {
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    items: [],
    highlighted: -1,
    visible: false
  });

  const updateSuggestions = useCallback((query: string) => {
    if (query.trim().length === 0) {
      setSuggestionState({
        items: [],
        highlighted: -1,
        visible: false
      });
      return;
    }

    
    (async () => {
      try {
        // Délégation à l'API suggestions ultra-rapide
        const { dataService } = await import('@/lib/services/dataService');
        const suggestions = await dataService.getSuggestions(query.trim(), 10);

        // Convertir format minimal vers format Marque pour compatibilité
        const marques: Marque[] = suggestions.map(s => ({
          id: s.id,
          nom: s.nom,
          // Propriétés minimales pour compatibilité (ne seront pas utilisées dans suggestions)
          secteur_marque_id: undefined,
          message_boycott_tips: undefined,
          beneficiaires_marque: []
        }));

        setSuggestionState({
          items: marques,
          highlighted: -1,
          visible: marques.length > 0
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
        setSuggestionState({
          items: [],
          highlighted: -1,
          visible: false
        });
      }
    })();
  }, []);

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
    showSuggestions
  };
}
