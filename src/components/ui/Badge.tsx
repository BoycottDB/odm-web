import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'condamnation';
  className?: string;
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  const variantClasses = {
    category: 'bg-accent-category text-gray-800 border border-indigo-200',
    condamnation: 'bg-red-100 text-red-800 border border-red-300 font-semibold'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
