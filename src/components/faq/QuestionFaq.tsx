'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Link2 } from 'lucide-react';
import { safeTrack } from '@/lib/analytics';

interface QuestionFaqProps {
  id: string;
  question: string;
  children: React.ReactNode;
}

// Question dépliable, ouverte d'emblée quand on arrive par son ancre (/faq#argent)
export default function QuestionFaq({ id, question, children }: QuestionFaqProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [lienCopie, setLienCopie] = useState(false);

  useEffect(() => {
    if (window.location.hash !== `#${id}` || !detailsRef.current) return;
    detailsRef.current.open = true;
    detailsRef.current.scrollIntoView({ block: 'start' });
  }, [id]);

  // Mesure des doutes les plus consultés (Umami, sans cookie)
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    if (!details.open) return;
    safeTrack('faq_question_open', { question: id });

    // La question précédente, souvent longue, vient de se replier au-dessus : sans recadrage,
    // le début de la nouvelle réponse se retrouve hors de l'écran. On attend la mise en page.
    requestAnimationFrame(() => {
      const haut = details.getBoundingClientRect().top;
      const horsZoneConfortable = haut < 80 || haut > window.innerHeight * 0.4;
      if (!horsZoneConfortable) return;
      const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      details.scrollIntoView({ block: 'start', behavior: mouvementReduit ? 'auto' : 'smooth' });
    });
  };

  // Lien direct vers la question, pour répondre à un doute ailleurs (réseaux sociaux…)
  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${id}`);
      setLienCopie(true);
      safeTrack('faq_link_copy', { question: id });
      setTimeout(() => setLienCopie(false), 2000);
    } catch {
      setLienCopie(false);
    }
  };

  return (
    <details
      ref={detailsRef}
      id={id}
      // Même name sur toutes les questions : en ouvrir une referme les autres (comportement natif)
      name="faq"
      onToggle={handleToggle}
      // Ouverte, la question prend simplement un fond blanc, un peu plus large que le texte.
      // Les marges négatives gardent le texte aligné sur les questions fermées.
      className="group/question scroll-mt-24 transition-colors duration-300 open:bg-white open:-mx-4 open:px-4 md:open:-mx-6 md:open:px-6"
    >
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden py-5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
        <h3 className="text-lg md:text-xl font-semibold text-neutral-900 group-hover/question:text-primary group-open/question:text-primary transition-colors duration-200">{question}</h3>
        <ChevronDown className="w-6 h-6 flex-shrink-0 text-neutral-900 transition-transform duration-300 group-open/question:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pt-2 pb-6 space-y-6">
        {children}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={copierLien}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Link2 className="w-4 h-4" aria-hidden="true" />
            <span aria-live="polite">{lienCopie ? 'Lien copié !' : 'Copier le lien de cette question'}</span>
          </button>
        </div>
      </div>
    </details>
  );
}
