'use client';

import Link from 'next/link';
import { safeTrack } from '@/lib/analytics';

interface LienQuestionProps {
  // Page de questions visée
  page: '/boycotter' | '/faq';
  // Ancre de la question visée ; sans ancre, le lien mène à la page entière
  ancre?: string;
  // Endroit du site d'où part le lien, pour savoir quels points d'entrée servent
  source: string;
  className?: string;
  children: React.ReactNode;
}

export default function LienQuestion({ page, ancre, source, className, children }: LienQuestionProps) {
  return (
    <Link
      href={ancre ? `${page}#${ancre}` : page}
      onClick={() => safeTrack('faq_link_click', { source, question: ancre ?? page })}
      className={className}
    >
      {children}
    </Link>
  );
}
