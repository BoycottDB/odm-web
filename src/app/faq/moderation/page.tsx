'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDecisions } from '@/hooks/useDecisions';
import { Decision } from '@/types';
import { slugify } from '@/lib/slug';

// Validée : le titre tel qu'il est publié sur la fiche, avec le lien vers la fiche et la réponse éventuelle.
// Refusée : la justification seule (elle donne le motif, sans reprendre l'accusation).
const lienClass = 'text-secondary-dark hover:text-secondary-900 font-medium';

function DecisionCard({ decision }: { decision: Decision }) {
  const date = new Date(decision.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="border border-neutral-200 rounded-lg px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 body-small">
        <span className="font-medium">
          {decision.statut === 'approuve' ? '✅ Validé' : '❌ Refusé'}
        </span>
        <span className="text-neutral-400" aria-hidden="true">·</span>
        <span className="font-semibold text-neutral-900">{decision.marque_nom}</span>
        <span className="text-neutral-400" aria-hidden="true">·</span>
        <span className="text-neutral-500">{date}</span>
      </div>
      {decision.statut === 'approuve' && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 body-small mt-1">
          {decision.titre && <span className="font-medium text-neutral-900">{decision.titre}</span>}
          {decision.titre && <span className="text-neutral-400" aria-hidden="true">·</span>}
          <Link href={`/marques/${slugify(decision.marque_nom)}`} className={lienClass}>
            Voir la fiche →
          </Link>
          {decision.reponse && (
            <>
              <span className="text-neutral-400" aria-hidden="true">·</span>
              <a href={decision.reponse} target="_blank" rel="noopener noreferrer" className={lienClass}>
                Réponse ↗
              </a>
            </>
          )}
        </div>
      )}
      {decision.statut === 'rejete' && decision.commentaire_admin && (
        <p className="body-small text-neutral-700 mt-1">
          <span className="font-medium">Justification :</span> {decision.commentaire_admin}
        </p>
      )}
    </div>
  );
}

export default function Moderation() {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const { decisions, loading, error } = useDecisions(limit, offset);

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const handleLoadPrevious = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 mb-6 tracking-tight">
            Modération et validation
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light">
            Comment les signalements sont relus, et les règles que nous appliquons
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Principe de modération */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
            {/* Header avec SVG et titre */}
            <div className="flex items-center mb-6">
              <div className="bg-info-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="heading-main text-neutral-900">Principe de modération</h2>
            </div>

            {/* Contenu texte */}
            <div>
              <p className="body-base font-light text-neutral-700 leading-snug mb-4">
                Chaque signalement est relu avant d&apos;être publié : rien n&apos;apparaît sur le site sans validation. Les décisions sont consultables plus bas sur cette page.
              </p>
              <p className="body-base font-light text-neutral-700 leading-snug">
                Les règles ci-dessous s&apos;appliquent à tout ce qui est publié, que l&apos;information vienne d&apos;un signalement ou de notre propre travail.
              </p>
            </div>
          </div>

          {/* Règles éditoriales */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
            <h2 className="heading-main text-neutral-900 mb-6">Nos règles</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold body-base text-neutral-900 mb-2">📰 Les faits</h3>
                <ul className="list-disc pl-5 text-neutral-700 space-y-2 body-base leading-snug">
                  <li>Un titre décrit un fait précis et daté, attribué à celui qui a agi : la marque, le groupe ou la personne.</li>
                  <li>Les mots qui supposent une décision de justice (condamnation, fraude, évasion fiscale, licenciement abusif…) ne sont employés que lorsqu&apos;une décision les prononce. Sinon, nous indiquons l&apos;étape exacte : plainte, enquête, mise en examen, renvoi en procès, condamnation en première instance… Toute personne est présumée innocente tant qu&apos;elle n&apos;a pas été définitivement condamnée.</li>
                  <li>Une accusation contestée est présentée comme telle (« Enquête de… », « Accusée de… »).</li>
                  <li>Quand l&apos;entreprise a répondu publiquement, sa réponse est affichée à côté de la source.</li>
                  <li>Le ton peut être engagé, jamais injurieux envers une personne.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold body-base text-neutral-900 mb-2">🔗 Les sources</h3>
                <ul className="list-disc pl-5 text-neutral-700 space-y-2 body-base leading-snug">
                  <li>Chaque controverse a une source, dont nous gardons une copie archivée.</li>
                  <li>Nous privilégions la source d&apos;origine (décision, rapport, étude), puis les médias et les ONG d&apos;enquête indépendants, puis la presse généraliste. Une source militante peut compléter, mais ne suffit pas seule à établir un fait grave.</li>
                  <li>Nous ne citons pas de média détenu par une personne ou un groupe présent sur le site.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold body-base text-neutral-900 mb-2">👥 Qui figure sur le site</h3>
                <ul className="list-disc pl-5 text-neutral-700 space-y-2 body-base leading-snug">
                  <li>Des marques disponibles en France et connues du grand public.</li>
                  <li>Un propriétaire ou un actionnaire n&apos;apparaît que s&apos;il fait l&apos;objet de controverses documentées : le but n&apos;est pas de recenser tous les actionnaires. Un gestionnaire de fonds n&apos;est rattaché à une marque que s&apos;il en détient plus de 5 %, d&apos;après les documents officiels de l&apos;entreprise.</li>
                  <li>Une controverse porte sur un acte précis de l&apos;entreprise ou de la personne, jamais sur une nationalité, une origine ou une religion.</li>
                  <li>Les personnes citées le sont pour des faits liés à leur rôle public. Leur vie privée n&apos;est évoquée que lorsqu&apos;elle rejoint ce rôle ou un débat d&apos;intérêt général.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold body-base text-neutral-900 mb-2">🏷️ Le classement</h3>
                <ul className="list-disc pl-5 text-neutral-700 space-y-2 body-base leading-snug">
                  <li>Les étiquettes désignent un domaine (environnement, conditions de travail…), pas un jugement sur l&apos;entreprise.</li>
                  <li>Les controverses sont classées par date, de la plus récente à la plus ancienne, et non par gravité.</li>
                </ul>
              </div>

              <p className="text-neutral-700 body-base leading-snug">
                Un signalement qui ne respecte pas ces règles est refusé : source absente ou douteuse, fait invérifiable, hors sujet, propos injurieux ou fondés sur une nationalité, une origine ou une religion.
              </p>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold body-base text-neutral-900 mb-2">🛠️ Les corrections</h3>
                <p className="text-neutral-700 body-base leading-snug">
                  Une information fausse ou dépassée est corrigée dès que nous en avons connaissance. Pour la signaler ou exercer un droit de réponse :{' '}
                  <Link href="/droit-de-reponse" className="text-secondary-dark hover:text-secondary-900 underline">Droit de réponse et corrections</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Historique des décisions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
            {/* Header avec SVG et titre */}
            <div className="flex items-center mb-6">
              <div className="bg-primary-50 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="heading-main text-neutral-900">Historique des décisions</h2>
            </div>

            {/* Contenu historique */}
            <div>
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-neutral-600">Chargement des décisions...</p>
                </div>
              )}

              {error && (
                <div className="bg-error-light border border-error-medium rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-error mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H4" />
                    </svg>
                    <div>
                      <p className="text-error font-medium">Erreur de chargement</p>
                      <p className="text-error body-small">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && decisions.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="heading-main text-neutral-900 mb-2">Aucune décision</h3>
                  <p className="text-neutral-600">Aucune décision de modération n&apos;a encore été rendue.</p>
                </div>
              )}

              {!loading && !error && decisions.length > 0 && (
                <>
                  <div className="space-y-2 mb-8">
                    {decisions.map((decision) => (
                      <DecisionCard key={decision.id} decision={decision} />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleLoadPrevious}
                      disabled={offset === 0}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Précédent
                    </button>

                    <span className="text-neutral-600 body-small">
                      Affichage {offset + 1} à {offset + decisions.length}
                    </span>

                    <button
                      onClick={handleLoadMore}
                      disabled={decisions.length < limit}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour aux questions fréquentes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}