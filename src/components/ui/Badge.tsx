import { ReactNode } from 'react';
import { Categorie, CategorieStats } from '@/types';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'condamnation' | 'beneficiaire';
  className?: string;
  category?: Categorie | CategorieStats;
}

export function Badge({ children, variant = 'category', category }: BadgeProps) {
  const variantClasses = {
    category: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-accent-dark bg-accent-50 border-l-2 border-accent-100',
    condamnation: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-secondary-700 bg-secondary-50 border-l-2 border-secondary-100',
    beneficiaire: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-primary-dark bg-primary-50 border-l-2 border-primary-light',
  };
    return (
      <span className={variantClasses[variant]}>
        {category?.emoji && <span className="mr-1">{category.emoji}</span>}
        {children}
      </span>
    );
}
