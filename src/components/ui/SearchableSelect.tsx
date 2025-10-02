'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SearchableSelectProps<T = { id: number; nom: string }> {
  label: string;
  placeholder?: string;
  value: number | null;
  options: T[];
  onChange: (value: number | null) => void;
  emptyMessage?: string;
  displayKey?: keyof T;
  valueKey?: keyof T;
}

export default function SearchableSelect<T extends { id: number; nom: string }>({
  label,
  placeholder = 'Rechercher...',
  value,
  options,
  onChange,
  emptyMessage = 'Aucun résultat',
  displayKey = 'nom' as keyof T,
  valueKey = 'id' as keyof T
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchQuery.trim()
    ? options.filter(opt =>
        String(opt[displayKey]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = useCallback((optionValue: number | null) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange(null);
    setSearchQuery('');
  }, [onChange]);

  const selectedOption = value !== null ? options.find(opt => opt[valueKey] === value) : null;
  const displayLabel = selectedOption ? String(selectedOption[displayKey]) : placeholder;
  const hasValue = value !== null;

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-medium text-neutral-700 mb-1.5">
        {label}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 text-sm text-left border rounded-lg transition-all
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-300'}
          hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${hasValue ? 'text-neutral-900' : 'text-neutral-500'}`}>
            {displayLabel}
          </span>
          <div className="flex items-center gap-2">
            {hasValue && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                role="button"
                aria-label="Effacer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-neutral-500 text-sm">
                {emptyMessage}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleSelect(null)}
                  className={`
                    w-full px-4 py-2.5 text-left hover:bg-primary/5 transition-colors text-sm
                    ${!hasValue ? 'bg-primary/10 text-primary font-medium' : 'text-neutral-700'}
                  `}
                >
                  Tous les {label.toLowerCase()}s
                </button>

                {filteredOptions.map(option => {
                  const optionValue = option[valueKey] as number;
                  const optionLabel = String(option[displayKey]);
                  const count = 'count' in option ? (option as { count: number }).count : undefined;
                  return (
                    <button
                      key={optionValue}
                      onClick={() => handleSelect(optionValue)}
                      className={`
                        w-full px-4 py-2.5 text-left hover:bg-primary/5 transition-colors text-sm flex items-center justify-between
                        ${value === optionValue ? 'bg-primary/10 text-primary font-medium' : 'text-neutral-700'}
                      `}
                    >
                      <span>{optionLabel}</span>
                      {count !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${value === optionValue ? 'bg-primary/20 text-primary' : 'bg-neutral-100 text-neutral-500'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer avec compteur */}
          {filteredOptions.length > 0 && (
            <div className="px-4 py-2 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
              {filteredOptions.length} {filteredOptions.length > 1 ? 'résultats' : 'résultat'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
