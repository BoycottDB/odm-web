import { ReactNode } from 'react';
import { Categorie } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'beneficiaire';
  className?: string;
  category?: Categorie;
}

export function Badge({ children, variant = 'category', category }: BadgeProps) {
  // Style tampon : catégories en bleu, bénéficiaires en contour bordeaux. Pas d'aplat pour les
  // bénéficiaires, qui ressortiraient plus que le nom de la marque (et mettraient les personnes en avant)
  const tampon = 'inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-sm';
  const variantClasses = {
    category: `${tampon} text-accent-900 bg-accent-50 border-accent-200`,
    beneficiaire: `${tampon} text-primary-dark border-primary-medium`,
  };
    return (
      <span className={variantClasses[variant]}>
        {category?.emoji && <span className="mr-1">{category.emoji}</span>}
        {children}
      </span>
    );
}
