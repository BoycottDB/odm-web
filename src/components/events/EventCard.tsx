'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Evenement } from '@/types';
import { slugify } from '@/lib/slug';
import { formatDateCourte } from '@/components/marque/LignesControverse';
import { CATEGORIE_EXCLUE } from '@/components/marque/etiquettes';
import { Badge } from '@/components/ui/Badge';

interface EventCardProps {
  event: Evenement;
}

const Separateur = () => <span className="text-neutral-400" aria-hidden="true">·</span>;

// Carte d'un signalement récent : gabarit et survol des cartes de marque (bordure qui fonce,
// chevron qui avance). Ligne d'infos date · marque, étiquette de catégorie comme sur /marques,
// puis le titre de la controverse.
// Toute la carte mène à la marque : son lien est étiré sur la carte (after:inset-0)
export function EventCard({ event }: EventCardProps) {
  const marqueNom = event.marque?.nom;
  const categorie = event.categorie?.nom && event.categorie.nom !== CATEGORIE_EXCLUE ? event.categorie : null;

  return (
    <article className="group relative bg-white border border-primary-medium rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:border-primary transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mb-1">
            <span className="font-semibold text-secondary-dark">{formatDateCourte(event.date)}</span>
            {marqueNom && (
              <>
                <Separateur />
                <Link
                  href={`/marques/${slugify(marqueNom)}`}
                  className="font-bold text-primary after:absolute after:inset-0 after:rounded-2xl"
                >
                  {marqueNom}
                </Link>
              </>
            )}
            {categorie && (
              <>
                <Separateur />
                <Badge category={categorie}>{categorie.nom}</Badge>
              </>
            )}
          </div>
          <p className="text-sm md:text-base font-medium text-neutral-900 leading-snug">{event.titre}</p>
        </div>
        {marqueNom && (
          <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 ml-2 transition-transform duration-200 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}
