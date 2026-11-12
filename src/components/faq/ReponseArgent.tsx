import Link from 'next/link';

export default function ReponseArgent() {
  return (
    <>
      <div>
        <h4 className="body-large font-semibold text-neutral-900 mb-3">De l&apos;argent, mais pas seulement</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Quand tu achètes une marque, tu enrichis ceux qui la possèdent de deux façons. En argent : une partie de ce que tu paies remonte jusqu&apos;à eux. En poids : plus une marque vend, plus ses propriétaires gagnent en moyens et en influence.
        </p>
      </div>

      <div>
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Le poids et l&apos;influence</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Une entreprise qui vend bien a les moyens de racheter d&apos;autres marques, de financer du lobbying ou de peser dans le débat public. Un fonds qui possède une partie d&apos;une entreprise vote à ses assemblées et pèse sur ses choix. Tes achats renforcent tout ça.
        </p>
      </div>

      <div>
        <h4 className="body-large font-semibold text-neutral-900 mb-3">L&apos;argent : deux chemins principaux</h4>
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
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Combien, exactement ?</h4>
        <p className="body-base text-neutral-700 leading-snug">
          On ne le sait pas toujours : on ne connaît pas toujours la part exacte de chacun et une revente n&apos;est pas forcément gagnante. C&apos;est pour ça que les pages de marque disent qu&apos;une part de ton argent « peut » finir chez eux. Mais le principe reste le même : plus une marque vend, plus elle enrichit ceux qui la possèdent.
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
