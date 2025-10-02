'use client';

interface ActiveFiltersBarProps {
  totalResults: number;
  filteredResults: number;
  hasActiveFilters: boolean;
  beneficiaireFilter: number | null;
  secteurFilter: number | null;
  beneficiaireLabel?: string;
  secteurLabel?: string;
  onBeneficiaireChange: (beneficiaire: number | null) => void;
  onSecteurChange: (secteur: number | null) => void;
  onResetFilters: () => void;
}

export default function ActiveFiltersBar({
  totalResults,
  filteredResults,
  hasActiveFilters,
  beneficiaireFilter,
  secteurFilter,
  beneficiaireLabel,
  secteurLabel,
  onBeneficiaireChange,
  onSecteurChange,
  onResetFilters
}: ActiveFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-2">
        {/* Stats - toujours affichées */}
        <span className="text-neutral-600">
          {filteredResults === totalResults ? (
            <><strong className="text-neutral-900">{totalResults}</strong> marque{totalResults > 1 ? 's' : ''}</>
          ) : (
            <><strong className="text-neutral-900">{filteredResults}</strong> / {totalResults}</>
          )}
        </span>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Réinitialiser
          </button>
        )}
      </div>

      {hasActiveFilters && (beneficiaireFilter !== null || secteurFilter !== null) && (
        <div className="flex flex-wrap gap-1.5">
          {beneficiaireFilter !== null && beneficiaireLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              🏢 {beneficiaireLabel.length > 20 ? beneficiaireLabel.slice(0, 20) + '...' : beneficiaireLabel}
              <button
                onClick={() => onBeneficiaireChange(null)}
                className="hover:text-primary-dark"
                aria-label="Retirer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {secteurFilter !== null && secteurLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              📁 {secteurLabel}
              <button
                onClick={() => onSecteurChange(null)}
                className="hover:text-primary-dark"
                aria-label="Retirer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
