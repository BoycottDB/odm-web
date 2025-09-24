"use client";
import { useState, useEffect } from 'react';

export type MobileOS = 'ios' | 'android' | 'other';

interface MobileDetection {
  isMobile: boolean;
  os: MobileOS;
  isStandalone: boolean;
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    os: 'other',
    isStandalone: false
  });

  useEffect(() => {
    const detectMobile = (): MobileDetection => {
      if (typeof window === 'undefined') {
        return { isMobile: false, os: 'other', isStandalone: false };
      }

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as { standalone?: boolean }).standalone === true;
      
      // Détection iOS
      const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
        (userAgent.includes('mac') && 'ontouchend' in document);
      
      // Détection Android
      const isAndroid = /android/.test(userAgent);
      
      // Détection mobile générale
      const isMobile = isIOS || isAndroid || 
        window.matchMedia('(max-width: 768px)').matches;

      let os: MobileOS = 'other';
      if (isIOS) os = 'ios';
      else if (isAndroid) os = 'android';

      return {
        isMobile,
        os,
        isStandalone
      };
    };

    setDetection(detectMobile());

    // Écouter les changements de taille d'écran (iOS déclenche 'resize' au scroll)
    const handleResize = () => {
      const next = detectMobile();
      setDetection(prev => (
        prev.isMobile === next.isMobile &&
        prev.os === next.os &&
        prev.isStandalone === next.isStandalone
      ) ? prev : next);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return detection;
}