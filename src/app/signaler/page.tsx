import { Metadata } from 'next';
import SignalerClient from './SignalerClient';
import { dataService } from '@/lib/services/dataService';
import { EventCard } from '@/components/events/EventCard';

export const revalidate = 600; // ISR 10 minutes

export const metadata: Metadata = {
  title: 'Signaler une controverse | Répertoire des marques à boycotter',
  description: 'Contribuez à l\'enrichissement collaboratif de notre base de données. Signalez une controverse liée à une marque.',
};

export default async function SignalerPage() {
  const evenements = await dataService.getLastEvenements(10, 0);

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Signaler une controverse
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light">
            Contribuez à l&apos;enrichissement collaboratif de notre base de données
          </p>
        </div>
      </section>

      {/* Section Formulaire */}
      <section className="py-8 md:py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SignalerClient />
        </div>
      </section>

      {/* Section Derniers signalements */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-4xl mx-4 md:mx-auto">
          <h2 className="heading-main text-neutral-900 mb-2 text-center">
            Derniers signalements
          </h2>
          <p className="body-small text-neutral-600 text-center mb-8">
            Consultez les controverses récemment ajoutées à notre base de données collaborative.
          </p>

          {evenements.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              {evenements.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="body-large text-neutral-600">
                Aucune controverse documentée pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}