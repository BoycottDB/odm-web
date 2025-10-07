'use client';

import { useCallback } from 'react';
import { FilterOptions, SortField, SortOrder } from '@/hooks/useMarquesFilters';
import SimpleSelect from '@/components/ui/SimpleSelect';

interface MarquesFiltersBarProps {
  beneficiaireFilter: number | null;
  secteurFilter: number | null;
  sortField: SortField;
  sortOrder: SortOrder;
  filterOptions: FilterOptions;
  onBeneficiaireChange: (beneficiaire: number | null) => void;
  onSecteurChange: (secteur: number | null) => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortOptions: { value: SortField; label: string; mobileLabel: string; getIcon: (order: SortOrder) => string }[] = [
  { value: 'nom', label: 'Nom', mobileLabel: 'Nom', getIcon: (order) => order === 'asc' ? 'A-Z' : 'Z-A' },
  { value: 'beneficiaires', label: 'Bénéficiaires', mobileLabel: 'Bénéf.', getIcon: () => '🏢' },
  { value: 'evenements', label: 'Controverses', mobileLabel: 'Controverses', getIcon: () => '📰' }
];

export default function MarquesFiltersBar({
  beneficiaireFilter,
  secteurFilter,
  sortField,
  sortOrder,
  filterOptions,
  onBeneficiaireChange,
  onSecteurChange,
  onSortChange
}: MarquesFiltersBarProps) {

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
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
      {/* Ligne unique : Filtres + Tri sur même ligne */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Filtre bénéficiaire */}
          <div className="flex-1 min-w-0">
            <SimpleSelect
              label="Bénéficiaire"
              placeholder="Tous"
              value={beneficiaireFilter}
              options={filterOptions.beneficiaires}
              onChange={onBeneficiaireChange}
            />
          </div>

          {/* Filtre secteur */}
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

        {/* Tri */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm font-medium text-neutral-700 shrink-0">
            Tri :
          </span>
          <div className="flex gap-2">
            {sortOptions.map(option => {
              const isActive = sortField === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortFieldChange(option.value)}
                  className={`
                    flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-2 rounded-lg font-medium text-sm transition-all
                    ${isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }
                  `}
                >
                  <span>{option.getIcon(sortOrder)}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">{option.mobileLabel}</span>
                  {isActive && option.value !== 'nom' && (
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
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
    </div>
  );
}
