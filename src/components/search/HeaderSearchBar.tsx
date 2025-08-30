import { KeyboardEvent, ChangeEvent } from 'react';
import { Marque, SuggestionState } from '@/types';

interface HeaderSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SuggestionState;
  onSuggestionSelect: (marque: Marque) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function HeaderSearchBar({
  value,
  onChange,
  onSearch,
  suggestions,
  onSuggestionSelect,
  onKeyDown,
  onFocus,
  onBlur
}: HeaderSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative mx-4 md:w-100">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="relative">
          <label htmlFor="header-search-input" className="sr-only">
            Rechercher une marque
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="header-search-input"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Rechercher..."
            aria-label="Rechercher une marque"
            aria-autocomplete="list"
            aria-expanded={suggestions.visible && suggestions.items.length > 0}
            aria-owns={suggestions.visible && suggestions.items.length > 0 ? "header-search-suggestions" : undefined}
            className="w-full pl-9 pr-3 py-2 body-large font-light border border-primary/30 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white/90 placeholder:text-neutral-500"
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.visible && suggestions.items.length > 0 && (
        <div 
          id="header-search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-primary/30 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.items.map((marque, index) => (
            <button
              key={marque.id}
              type="button"
              role="option"
              aria-selected={index === suggestions.highlighted}
              onMouseDown={() => onSuggestionSelect(marque)}
              className={`w-full px-3 py-2 text-left hover:bg-primary-light transition-colors duration-200 body-base ${
                index === suggestions.highlighted ? 'bg-primary-light' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions.items.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="font-medium text-neutral-900">{marque.nom}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}