'use client';

import { useState, useCallback, useEffect } from 'react';
import { FilterOptions, SortField, SortOrder } from '@/hooks/useMarquesFilters';
import SearchableSelect from '@/components/ui/SearchableSelect';
import SimpleSelect from '@/components/ui/SimpleSelect';

interface MarquesFiltersBarProps {
  searchQuery: string;
  beneficiaireFilter: number | null;
  secteurFilter: number | null;
  sortField: SortField;
  sortOrder: SortOrder;
  filterOptions: FilterOptions;
  onSearchChange: (query: string) => void;
  onBeneficiaireChange: (beneficiaire: number | null) => void;
  onSecteurChange: (secteur: number | null) => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortOptions: { value: SortField; label: string; mobileLabel: string; icon: string }[] = [
  { value: 'nom', label: 'Nom', mobileLabel: 'Nom', icon: 'A-Z' },
  { value: 'evenements', label: 'Controverses', mobileLabel: 'Controv.', icon: '📰' },
  { value: 'beneficiaires', label: 'Bénéficiaires', mobileLabel: 'Bénéf.', icon: '🏢' }
];

export default function MarquesFiltersBar({
  searchQuery,
  beneficiaireFilter,
  secteurFilter,
  sortField,
  sortOrder,
  filterOptions,
  onSearchChange,
  onBeneficiaireChange,
  onSecteurChange,
  onSortChange
}: MarquesFiltersBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  // État local pour input immédiat (pas de delay visuel)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync avec props
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value); // Mise à jour immédiate de l'input
    onSearchChange(value); // Debounced dans le hook
  }, [onSearchChange]);

  const handleSortFieldChange = useCallback((field: SortField) => {
    // Si on clique sur le même champ, inverser l'ordre
    if (field === sortField) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ : ordre par défaut (desc pour chiffres, asc pour texte)
      const defaultOrder = field === 'nom' ? 'asc' : 'desc';
      onSortChange(field, defaultOrder);
    }
  }, [sortField, sortOrder, onSortChange]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 space-y-3">
      {/* Ligne principale : Recherche + Filtres */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
        {/* Recherche compacte */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">Rechercher</label>
          <div className={`relative ${searchFocused ? 'ring-2 ring-primary/20' : ''} rounded-lg`}>
            <input
              type="text"
              placeholder="Nom de marque..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filtre bénéficiaire compact */}
        <div className="flex-1 min-w-0">
          <SearchableSelect
            label="Bénéficiaire"
            placeholder="Tous"
            value={beneficiaireFilter}
            options={filterOptions.beneficiaires}
            onChange={onBeneficiaireChange}
            emptyMessage="Aucun résultat"
          />
        </div>

        {/* Filtre secteur (si présent) */}
        {filterOptions.secteurs.length > 0 && (
          <div className="flex-1 min-w-0">
            <SimpleSelect
              label="Secteur"
              placeholder="Tous"
              value={secteurFilter}
              options={filterOptions.secteurs}
              onChange={onSecteurChange}
            />
          </div>
        )}
      </div>

      {/* Ligne de tri */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-700 flex items-center gap-1.5 shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Trier par
        </span>

        <div className="flex flex-wrap gap-1.5">
          {sortOptions.map(option => {
            const isActive = sortField === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSortFieldChange(option.value)}
                className={`
                  flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xs transition-all
                  ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
              >
                <span className="text-sm">{option.icon}</span>
                <span className="hidden sm:inline">{option.label}</span>
                <span className="sm:hidden">{option.mobileLabel}</span>
                {isActive && (
                  <svg
                    className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
