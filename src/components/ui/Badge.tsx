import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'date' | 'brand';
  className?: string;
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  const variantClasses = {
    category: 'bg-orange-50 text-gray-800 border border-orange-100',
    date: 'bg-amber-50 text-gray-800 border border-amber-100',
    brand: 'bg-yellow-50 text-gray-800 border border-yellow-100'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
