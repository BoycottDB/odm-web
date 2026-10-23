import Link from 'next/link';
import { slugify } from '@/lib/slug';

interface Marque {
  id: number;
  nom: string;
}

interface MarquesBadgesProps {
  marques: Marque[];
}

export function MarquesBadges({ marques }: MarquesBadgesProps) {
  if (marques.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {marques.map((marque) => (
        <Link
          key={marque.id}
          href={`/marques/${slugify(marque.nom)}`}
          className="inline-flex items-center px-3 py-1 rounded-full body-xs font-semibold bg-secondary-light text-secondary-dark border border-secondary hover:bg-secondary hover:text-white transition-colors"
        >
          {marque.nom}
        </Link>
      ))}
    </div>
  );
}
