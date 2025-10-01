import { Suspense } from 'react';
import MarquesList from '@/components/MarquesList';
import MarquesSkeleton from '@/components/MarquesSkeleton';

// Utilisation d'ISR pour le cache et performance (aligné API)
export const revalidate = 600; // 10 minutes

export default function MarquesPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Section Hero */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Toutes les marques référencées
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug">
            Découvrez l&apos;ensemble des marques documentées dans notre base de données collaborative.
          </p>
        </div>
      </section>

      {/* Section Liste des marques */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <Suspense fallback={<MarquesSkeleton count={8} />}>
            <MarquesList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}