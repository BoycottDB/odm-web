'use client';

import Link from 'next/link';
import { MarqueStats } from '@/types';
import MarqueCard from '@/components/MarqueCard';
import MarquesFiltersBar from '@/components/MarquesFiltersBar';
import ActiveFiltersBar from '@/components/ActiveFiltersBar';
import IndexAlphabetique from '@/components/IndexAlphabetique';
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
    lettresDisponibles,
    stats,
    updateBeneficiaireFilter,
    updateSecteurFilter,
    updateLettreFilter,
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
  }, [filters.searchQuery, filters.beneficiaireFilter]); // Re-trigger quand la recherche ou le bénéficiaire change

  return (
    <div className="space-y-4">
      <MarquesFiltersBar
        beneficiaireFilter={filters.beneficiaireFilter}
        secteurFilter={filters.secteurFilter}
        filterOptions={filterOptions}
        onBeneficiaireChange={updateBeneficiaireFilter}
        onSecteurChange={updateSecteurFilter}
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

      <IndexAlphabetique
        lettresDisponibles={lettresDisponibles}
        lettreFilter={filters.lettreFilter}
        onLettreChange={updateLettreFilter}
      />

      {/* Liste des marques */}
      <div id="marques-list">
        <div className="grid gap-4 md:gap-6">
          {filteredMarques.map(marque => (
            <MarqueCard key={marque.id} marque={marque} />
          ))}

          {/* Appel à contribuer, volontairement discret (comme sur la page de marque) */}
          <section className="border border-dashed border-primary/30 rounded-2xl px-6 py-5 text-center" aria-labelledby="contribute-title">
            <h3 id="contribute-title" className="text-base font-medium text-neutral-800 mb-1">
              Une marque manque ?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Ce répertoire est collaboratif : si une marque n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée.
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark hover:text-white transition-colors"
              aria-label="Signaler une nouvelle controverse"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Signaler une controverse
            </Link>
            <p className="text-xs text-neutral-500 mt-3">
              N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
