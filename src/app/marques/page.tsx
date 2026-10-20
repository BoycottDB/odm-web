import { Metadata } from 'next';
import MarquesListClient from '@/components/MarquesListClient';
import { SearchHero } from '@/components/search/SearchHero';
import { dataService } from '@/lib/services/dataService';

// Utilisation d'ISR pour le cache et performance (aligné API)
export const revalidate = 600; // 10 minutes

// Metadata SEO
export const metadata: Metadata = {
  title: "Toutes les marques | Qui j'enrichis ?",
  description: 'Consultez l\'ensemble des marques documentées dans notre base de données collaborative. Découvrez les controverses et les bénéficiaires associés.',
  openGraph: {
    title: "Toutes les marques | Qui j'enrichis ?",
    description: 'Consultez l\'ensemble des marques documentées dans notre base de données collaborative.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Toutes les marques | Qui j'enrichis ?",
    description: 'Consultez l\'ensemble des marques documentées dans notre base de données collaborative.',
  },
  alternates: {
    canonical: '/marques'
  }
};

export default async function MarquesPage() {
  // Une erreur de l'API remonte : Next garde la dernière liste au lieu de mettre en cache une liste vide
  const marques = await dataService.getMarquesStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Rechercher une marque
          </h1>
          <p className="heading-sub text-neutral-700 font-light">
            Cherchez une marque, un groupe ou une personne : on vous montre à qui profitent vos achats.
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mt-8">
            <SearchHero source="marques_list" />
          </div>
        </div>
      </section>

      {/* Section Liste des marques avec filtres */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="heading-sub font-bold text-neutral-900 mb-6">
            Toutes les marques
          </h2>
          <MarquesListClient initialMarques={marques} />
        </div>
      </section>
    </div>
  );
}