'use client';

import { useEffect, useRef } from 'react';
import { safeTrack } from '@/lib/analytics';

interface SuiviVisibiliteProps {
  evenement: string;
  className?: string;
  children: React.ReactNode;
}

// Envoie l'événement Umami une seule fois, quand la moitié du bloc apparaît à l'écran
export default function SuiviVisibilite({ evenement, className, children }: SuiviVisibiliteProps) {
  const blocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bloc = blocRef.current;
    if (!bloc) return;
    const observer = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          safeTrack(evenement);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(bloc);
    return () => observer.disconnect();
  }, [evenement]);

  return <div ref={blocRef} className={className}>{children}</div>;
}
