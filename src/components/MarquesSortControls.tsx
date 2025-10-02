'use client';

import { SortField, SortOrder } from '@/hooks/useMarquesFilters';

interface MarquesSortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortOptions: { value: SortField; label: string; icon: string }[] = [
  { value: 'nom', label: 'Nom', icon: 'A-Z' },
  { value: 'evenements', label: 'Controverses', icon: '📰' },
  { value: 'beneficiaires', label: 'Bénéficiaires', icon: '🏢' }
];

export default function MarquesSortControls({
  sortField,
  sortOrder,
  onSortChange
}: MarquesSortControlsProps) {
  const handleFieldChange = (field: SortField) => {
    // Si on clique sur le même champ, inverser l'ordre
    if (field === sortField) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ : ordre par défaut (desc pour chiffres, asc pour texte)
      const defaultOrder = field === 'nom' ? 'asc' : 'desc';
      onSortChange(field, defaultOrder);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                onClick={() => handleFieldChange(option.value)}
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
                <span className="sm:hidden">{option.label.split(' ')[0]}</span>
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
