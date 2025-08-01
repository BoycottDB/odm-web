import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'date' | 'brand';
  className?: string;
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  const variantClasses = {
    category: 'bg-accent-category text-gray-800 border border-indigo-200',
    date: 'bg-accent-date text-gray-800 border border-yellow-300',
    brand: 'bg-berry-100 text-gray-800 border border-berry-200'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
