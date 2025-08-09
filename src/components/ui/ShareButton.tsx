import { useState } from 'react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface ShareButtonProps {
  /** URL à partager */
  url: string;
  /** Titre de partage */
  title: string;
  /** Texte de partage */
  text?: string;
  /** Variante du bouton */
  variant?: 'primary' | 'secondary' | 'minimal';
  /** Taille du bouton */
  size?: 'sm' | 'md' | 'lg';
  /** Classes CSS additionnelles */
  className?: string;
}

export function ShareButton({
  url,
  title,
  text = '',
  variant = 'secondary',
  size = 'md',
  className = ''
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const isMobile = useMobileDetection();

  // Construction de l'URL absolue
  const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  
  const shareData = {
    title: title,
    text: text,
    url: shareUrl
  };

  const handleShare = async (e: React.MouseEvent) => {
    // Empêcher le comportement par défaut et la propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Vérification plus robuste pour desktop : utiliser user agent plutôt que la taille d'écran
    const userAgent = navigator.userAgent.toLowerCase();
    const isRealMobile = /iphone|ipad|ipod|android/.test(userAgent);
    
    // Desktop : toujours copier le lien
    if (!isRealMobile) {
      copyToClipboard();
      return;
    }

    // Mobile réel : utiliser l'API de partage natif si disponible
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Si l'utilisateur annule le partage, ne rien faire
        if ((error as Error).name !== 'AbortError') {
          console.warn('Erreur lors du partage:', error);
          // Fallback vers la copie
          copyToClipboard();
        }
      }
    } else {
      // Fallback mobile : copier le lien
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Erreur lors de la copie:', error);
      // Fallback pour navigateurs anciens
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  };

  // Classes CSS selon les variants
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-600';
      case 'secondary':
        return 'bg-primary-50 text-primary hover:bg-primary-100';
      case 'minimal':
        return 'text-primary hover:bg-primary-50';
      default:
        return 'bg-primary-50 text-primary hover:bg-primary-100';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  // Détection plus robuste du mobile
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isRealMobile = /iphone|ipad|ipod|android/.test(userAgent);

  return (
    <button
      onClick={handleShare}
      className={`
        inline-flex items-center gap-2 
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        rounded-lg font-medium 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      title="Partager"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="hidden sm:inline">Copié !</span>
        </>
      ) : (
        <>
          {isRealMobile ? (
            // Icône partage mobile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          ) : (
            // Icône lien desktop
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
          <span className="hidden sm:inline">
            Partager
          </span>
        </>
      )}
    </button>
  );
}