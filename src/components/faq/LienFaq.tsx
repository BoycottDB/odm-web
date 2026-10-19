'use client';

import Link from 'next/link';
import { safeTrack } from '@/lib/analytics';

interface LienFaqProps {
  // Ancre de la question visée ; sans ancre, le lien mène à la FAQ entière
  ancre?: string;
  // Endroit du site d'où part le lien, pour savoir quels points d'entrée servent
  source: string;
  className?: string;
  children: React.ReactNode;
}

export default function LienFaq({ ancre, source, className, children }: LienFaqProps) {
  return (
    <Link
      href={ancre ? `/faq#${ancre}` : '/faq'}
      onClick={() => safeTrack('faq_link_click', { source, question: ancre ?? 'faq' })}
      className={className}
    >
      {children}
    </Link>
  );
}
