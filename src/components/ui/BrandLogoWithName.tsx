import { BrandLogo } from './BrandLogo';

interface BrandLogoWithNameProps {
  brandName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

/**
 * Composant combinant logo de marque et nom
 * Utilise BrandLogo avec affichage optionnel du nom
 */
export const BrandLogoWithName = ({ 
  brandName, 
  size = 'md', 
  showName = true,
  className = '' 
}: BrandLogoWithNameProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BrandLogo brandName={brandName} size={size} />
      {showName && (
        <span className="font-medium text-neutral-900 truncate">
          {brandName}
        </span>
      )}
    </div>
  );
};