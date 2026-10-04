import Link from 'next/link';

export default function ArgentFAQ() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-hero py-10 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Comment l&apos;argent circule ?
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug">
            Comment l&apos;argent de vos achats peut-il arriver jusqu&apos;aux personnes et aux groupes présentés sur les fiches des marques ?
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="prose prose-lg max-w-none space-y-8">

              <div>
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Il y a deux chemins principaux</h2>
                <p className="body-base text-neutral-700 leading-snug">
                  Une marque appartient à une ou plusieurs entreprises, qui appartiennent elles-mêmes à d&apos;autres entreprises ou à des personnes. Quand vous achetez, l&apos;argent remonte cette chaîne de deux façons.
                </p>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="body-large font-semibold text-neutral-900 mb-3">1. Les dividendes : chaque année, directement</h3>
                <p className="body-base text-neutral-700 leading-snug">
                  Les grandes entreprises qui font des bénéfices en reversent une partie à leurs propriétaires. Quand vous achetez du Nesquik, une part du bénéfice de Nestlé est versée chaque année à ses actionnaires.
                </p>
              </div>

              <div className="border-l-4 border-success pl-6">
                <h3 className="body-large font-semibold text-neutral-900 mb-3">2. La revente : plus tard, à la sortie</h3>
                <p className="body-base text-neutral-700 leading-snug">
                  Les jeunes marques versent rarement des dividendes. Elles réinvestissent tout pour grandir. Mais plus elles vendent, plus elles prennent de la valeur. Quand un investisseur revend sa part, il empoche la différence. Si cet investisseur est un fonds, il partage ce gain avec ceux qui lui ont confié de l&apos;argent.
                </p>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h3 className="body-large font-semibold text-neutral-900 mb-3">Pourquoi « peut » ?</h3>
                <p className="body-base text-neutral-700 leading-snug">
                  Parce qu&apos;on ne connaît pas toujours la part exacte de chacun, et qu&apos;une revente n&apos;est pas toujours gagnante. Mais le principe est toujours le même : plus une marque vend, plus elle enrichit ceux qui la possèdent.
                </p>
              </div>

              <div className="mt-10 bg-secondary-light border border-secondary rounded-xl p-8">
                <p className="body-base text-neutral-700 leading-snug">
                  Les propriétaires d&apos;une marque changent parfois. Si vous constatez qu&apos;une information n&apos;est plus à jour, par exemple après une revente, n&apos;hésitez pas à nous le signaler.
                </p>
                <Link
                  href="/signaler"
                  className="inline-flex items-center gap-1 text-secondary-dark hover:text-secondary-dark-hover font-medium mt-2 text-sm"
                >
                  Signaler une correction
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

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
