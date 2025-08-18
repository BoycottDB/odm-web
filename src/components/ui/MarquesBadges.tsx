'use client';

import { useRouter } from 'next/navigation';

interface Marque {
  id: number;
  nom: string;
}

interface MarquesBadgesProps {
  marques: Marque[];
  maxVisible?: number;
  onMarqueClick?: (marque: Marque) => void;
  variant?: 'admin' | 'public' | 'indirect';
}

export function MarquesBadges({ 
  marques, 
  maxVisible = 23, 
  onMarqueClick,
  variant = 'public' 
}: MarquesBadgesProps) {
  const router = useRouter();
  
  const handleMarqueClick = (marque: Marque, event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    
    if (onMarqueClick) {
      onMarqueClick(marque);
    } else if (variant === 'public' || variant === 'indirect') {
      // Navigation par défaut vers la recherche
      router.push(`/recherche?q=${encodeURIComponent(marque.nom)}`);
    }
  };

  const visibleMarques = marques.slice(0, maxVisible);
  const remainingCount = marques.length - maxVisible;

  const getBadgeStyles = () => {
    switch (variant) {
      case 'admin':
        return "inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-primary-light text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors";
      case 'indirect':
        return "inline-flex items-center px-3 py-1 rounded-full body-small font-medium bg-white text-blue-600 border border-blue-300 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors";
      case 'public':
      default:
        return "inline-flex items-center px-3 py-1 rounded-full body-small font-medium bg-white text-primary border border-primary cursor-pointer hover:bg-primary hover:text-white transition-colors";
    }
  };

  const badgeStyles = getBadgeStyles();

  const countBadgeStyles = variant === 'admin'
    ? "inline-flex items-center px-2.5 py-0.5 rounded-full body-xs font-medium bg-neutral-100 text-neutral-800"
    : "inline-flex items-center px-3 py-1 rounded-full body-small font-medium bg-neutral-100 text-neutral-700";

  if (marques.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleMarques.map((marque) => (
        <span 
          key={marque.id} 
          className={badgeStyles}
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
      {remainingCount > 0 && (
        <span className={countBadgeStyles}>
          +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}