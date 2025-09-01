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
    category: 'bg-white inline-flex items-center px-3 py-1 rounded-full body-small font-medium text-neutral-800 border border-berry-200',
    condamnation: 'bg-error-light text-error border border-error font-semibold',
    beneficiaire: 'bg-white inline-flex items-center px-3 py-1 rounded-full body-small font-medium text-neutral-800 border border-berry-500',
  };
    return (
      <span className={variantClasses[variant]}>
        {category?.emoji && <span className="mr-1.5">{category.emoji}</span>}
        {children}
      </span>
    );
}
