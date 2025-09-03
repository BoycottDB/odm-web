import { KeyboardEvent, ChangeEvent } from 'react';
import { Marque, SuggestionState } from '@/types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SuggestionState;
  onSuggestionSelect: (marque: Marque) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
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
  placeholder = "Herta, Nike, Smartbox, Twitter"
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <div className="relative">
          <label htmlFor="search-input" className="sr-only">
            Rechercher une marque
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            aria-label="Rechercher une marque"
            aria-autocomplete="list"
            aria-expanded={suggestions.visible && suggestions.items.length > 0}
            aria-owns={suggestions.visible && suggestions.items.length > 0 ? "search-suggestions" : undefined}
            className="w-full pl-12 pr-4 py-4 body-large font-bold border-2 border-primary rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-light transition-all duration-300 bg-white shadow-lg"
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.visible && suggestions.items.length > 0 && (
        <div 
          id="search-suggestions"
          role="listbox"
          className="absolute z-10 w-full mt-2 bg-white border-2 border-primary rounded-2xl shadow-xl max-h-60 overflow-y-auto"
        >
          {suggestions.items.map((marque, index) => (
            <button
              key={marque.id}
              type="button"
              role="option"
              aria-selected={index === suggestions.highlighted}
              onMouseDown={() => onSuggestionSelect(marque)}
              className={`w-full px-4 py-3 text-left hover:bg-primary-light transition-colors duration-200 ${
                index === suggestions.highlighted ? 'bg-primary-light' : ''
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
