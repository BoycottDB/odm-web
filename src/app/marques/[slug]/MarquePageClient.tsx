'use client';

import { Marque } from '@/types';
import { ChaineQuiJenrichis } from '@/components/marque/ChaineQuiJenrichis';
import { nomsDesActeursControverses } from '@/components/marque/chaine';
import { ShareButton } from '@/components/ui/ShareButton';
import { SearchHero } from '@/components/search/SearchHero';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import { AppelContribution } from '@/components/marque/AppelContribution';

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
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            {marque.nom}
          </h1>
          {acteurs.length > 0 && (
            <p className="heading-sub text-neutral-700 font-light">
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


          <AppelContribution />
        </div>
      </section>
    </div>
  );
}
