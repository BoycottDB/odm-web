import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'category' | 'condamnation';
  className?: string;
}

export function Badge({ children, variant = 'category', className = '' }: BadgeProps) {
  const variantClasses = {
    category: 'bg-accent-category text-neutral-800 border border-info',
    condamnation: 'bg-error-light text-error border border-error font-semibold'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full body-small font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
