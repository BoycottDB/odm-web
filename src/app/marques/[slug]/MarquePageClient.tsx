'use client';

import { Marque } from '@/types';
import { ChaineQuiJenrichis } from '@/components/marque/ChaineQuiJenrichis';
import { nomsDesActeursControverses } from '@/components/marque/chaine';
import { ShareButton } from '@/components/ui/ShareButton';
import { SearchHero } from '@/components/search/SearchHero';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import Link from 'next/link';

interface MarquePageClientProps {
  marque: Marque;
  slug: string;
}

export default function MarquePageClient({ marque, slug }: MarquePageClientProps) {
  const { canInstall } = useAddToHomeScreen();

  const acteurs = nomsDesActeursControverses(marque);
  const listeActeurs = new Intl.ListFormat('fr', { type: 'conjunction' }).format(acteurs);

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: marque.nom,
    ...(marque.secteur_marque?.nom && {
      industry: marque.secteur_marque.nom
    })
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Réponse : qui j'enrichis en achetant cette marque */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-6 tracking-tight">
            {marque.nom}
          </h1>
          {acteurs.length > 0 && (
            <p className="heading-sub text-neutral-700 font-light leading-snug">
              En consommant {marque.nom}, j&apos;enrichis <strong className="font-semibold text-neutral-900">{listeActeurs}</strong>
            </p>
          )}

          {/* Recherche d'une autre marque, sous la réponse */}
          <div className="max-w-2xl mx-auto mt-8">
            <SearchHero source="marque_detail" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-3xl mx-4 md:mx-auto space-y-12 md:space-y-16">

          {/* Bouton flottant desktop & mobile */}
          <div className={`fixed right-6 z-50 md:bottom-24 md:right-24 ${canInstall ? 'bottom-16' : 'bottom-6'}`}>
            <ShareButton
              url={`/marques/${slug}`}
              title={`Qui j'enrichis en consommant ${marque.nom} ?`}
              text={acteurs.length > 0
                ? `En consommant ${marque.nom}, j'enrichis ${listeActeurs}. Découvrez pourquoi ça peut poser problème.`
                : `Qui j'enrichis en consommant ${marque.nom} ?`}
              variant="primary"
              size="lg"
              className="shadow-xl rounded-full px-4 py-4 hover:scale-105 transition-transform"
            />
          </div>

          <ChaineQuiJenrichis marque={marque} />


          {/* Appel à contribuer, volontairement discret */}
          <section className="border border-dashed border-primary/30 rounded-2xl px-6 py-5 text-center" aria-labelledby="contribute-title">
            <h3 id="contribute-title" className="text-base font-medium text-neutral-800 mb-1">
              Une controverse manque ?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Ce site est collaboratif : si une controverse n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée.
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
              aria-label="Signaler une nouvelle controverse"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Signaler une controverse
            </Link>
            <p className="text-xs text-neutral-500 mt-3">
              N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
