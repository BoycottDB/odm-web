'use client';

import { Marque } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import ChaineBeneficiaires from '@/components/events/ChaineBeneficiaires';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import { ShareButton } from '@/components/ui/ShareButton';
import { SearchHero } from '@/components/search/SearchHero';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import { useEffect } from 'react';
import Link from 'next/link';

interface MarquePageClientProps {
  marque: Marque;
  slug: string;
}

export default function MarquePageClient({ marque, slug }: MarquePageClientProps) {
  const { canInstall } = useAddToHomeScreen();

  const evenements = marque.evenements || [];
  const hasBeneficiaires = (marque.total_beneficiaires_chaine ?? 0) > 0;
  const chaine = marque.chaine_beneficiaires || [];
  const hasEvents = evenements.length > 0;

  // Auto-scroll vers résultats après chargement (si flag présent)
  useEffect(() => {
    const shouldAutoScroll = sessionStorage.getItem('scrollToResults');

    if (shouldAutoScroll === 'true') {
      setTimeout(() => {
        // Offset fixe selon viewport (taille du hero header)
        const isMobile = window.innerWidth < 768;
        const headerHeight = isMobile ? 350 : 400;

        window.scrollTo({
          top: headerHeight,
          behavior: 'smooth'
        });
      }, 100);

      // Nettoyer le flag
      sessionStorage.removeItem('scrollToResults');
    }
  }, [marque.id]);

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

      {/* Section Hero */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            {marque.nom}
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug mb-8">
            Découvrez les controverses documentées et les bénéficiaires associés.
          </p>

          {/* Barre de recherche */}
          <SearchHero
            placeholder="Herta, Starbucks, Decathlon, Smartbox, L'Oréal, Nous Anti Gaspi, Vittel, La Laitière, Biscuits St Michel, Twitter, CANAL+"
            source="marque_detail"
          />
        </div>
      </section>

      {/* Section principale avec layout identique à EventList */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-16">

          {/* Statistiques */}
          <section aria-label="Statistiques des résultats de recherche">
            <p className="body-base text-center">
              {hasBeneficiaires && <strong>{marque.total_beneficiaires_chaine} bénéficiaire{(marque.total_beneficiaires_chaine ?? 0) > 1 ? 's' : ''} controversé{(marque.total_beneficiaires_chaine ?? 0) > 1 ? 's' : ''}</strong>}{hasBeneficiaires && hasEvents && ' et '}{hasEvents && <strong>{evenements.length} controverse{evenements.length > 1 ? 's' : ''}</strong>} ont été signalés pour <strong>{marque.nom}</strong>.
            </p>
          </section>

          {/* Section Boycott Tips */}
          {(marque.message_boycott_tips || marque.secteur_marque?.message_boycott_tips) && (
            <div className="max-w-4xl mx-auto">
              <BoycottTipsSection marque={marque} />
            </div>
          )}

          {/* Bouton flottant desktop & mobile */}
          <div className={`fixed right-6 z-50 md:bottom-24 md:right-24 ${canInstall ? 'bottom-16' : 'bottom-6'}`}>
            <ShareButton
              url={`/marques/${slug}`}
              title={`Controverses de ${marque.nom} - Répertoire des marques`}
              text={`Découvrez les controverses documentées de ${marque.nom} sur notre répertoire collaboratif.`}
              variant="primary"
              size="lg"
              className="shadow-xl rounded-full px-4 py-4 hover:scale-105 transition-transform"
            />
          </div>

          {/* Chaîne de bénéficiaires */}
          {hasBeneficiaires && (
            <section aria-labelledby="beneficiaires-title">
              <h3 id="beneficiaires-title" className="heading-main font-medium text-neutral-900 mb-6 text-center">
                À qui profitent vos achats ?
              </h3>
              <ChaineBeneficiaires
                marqueId={marque.id}
                marqueNom={marque.nom}
                chaine={chaine}
              />
            </section>
          )}

          {/* Événements */}
          {hasEvents && (
            <section aria-labelledby="controverses-title">
              <h3 id="controverses-title" className="heading-main font-medium text-neutral-900 mb-6 text-center">
                Controverses signalées
              </h3>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                {evenements.map((event) => (
                  <EventCard key={event.id} event={event} marque={marque} />
                ))}
              </div>
            </section>
          )}

          {/* Fausse controverse d'incitation */}
          <section className="bg-white border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center" aria-labelledby="contribute-title">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center" aria-hidden="true">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 id="contribute-title" className="text-lg font-medium text-neutral-800 mb-3">
              Une controverse manque ?
            </h3>
            <p className="text-neutral-600 mb-4">
              <strong>Ce répertoire est collaboratif</strong> : si une controverse n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
              aria-label="Signaler une nouvelle controverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Signaler une controverse
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}
