import type { Metadata } from 'next';
import Link from 'next/link';
import AdresseContact from '@/components/ui/AdresseContact';
import { reponsesPubliees } from '@/lib/reponsesPubliees';
import { formatDate } from '@/lib/utils/helpers';

export const metadata: Metadata = {
  title: 'Droit de réponse et corrections',
  description: 'Contester une fiche, demander une correction ou exercer votre droit de réponse.',
};

export default function DroitDeReponse() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-6 tracking-tight">
            Droit de réponse et corrections
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug">
            Une fiche vous concerne et vous la contestez ? Une information est fausse ou n&apos;est plus à jour ? Voici comment nous le signaler.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none space-y-8">

              <div>
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Demander une correction</h2>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Entreprise, personne citée ou simple visiteur : tout le monde peut demander une correction en écrivant à <AdresseContact />. Indiquez :
                </p>
                <ul className="list-disc pl-6 space-y-1 body-base text-neutral-700 leading-snug mb-4">
                  <li>la page concernée (son lien) ;</li>
                  <li>l&apos;information que vous contestez ;</li>
                  <li>ce que vous demandez : correction, mise à jour ou suppression ;</li>
                  <li>les éléments qui appuient votre demande (décision, document officiel, article de presse…).</li>
                </ul>
                <p className="body-base text-neutral-700 leading-snug">
                  Nous répondons sous 7 jours. Si l&apos;erreur est avérée, la fiche est corrigée sans attendre. Si la demande est étayée, la fiche peut être retirée le temps de l&apos;examen.
                </p>
                <p className="body-base text-neutral-700 leading-snug mt-4">
                  Quand une entreprise a répondu publiquement à une controverse, sa réponse est affichée à côté de la source (lien « Réponse »). Si nous l&apos;avons manquée, signalez-la-nous.
                </p>
              </div>

              <div>
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Exercer votre droit de réponse</h2>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Toute personne, physique ou morale, nommée ou désignée sur ce site peut demander la publication d&apos;une réponse, dans les trois mois qui suivent la mise en ligne du texte en cause (article 1-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique). La réponse est gratuite et publiée dans les trois jours qui suivent la réception de la demande.
                </p>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Votre demande doit préciser (décret n° 2007-1527 du 24 octobre 2007) :
                </p>
                <ul className="list-disc pl-6 space-y-1 body-base text-neutral-700 leading-snug mb-4">
                  <li>votre identité : nom, prénom et adresse ou, pour une personne morale, sa dénomination, son siège et la personne qui la représente ;</li>
                  <li>le texte en cause : le lien de la page et sa nature (titre d&apos;une controverse, description d&apos;un lien financier…) ;</li>
                  <li>les passages que vous contestez ;</li>
                  <li>le texte de votre réponse, qui ne peut pas être plus long que le texte en cause.</li>
                </ul>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Adressez-la à <AdresseContact />. Nous accusons réception de chaque demande par retour de courriel. Ce site étant édité par un particulier qui a conservé l&apos;anonymat, vous pouvez aussi l&apos;adresser à son hébergeur, qui nous la transmettra (coordonnées dans les{' '}
                  <Link href="/mentions-legales" className="text-secondary-dark hover:text-secondary-dark-hover underline">mentions légales</Link>).
                </p>
                <p className="body-base text-neutral-700 leading-snug">
                  La réponse est publiée sur cette page, présentée comme l&apos;exercice d&apos;un droit de réponse, et reliée à la fiche concernée par le lien « Réponse ». Elle peut être refusée si elle est contraire à la loi ou porte atteinte à l&apos;intérêt légitime de tiers.
                </p>
              </div>

              <div>
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Vos données personnelles</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Si une fiche contient des données qui vous concernent, vous pouvez en demander la rectification ou vous opposer à leur publication, à la même adresse : <AdresseContact />. Le détail est dans la{' '}
                  <Link href="/confidentialite" className="text-secondary-dark hover:text-secondary-dark-hover underline">politique de confidentialité</Link>.
                </p>
              </div>

              {reponsesPubliees.length > 0 && (
                <div>
                  <h2 className="heading-main font-bold text-neutral-900 mb-4">Réponses publiées</h2>
                  <div className="space-y-6">
                    {reponsesPubliees.map(reponse => (
                      <div key={reponse.ancre} id={reponse.ancre} className="border-l-4 border-secondary pl-6 scroll-mt-24">
                        <h3 className="body-large font-semibold text-neutral-900 mb-1">
                          Droit de réponse de {reponse.demandeur}
                        </h3>
                        <p className="body-small text-neutral-600 mb-3">
                          À propos de « <Link href={reponse.ficheConcernee.href} className="underline">{reponse.ficheConcernee.titre}</Link> » · reçue le {formatDate(reponse.dateReception)}, publiée le {formatDate(reponse.datePublication)}
                        </p>
                        <p className="body-base text-neutral-700 leading-snug whitespace-pre-line">{reponse.texte}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
