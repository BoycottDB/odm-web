import Link from 'next/link';

export default function EfficaciteFAQ() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-hero py-10 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Pourquoi on y croit ?
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug">
            Une réponse à celles et ceux qui, comme nous l&apos;avons été, se sentent dépassé·e·s face aux pouvoirs des sociétés que nous dénonçons.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none space-y-8">

              <div>
                <h2 className="heading-main font-bold text-neutral-900 mb-4">&quot;À quoi bon ?&quot;</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  On comprend ce sentiment. Face aux multinationales qui écrasent tout sur leur passage, il est tentant de baisser les bras. Pourtant, les entreprises nous entendent plus qu&apos;on ne le pense et elles surveillent de très près l&apos;opinion publique au regard de l&apos;évolution de leurs ventes.
                </p>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="body-large font-semibold text-neutral-900 mb-3">Des exemples de mobilisations réussies</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Les histoires connues de pressions qui ont changé la donne :</h4>
                      <div className="space-y-2 ml-4">
                        <p className="body-base text-neutral-700 leading-snug">
                          <strong>🚌 Les bus de Montgomery en soutien à Rosa Parks :</strong> le boycott des transports publics a abouti à <a href="https://fr.wikipedia.org/wiki/Boycott_des_bus_de_Montgomery" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-dark-hover underline">l&apos;abolition de la ségrégation raciale dans les transports</a>.
                        </p>
                        <p className="body-base text-neutral-700 leading-snug">
                          <strong>🍼 Nestlé :</strong> Le mouvement pour dénoncer les dangers du lait infantile a abouti à <a href="https://fr.wikipedia.org/wiki/Boycott_de_Nestl%C3%A9" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-dark-hover underline">l&apos;adoption du Code international de l&apos;OMS/UNICEF</a> ainsi qu&apos;à l&apos;engagement officiel de Nestlé à le respecter.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">L&apos;émergence d&apos;alternatives grâce aux boycotts :</h4>
                      <div className="space-y-2 ml-4">
                        <p className="body-base text-neutral-700 leading-snug">
                          <strong>🆇 Twitter :</strong> Les utilisateurs ont commencé à migrer vers des alternatives comme <a href="https://kulturegeek.fr/news-322213/bluesky-nombre-dutilisateurs-augmenter-763-2024" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-dark-hover underline">BlueSky qui a vu son nombre d&apos;utilisateurs augmenter de 763% en 2024</a>.
                        </p>
                        <p className="body-base text-neutral-700 leading-snug">
                          <strong>🥤 Coca-Cola :</strong> Le boycott a permis de lancer ou relancer des marques locales comme <a href="https://atmos.earth/meet-the-palestinian-cola-brands-taking-on-coke/" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-dark-hover underline">Chat Cola en Cisjordanie</a> et <a href="https://agencemediapalestine.fr/blog/2024/02/09/guerre-israelienne-a-gaza-le-boycott-fait-il-du-tort-aux-marques-etats-uniennes/" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-secondary-dark-hover underline">Spiro Spathis en Égypte</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-warning pl-6">
                  <h3 className="body-large font-semibold text-neutral-900 mb-3">Sans action, le cercle vicieux se maintient</h3>
                  <p className="body-base text-neutral-700 leading-snug mb-3">
                    Si personne n&apos;agit, on continue d&apos;enrichir des entreprises qui :
                  </p>
                  <ul className="text-neutral-700 space-y-2 ml-4">
                    <li>• Écrasent la concurrence des petits producteurs responsables</li>
                    <li>• Mettent parfois en danger notre planète et nos vies à travers leurs agissements controversés</li>
                    <li>• Concentrent toujours de plus en plus de pouvoir économique</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 bg-secondary-light border border-secondary rounded-xl p-8">
                <h3 className="body-large font-bold text-neutral-900 mb-4">🙏 Notre utopie : libérer l&apos;économie des gens d&apos;en bas</h3>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  Chaque euro que tu ne donnes pas à une multinationale peut aller à un producteur local, un artisan, un créateur éthique.
                </p>
                <p className="body-base text-neutral-700 leading-snug mb-4">
                  On aurait alors un monde plus juste pour vous et nous. Un monde dans lequel on récompenserait les plus responsables et non les moins, ceux qui agissent pour le collectif et non pour leur intérêt personnel. Un monde dans lequel nos consommations favoriseraient la vie plutôt que les profits.
                </p>
                <div className="bg-white rounded-lg p-4 border border-neutral-200">
                  <p className="body-base text-neutral-700">
                    Nous avons pourtant fait le choix de ne pas proposer d&apos;alternatives sur le site pour le moment.
                  </p>
                  <Link 
                    href="/faq/alternatives"
                    className="inline-flex items-center gap-1 text-secondary-dark hover:text-secondary-dark-hover font-medium mt-2 text-sm"
                  >
                    En savoir plus sur notre position sur les alternatives
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="mt-8 bg-accent-light border border-accent rounded-xl p-6">
                <p className="body-base text-neutral-900 font-medium text-center">
                  Donc ne lâche pas, ce monde a besoin de toi 🫶
                </p>
              </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
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