import { useBrandLogo } from '@/hooks/useBrandLogo';

interface BrandLogoProps {
  brandName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const textSizeClasses = {
  sm: 'text-md',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl'
};

/**
 * Composant d'affichage de logo de marque avec fallback automatique
 * Stratégie : Logo Brandfetch (.fr → .com) → Initiales stylées
 */
export const BrandLogo = ({ 
  brandName, 
  size = 'md', 
  className = '' 
}: BrandLogoProps) => {
  const { logoUrl, status, fallbackInitial } = useBrandLogo(brandName);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`} />
      )}
      
      {/* Logo réussi */}
      {status === 'success' && logoUrl && (
        <div className={`${sizeClasses[size]} rounded-full bg-white/80 p-1 shadow-sm flex items-center justify-center overflow-hidden`}>
          <img 
            src={logoUrl}
            alt={`Logo ${brandName}`}
            className="w-[130%] w-[130%] max-w-[130%] object-contain"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Fallback : initiales stylées */}
      {status === 'fallback' && (
        <div className={`
          ${sizeClasses[size]} 
          ${textSizeClasses[size]}
          bg-gradient-to-br from-primary-500 to-primary-600 
          text-primary flex items-center justify-center 
          font-bold rounded-full shadow-sm
        `}>
          {fallbackInitial}
        </div>
      )}
    </div>
  );
};