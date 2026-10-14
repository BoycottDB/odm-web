'use client';

const LETTRES = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];

interface IndexAlphabetiqueProps {
  lettresDisponibles: Set<string>;
  lettreFilter: string | null;
  onLettreChange: (lettre: string | null) => void;
}

// Filtre par première lettre : un clic n'affiche que les marques de cette lettre,
// un second clic retire le filtre
export default function IndexAlphabetique({ lettresDisponibles, lettreFilter, onLettreChange }: IndexAlphabetiqueProps) {
  return (
    <nav
      aria-label="Filtrer les marques par lettre"
      className="overflow-x-auto"
    >
      <div className="flex md:justify-between gap-1 min-w-max md:min-w-0">
        {LETTRES.filter((lettre) => lettre !== '#' || lettresDisponibles.has('#')).map((lettre) => {
          const active = lettre === lettreFilter;
          return (
            <button
              key={lettre}
              type="button"
              onClick={() => onLettreChange(active ? null : lettre)}
              disabled={!active && !lettresDisponibles.has(lettre)}
              aria-pressed={active}
              className={`w-7 h-7 rounded-md text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-primary/10 disabled:text-neutral-300 disabled:hover:bg-transparent'
              }`}
            >
              {lettre}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
