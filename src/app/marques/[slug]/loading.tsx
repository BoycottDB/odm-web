import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section Hero - visible pendant chargement */}
      <section className="bg-gradient-hero py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-6 tracking-tight">
            Chargement...
          </h1>
          <p className="heading-sub text-neutral-700 font-light leading-snug">
            Qui enrichissez-vous en achetant cette marque ?
          </p>
        </div>
      </section>

      {/* Skeleton pendant chargement */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="body-large font-light text-neutral-600">Chargement des données...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
