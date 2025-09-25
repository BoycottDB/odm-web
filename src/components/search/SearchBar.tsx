'use client';

import { KeyboardEvent, ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Marque } from '@/types';

// Interface unifiée
interface UnifiedSuggestions {
  items: Marque[];
  highlighted: number;
  visible: boolean;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: UnifiedSuggestions;
  onSuggestionSelect: (marque: Marque) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
}

// Hook d'animation pour placeholder "tapé"
function useTypingPlaceholder(words: string[], enabled: boolean) {
  const [text, setText] = useState('');
  const timerRef = useRef<number | null>(null);
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const phaseRef = useRef<'typing' | 'pausingAfterType' | 'deleting' | 'pausingAfterDelete'>('typing');

  // Nettoyage timer
  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // En SSR: ne rien faire (barre vide)
    if (typeof window === 'undefined') return;

    // Reset à chaque (re)démarrage
    clearTimer();
    setText('');
    wordIndexRef.current = 0;
    charIndexRef.current = 0;
    phaseRef.current = 'typing';

    if (!enabled || words.length === 0) {
      return;
    }

    // Respecte prefers-reduced-motion: pas d'animation, affiche un exemple statique
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setText(words[0] ?? '');
      return;
    }

    const TYPE_MS = 90;
    const DELETE_MS = 55;
    const HOLD_AFTER_TYPE_MS = 1100;
    const HOLD_AFTER_DELETE_MS = 400;
    const INITIAL_DELAY_MS = 450; // démarre vide un court instant

    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const currentWord = words[wordIndexRef.current] ?? '';
      let delay = TYPE_MS;

      switch (phaseRef.current) {
        case 'typing': {
          if (charIndexRef.current < currentWord.length) {
            charIndexRef.current += 1;
            setText(currentWord.slice(0, charIndexRef.current));
            delay = TYPE_MS;
          } else {
            phaseRef.current = 'pausingAfterType';
            delay = HOLD_AFTER_TYPE_MS;
          }
          break;
        }
        case 'pausingAfterType': {
          phaseRef.current = 'deleting';
          delay = DELETE_MS;
          break;
        }
        case 'deleting': {
          if (charIndexRef.current > 0) {
            charIndexRef.current -= 1;
            setText(currentWord.slice(0, charIndexRef.current));
            delay = DELETE_MS;
          } else {
            phaseRef.current = 'pausingAfterDelete';
            delay = HOLD_AFTER_DELETE_MS;
          }
          break;
        }
        case 'pausingAfterDelete': {
          wordIndexRef.current = words.length > 0 ? (wordIndexRef.current + 1) % words.length : 0;
          phaseRef.current = 'typing';
          delay = TYPE_MS;
          break;
        }
      }

      timerRef.current = window.setTimeout(tick, delay);
    };

    timerRef.current = window.setTimeout(tick, INITIAL_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, words.join('|')]);

  return text;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  suggestions,
  onSuggestionSelect,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder = "Herta, Starbucks, Decathlon, Smartbox, L'Oréal, Nous Anti Gaspi, Vittel, La Laitière, Biscuits St Michel, Twitter, CANAL+"
}: SearchBarProps) {
  const [isFocusedLocal, setIsFocusedLocal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Liste des mots à "taper" extraite du placeholder (séparés par des virgules)
  const words = useMemo(() => {
    return placeholder
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);
  }, [placeholder]);

  // Animation active uniquement si l'input est vide et non focus
  const animationEnabled = value.length === 0 && !isFocusedLocal;
  const typedPlaceholder = useTypingPlaceholder(words, animationEnabled);
  const effectivePlaceholder = animationEnabled ? typedPlaceholder : placeholder;

  const handleFocusWrapped = () => {
    setIsFocusedLocal(true);
    onFocus();
  };

  const handleBlurWrapped = () => {
    setIsFocusedLocal(false);
    onBlur();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">
            Rechercher une marque
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onFocus={handleFocusWrapped}
            onBlur={handleBlurWrapped}
            placeholder={effectivePlaceholder}
            autoComplete="off"
            aria-label="Rechercher une marque"
            aria-autocomplete="list"
            aria-expanded={suggestions.visible && suggestions.items.length > 0}
            aria-owns={suggestions.visible && suggestions.items.length > 0 ? "search-suggestions" : undefined}
            className="w-full pl-12 pr-4 py-4 body-large font-bold border-2 border-primary-medium rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-medium transition-all duration-300 bg-white shadow-lg"
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.visible && suggestions.items.length > 0 && (
        <div 
          id="search-suggestions"
          role="listbox"
          className="absolute z-20 w-full mt-1 liquid-glass-dropdown border-2 border-accent-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
        >
          {suggestions.items.map((marque, index) => (
            <button
              key={marque.id}
              type="button"
              role="option"
              aria-selected={index === suggestions.highlighted}
              onMouseDown={() => onSuggestionSelect(marque)}
              className={`w-full px-4 py-3 text-left liquid-glass-suggestion transition-colors duration-200 ${
                index === suggestions.highlighted ? 'highlighted' : ''
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                index === suggestions.items.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <span className="body-large font-medium text-neutral-900">{marque.nom}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
