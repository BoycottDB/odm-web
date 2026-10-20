'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Share2 } from 'lucide-react';
import { safeTrack } from '@/lib/analytics';

interface QuestionDepliableProps {
  id: string;
  question: string;
  // Libellé du bouton de partage, propre à chaque page
  libellePartage: string;
  children: React.ReactNode;
}

// Question dépliable (/boycotter, /faq), ouverte d'emblée quand on arrive par son ancre (/faq#argent)
export default function QuestionDepliable({ id, question, libellePartage, children }: QuestionDepliableProps) {
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

  // Lien direct vers la question, pour répondre à un doute ailleurs (réseaux sociaux…).
  // Sur mobile, partage natif comme sur les fiches marque ; sur ordinateur, copie du lien
  const partager = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    const estMobile = /iphone|ipad|ipod|android/.test(navigator.userAgent.toLowerCase());

    if (estMobile && navigator.share) {
      try {
        await navigator.share({ title: question, url });
        safeTrack('faq_link_share', { question: id });
      } catch (error) {
        // Partage annulé par l'utilisateur : rien à faire
        if ((error as Error).name !== 'AbortError') await copierLien(url);
      }
      return;
    }
    await copierLien(url);
  };

  const copierLien = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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
      // Même name sur toutes les questions de la page : en ouvrir une referme les autres (comportement natif)
      name="questions"
      onToggle={handleToggle}
      // Ouverte, la question prend simplement un fond blanc, un peu plus large que le texte.
      // Les marges négatives gardent le texte aligné sur les questions fermées.
      className="group/question scroll-mt-24 transition-colors duration-300 open:bg-white open:-mx-4 open:px-4 md:open:-mx-6 md:open:px-6"
    >
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden -mx-4 px-4 md:-mx-6 md:px-6 py-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
        <h3 className="text-lg md:text-xl font-semibold text-neutral-900 group-hover/question:text-primary group-open/question:text-primary transition-colors duration-200">{question}</h3>
        <ChevronDown className="w-6 h-6 flex-shrink-0 text-neutral-900 transition-transform duration-300 group-open/question:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pt-2 pb-6 space-y-6">
        {children}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={partager}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
            <span aria-live="polite">{lienCopie ? 'Lien copié !' : libellePartage}</span>
          </button>
        </div>
      </div>
    </details>
  );
}
