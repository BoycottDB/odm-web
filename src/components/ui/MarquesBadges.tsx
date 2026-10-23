'use client';

import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import { demarrerNavigation } from '@/components/ui/BarreProgression';

interface Marque {
  id: number;
  nom: string;
}

interface MarquesBadgesProps {
  marques: Marque[];
}

export function MarquesBadges({ marques }: MarquesBadgesProps) {
  const router = useRouter();

  const handleMarqueClick = (marque: Marque, event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    const href = `/marques/${slugify(marque.nom)}`;
    demarrerNavigation(href);
    router.push(href);
  };

  if (marques.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {marques.map((marque) => (
        <span
          key={marque.id}
          className="inline-flex items-center px-3 py-1 rounded-full body-xs font-semibold bg-secondary-light text-secondary-dark border border-secondary cursor-pointer hover:bg-secondary hover:text-white transition-colors"
          onClick={(e) => handleMarqueClick(marque, e)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMarqueClick(marque, e);
            }
          }}
        >
          {marque.nom}
        </span>
      ))}
    </div>
  );
}
