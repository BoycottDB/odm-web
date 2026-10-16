import type { Metadata } from 'next';
import Link from 'next/link';
import AdresseContact from '@/components/ui/AdresseContact';
import NumeroAlbum from '@/components/ui/NumeroAlbum';

export const metadata: Metadata = {
  title: 'Mentions légales',
};

export default function MentionsLegales() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 tracking-tight">
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none space-y-8">

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Éditeur</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Ce site est édité à titre non professionnel par un particulier. Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique, son identité a été communiquée à l&apos;hébergeur.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Hébergeur</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Netlify, Inc.<br />
                  101 2nd Street, San Francisco, CA 94105, États-Unis<br />
                  <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-900 underline">www.netlify.com</a>
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Contact</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Pour toute question, demande de correction ou exercice d&apos;un droit de réponse :{' '}
                  <AdresseContact />.
                  La procédure est décrite sur la page{' '}
                  <Link href="/droit-de-reponse" className="text-secondary-dark hover:text-secondary-900 underline">Droit de réponse et corrections</Link>.
                </p>
                <NumeroAlbum />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
