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
    category: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-50 border-l-2 border-indigo-200',
    condamnation: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-50 border-l-2 border-indigo-200',
    beneficiaire: 'inline-flex items-center px-2 py-0.5 text-xs font-medium text-berry-700 bg-berry-50 border-l-2 border-berry-200',
  };
    return (
      <span className={variantClasses[variant]}>
        {category?.emoji && <span className="mr-1">{category.emoji}</span>}
        {children}
      </span>
    );
}
