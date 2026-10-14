'use client';

import { FilterOptions } from '@/hooks/useMarquesFilters';
import SimpleSelect from '@/components/ui/SimpleSelect';

interface MarquesFiltersBarProps {
  beneficiaireFilter: number | null;
  secteurFilter: number | null;
  filterOptions: FilterOptions;
  onBeneficiaireChange: (beneficiaire: number | null) => void;
  onSecteurChange: (secteur: number | null) => void;
}

export default function MarquesFiltersBar({
  beneficiaireFilter,
  secteurFilter,
  filterOptions,
  onBeneficiaireChange,
  onSecteurChange
}: MarquesFiltersBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
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
      </div>
    </div>
  );
}
