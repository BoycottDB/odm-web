import { useState, useEffect, useMemo } from 'react';
import { getBrandLogoUrls, LogoCache, testImageLoad } from '@/lib/utils/logoUtils';

interface UseBrandLogoResult {
  logoUrl: string | null;
  status: 'loading' | 'success' | 'fallback';
  fallbackInitial: string;
}

/**
 * Hook pour charger les logos de marques avec fallback automatique
 * Stratégie : .fr → .com → initiales stylées
 */
export const useBrandLogo = (brandName: string): UseBrandLogoResult => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'fallback'>('loading');

  // Génère les initiales pour le fallback
  const fallbackInitial = useMemo(() => {
    return brandName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [brandName]);

  useEffect(() => {
    let isCancelled = false;
    
    const loadLogo = async () => {
      if (!brandName) {
        setStatus('fallback');
        return;
      }

      // Vérifier le cache
      const cached = LogoCache.get(brandName);
      if (cached === 'failed') {
        setStatus('fallback');
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;
      if (!clientId) {
        setStatus('fallback');
        return;
      }

      setStatus('loading');
      
      const [frUrl, comUrl] = getBrandLogoUrls(brandName, clientId);

      // Essayer .fr d'abord
      if (await testImageLoad(frUrl)) {
        if (!isCancelled) {
          setLogoUrl(frUrl);
          setStatus('success');
          LogoCache.set(brandName, 'success');
        }
        return;
      }

      // Fallback vers .com
      if (await testImageLoad(comUrl)) {
        if (!isCancelled) {
          setLogoUrl(comUrl);
          setStatus('success');
          LogoCache.set(brandName, 'success');
        }
        return;
      }

      // Aucun logo trouvé
      if (!isCancelled) {
        setStatus('fallback');
        LogoCache.set(brandName, 'failed');
      }
    };

    loadLogo();
    
    return () => {
      isCancelled = true;
    };
  }, [brandName]);

  return { logoUrl, status, fallbackInitial };
};