import type { Metadata } from 'next';
import Link from 'next/link';
import AdresseContact from '@/components/ui/AdresseContact';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description: 'Les données que traite le site, pourquoi, où et combien de temps et comment exercer vos droits.',
};

const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function Confidentialite() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Confidentialité
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light">
            Pas de compte, pas de cookie de suivi, aucune donnée vendue. Voici ce que le site traite et pourquoi.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none space-y-8">

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Qui est responsable</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  L&apos;éditeur du site, un particulier (voir les{' '}
                  <Link href="/mentions-legales" className={lienClass}>mentions légales</Link>). Pour toute question sur vos données : <AdresseContact />.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Quand vous consultez le site</h2>
                <ul className="list-disc pl-6 space-y-2 body-base text-neutral-700 leading-snug">
                  <li>
                    <strong>Hébergement (Netlify, États-Unis).</strong> Comme tout hébergeur, Netlify enregistre des journaux techniques (adresse IP, navigateur, pages demandées) pour faire fonctionner et protéger le site.
                  </li>
                  <li>
                    <strong>Statistiques de visite (Umami).</strong> Nombre de visites, pages vues et quelques actions (recherches, blocs ouverts sur les fiches des marques, clics sur les sources, partages, questions de la FAQ consultées), pour savoir ce qui est utile. Umami ne dépose aucun cookie et ne permet pas de vous identifier. Ses données sont hébergées dans l&apos;Union européenne (Francfort).
                  </li>
                  <li>
                    <strong>Suivi des erreurs (Sentry, Union européenne).</strong> Quand une page plante, un rapport technique est envoyé pour corriger le problème. Les informations d&apos;identification et les cookies en sont retirés avant l&apos;envoi.
                  </li>
                </ul>
                <p className="body-base text-neutral-700 leading-snug mt-4">
                  Ces traitements reposent sur l&apos;intérêt légitime de l&apos;éditeur à faire fonctionner le site et à l&apos;améliorer. Le transfert vers les États-Unis lié à l&apos;hébergement est encadré par les garanties prévues par le règlement général sur la protection des données (RGPD), détaillées dans les conditions de Netlify.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Ce qui est enregistré dans votre navigateur</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Aucun cookie n&apos;est déposé pour les visiteurs. Le site garde seulement, dans votre navigateur et le temps de votre visite, quelques informations de navigation : par exemple, pour vous ramener à la liste des marques après une recherche. Elles ne quittent pas votre appareil et disparaissent à la fermeture de l&apos;onglet.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Quand vous signalez une controverse</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Le formulaire de signalement est anonyme : il ne demande ni nom ni adresse email et votre adresse IP n&apos;est pas enregistrée. Seuls la marque, la description, la date et la source sont conservés, dans une base de données hébergée dans l&apos;Union européenne (Supabase). La décision de modération est publique. N&apos;écrivez pas de données personnelles dans la description.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Quand vous nous écrivez</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Vos courriels (questions, demandes de correction, droit de réponse) sont reçus par une messagerie hébergée en Suisse (Proton), pays reconnu par l&apos;Union européenne comme assurant une protection adéquate. Ils servent uniquement à traiter votre demande et sont conservés trois ans après le dernier échange, pour pouvoir prouver qu&apos;elle a été traitée.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Les personnes citées dans les fiches</h2>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Certaines fiches nomment des dirigeants ou des actionnaires. Le site ne parle d&apos;eux qu&apos;à travers des faits liés à leur rôle public (entreprises détenues, déclarations publiques, procédures en cours ou jugées), toujours à partir de sources publiques citées sur la fiche. Leur vie privée n&apos;est évoquée que lorsqu&apos;elle rejoint ce rôle ou un débat d&apos;intérêt général.
                </p>
                <p className="body-base text-neutral-700 leading-snug">
                  Ces traitements reposent sur l&apos;intérêt légitime à informer le public (article 6.1.f du RGPD), dans le cadre des dérogations prévues pour la liberté d&apos;expression et d&apos;information (article 85 du RGPD et article 80 de la loi Informatique et Libertés). Si une fiche vous concerne, vous pouvez demander une rectification ou vous opposer à la publication d&apos;une information : la demande est examinée en tenant compte de l&apos;intérêt du public à être informé. Voir la page{' '}
                  <Link href="/droit-de-reponse" className={lienClass}>Droit de réponse et corrections</Link>.
                </p>
              </div>

              <div>
                <h2 className="heading-main text-neutral-900 mb-4">Vos droits</h2>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Vous pouvez demander l&apos;accès à vos données, leur rectification ou leur effacement, ou vous opposer à leur traitement, en écrivant à <AdresseContact />. Nous répondons dans un délai d&apos;un mois. Le site ne vous identifie pas : pour les statistiques et les journaux techniques, nous ne pouvons généralement pas retrouver des données qui vous concernent.
                </p>
                <p className="body-base text-neutral-700 leading-snug">
                  Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={lienClass}>cnil.fr</a>).
                </p>
              </div>

              <p className="body-small text-neutral-500">Dernière mise à jour : 29 octobre 2026.</p>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
