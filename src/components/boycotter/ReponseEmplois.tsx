const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseEmplois() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Ce n&apos;est pas toi qui licencies : c&apos;est l&apos;entreprise qui décide et elle a bien d&apos;autres options avant d&apos;en arriver là.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">On ne vise pas les salariés</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Le site parle des bénéficiaires, pas des gens qui travaillent pour eux. Il y a de très bonnes personnes qui font un excellent travail dans certaines de ces entreprises.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Parfois sans savoir où va l&apos;argent, quand il remonte par de <a href="/faq#argent" target="_blank" rel="noopener noreferrer" className={lienClass}>longues chaînes de holdings</a> ; parfois sans savoir que leur patron est controversé ; parfois en le sachant très bien et en essayant de faire bouger les lignes de l&apos;intérieur.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Licencier est un choix</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Quand une marque vend moins, elle a beaucoup de leviers avant de licencier : verser moins de dividendes à ses actionnaires, revoir la rémunération de ses dirigeants, ses prix ou ses investissements. Si elle choisit de licencier, la responsabilité revient à ceux qui prennent cette décision, pas aux personnes qui n&apos;achètent pas ses produits, que ce soit pour raison de boycott intentionnel ou simplement qu&apos;elles s&apos;en foutent de ces produits.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Ça peut bénéficier à d&apos;autres</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Si tu achètes une alternative, tu finances un artisan, un petit commerce, un concurrent qui là aussi fait travailler des gens. Si une marque perd des clients, c&apos;est souvent qu&apos;une autre en gagne : c&apos;est aussi un débouché pour ses salariés.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Boycotter, c&apos;est aussi penser aux travailleurs</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Beaucoup de controverses du site concernent justement les conditions de travail : salaires, sécurité, droit syndical, travail des enfants chez les fournisseurs. Le boycott ne règle pas tout, mais il évite d&apos;enrichir ceux qui profitent sur le dos des travailleurs et travailleuses.
        </p>
      </div>
    </>
  );
}
