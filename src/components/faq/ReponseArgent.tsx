import Link from 'next/link';

export default function ReponseArgent() {
  return (
    <>
      <div>
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Il y a deux chemins principaux</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Une marque appartient à une ou plusieurs entreprises, qui appartiennent elles-mêmes à d&apos;autres entreprises ou à des personnes. Quand tu achètes, l&apos;argent remonte cette chaîne de deux façons.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">1. Les dividendes : chaque année, directement</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Les grandes entreprises qui font des bénéfices en reversent une partie à leurs propriétaires. Quand tu achètes du Nesquik, une part du bénéfice de Nestlé est versée chaque année à ses actionnaires.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">2. La revente : plus tard, à la sortie</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Les jeunes marques versent rarement des dividendes. Elles réinvestissent tout pour grandir. Mais plus elles vendent, plus elles prennent de la valeur. Quand un investisseur revend sa part, il empoche la différence. Si cet investisseur est un fonds, il partage ce gain avec ceux qui lui ont confié de l&apos;argent.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Pourquoi « peut » ?</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Parce qu&apos;on ne connaît pas toujours la part exacte de chacun et qu&apos;une revente n&apos;est pas toujours gagnante. Mais le principe est toujours le même : plus une marque vend, plus elle enrichit ceux qui la possèdent.
        </p>
      </div>

      <div className="bg-secondary-light border border-secondary rounded-xl p-4 md:p-5">
        <p className="body-base text-neutral-700 leading-snug">
          Les propriétaires d&apos;une marque changent parfois. Si tu constates qu&apos;une information n&apos;est plus à jour, par exemple après une revente, n&apos;hésite pas à nous le signaler.
        </p>
        <Link
          href="/signaler"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-secondary-dark hover:text-secondary-900 font-medium mt-2 text-sm"
        >
          Signaler une correction
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
}
