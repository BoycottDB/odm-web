'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SimpleSelectProps<T = { id: number; nom: string }> {
  label: string;
  placeholder?: string;
  value: number | null;
  options: T[];
  onChange: (value: number | null) => void;
  displayKey?: keyof T;
  valueKey?: keyof T;
}

export default function SimpleSelect<T extends { id: number; nom: string }>({
  label,
  placeholder = 'Tous',
  value,
  options,
  onChange,
  displayKey = 'nom' as keyof T,
  valueKey = 'id' as keyof T
}: SimpleSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((optionValue: number | null) => {
    onChange(optionValue);
    setIsOpen(false);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange(null);
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
          <div className="max-h-60 overflow-y-auto">
            <button
              onClick={() => handleSelect(null)}
              className={`
                w-full px-4 py-2.5 text-left hover:bg-primary/5 transition-colors text-sm
                ${!hasValue ? 'bg-primary/10 text-primary font-medium' : 'text-neutral-700'}
              `}
            >
              Tous les {label.toLowerCase()}s
            </button>

            {options.map(option => {
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
          </div>
        </div>
      )}
    </div>
  );
}
