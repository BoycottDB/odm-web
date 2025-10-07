'use client';

import Link from 'next/link';
import { MarqueStats } from '@/types';
import MarqueCard from '@/components/MarqueCard';
import MarquesFiltersBar from '@/components/MarquesFiltersBar';
import ActiveFiltersBar from '@/components/ActiveFiltersBar';
import { useMarquesFilters } from '@/hooks/useMarquesFilters';
import { useEffect } from 'react';

interface MarquesListClientProps {
  initialMarques: MarqueStats[];
}

export default function MarquesListClient({ initialMarques }: MarquesListClientProps) {
  const {
    filters,
    filterOptions,
    filteredMarques,
    stats,
    updateSort,
    updateBeneficiaireFilter,
    updateSecteurFilter,
    resetFilters
  } = useMarquesFilters(initialMarques);

  const beneficiaireLabel = filters.beneficiaireFilter !== null
    ? filterOptions.beneficiaires.find(b => b.id === filters.beneficiaireFilter)?.nom
    : undefined;

  const secteurLabel = filters.secteurFilter !== null
    ? filterOptions.secteurs.find(s => s.id === filters.secteurFilter)?.nom
    : undefined;

  // Auto-scroll vers les filtres si flag présent (après recherche infructueuse)
  useEffect(() => {
    const shouldScrollToList = sessionStorage.getItem('scrollToList');

    if (shouldScrollToList === 'true') {
      setTimeout(() => {
        // Offset fixe : hauteur du hero header
        const isMobile = window.innerWidth < 768;
        const headerHeight = isMobile ? 460 : 470; // Hauteur hero + espacement

        window.scrollTo({
          top: headerHeight,
          behavior: 'smooth'
        });
      }, 100);

      // Nettoyer le flag
      sessionStorage.removeItem('scrollToList');
    }
  }, [filters.searchQuery]); // Re-trigger quand searchQuery change

  return (
    <div className="space-y-4">
      <MarquesFiltersBar
        beneficiaireFilter={filters.beneficiaireFilter}
        secteurFilter={filters.secteurFilter}
        sortField={filters.sortField}
        sortOrder={filters.sortOrder}
        filterOptions={filterOptions}
        onBeneficiaireChange={updateBeneficiaireFilter}
        onSecteurChange={updateSecteurFilter}
        onSortChange={updateSort}
      />

      <ActiveFiltersBar
        totalResults={stats.total}
        filteredResults={stats.filtered}
        hasActiveFilters={stats.hasActiveFilters}
        beneficiaireFilter={filters.beneficiaireFilter}
        secteurFilter={filters.secteurFilter}
        beneficiaireLabel={beneficiaireLabel}
        secteurLabel={secteurLabel}
        onBeneficiaireChange={updateBeneficiaireFilter}
        onSecteurChange={updateSecteurFilter}
        onResetFilters={resetFilters}
      />

      {/* Liste des marques */}
      <div id="marques-list">
        <div className="grid gap-4 md:gap-6">
          {filteredMarques.map(marque => (
            <MarqueCard key={marque.id} marque={marque} />
          ))}

          {/* Carte d'incitation au signalement (toujours visible) */}
          <div className="bg-primary-50/20 border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-3">
              Une marque manque ?
            </h3>
            <p className="text-neutral-600 mb-4">
              <strong>Ce répertoire est collaboratif</strong> : si une marque n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />
              N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Signaler une controverse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
