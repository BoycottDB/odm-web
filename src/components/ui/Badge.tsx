import { ReactNode } from 'react';
import { Categorie, CategorieStats } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'condamnation';
  className?: string;
  category?: Categorie | CategorieStats;
}

export function Badge({ children, variant = 'category', className = '', category }: BadgeProps) {
  const variantClasses = {
    category: 'bg-accent-category text-neutral-800 border border-info',
    condamnation: 'bg-error-light text-error border border-error font-semibold'
  };

  // Si on a une catégorie avec émoji et couleur, on les utilise
  if (variant === 'category' && category?.emoji && category?.couleur) {
    const bgColor = category.couleur;
    return (
      <span 
        className={`inline-flex items-center px-3 py-1 rounded-full body-small font-medium text-neutral-800 border border-berry-200 ${className}`}
        style={{ backgroundColor: 'white' }}
      >
        <span className="mr-1.5">{category.emoji}</span>
        {children}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full body-small font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
