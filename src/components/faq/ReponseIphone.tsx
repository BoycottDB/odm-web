const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseIphone() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Personne n&apos;est parfait, et tout boycott compte, même incomplet.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Tout boycott compte</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          On ne peut pas réduire tout l&apos;engagement d&apos;une personne à un seul achat.
        </p>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Imagine qu&apos;il y ait 100 marques à boycotter, dont l&apos;iPhone. Quelqu&apos;un qui boycotte les 99 autres, c&apos;est déjà énorme. Et quelqu&apos;un qui n&apos;en boycotte qu&apos;une seule, c&apos;est un bon début, qu&apos;il pourra poursuivre avec d&apos;autres marques. On ne peut pas juger quelqu&apos;un à l&apos;instant T.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Et ce qui compte au final, c&apos;est la somme : 99 personnes qui boycottent chacune une marque pèsent autant qu&apos;une seule personne qui en boycotte 99. On ne peut pas être parfait, mais on peut être moins pire.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Un smartphone, ce n&apos;est pas un achat comme les autres</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Aujourd&apos;hui, on est une grande majorité à avoir besoin d&apos;un smartphone pour vivre ou travailler. Et on peut tout à fait s&apos;en servir pour militer, que ce soit pour le boycott ou pour d&apos;autres combats.
        </p>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          <a href="/faq#produits-deja-achetes" target="_blank" rel="noopener noreferrer" className={lienClass}>Le boycott porte sur tes prochains achats</a> : garder ton téléphone le plus longtemps possible, c&apos;est même déjà moins d&apos;argent pour la marque. Et puis, ce téléphone a peut-être été légué, ou acheté reconditionné.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          <a href="/faq#alternatives" target="_blank" rel="noopener noreferrer" className={lienClass}>Des alternatives existent</a>, mais elles restent peu connues du grand public. Personnellement, j&apos;ai un Fairphone qui, sur le papier et à l&apos;heure où j&apos;écris ces lignes, est une bonne alternative.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">« Tu boycottes seulement ce que tu n&apos;achetais déjà pas »</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Celle-là, on l&apos;entend surtout entre inconnus sur les réseaux sociaux. Elle ne dit rien de ce que fait vraiment l&apos;autre : elle sert surtout à clore le débat, en l&apos;obligeant à se justifier.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Et quand bien même : on commence toujours par le plus facile. Ne pas acheter ce qu&apos;on n&apos;achetait pas, ce n&apos;est pas rien non plus. On ne s&apos;y mettra pas plus tard, on n&apos;en offrira pas, et on en parle autour de soi.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Le combat n&apos;est pas entre nous</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Certains découvrent tout juste qui leurs achats enrichissent, d&apos;autres creusent le sujet depuis des années. Et l&apos;apprentissage ne s&apos;arrête jamais : il faut sans cesse rester à la page des actions des marques et des alternatives. Alors reprocher à quelqu&apos;un ce qu&apos;on ignorait soi-même la veille, n&apos;est-ce pas un peu mesquin ?
        </p>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Changer ses habitudes ne se fait pas du jour au lendemain. On ne demande pas à quelqu&apos;un qui apprend à nager de suivre le programme d&apos;entraînement de Michael Phelps : on risquerait de le dégoûter, voire de le mettre en danger.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Se reprocher nos achats les uns aux autres ne touche aucune marque, et divise ceux qui pourraient agir ensemble. On a mieux à faire que de s&apos;alpaguer : sensibiliser, et être solidaires dans la recherche d&apos;alternatives.
        </p>
      </div>
    </>
  );
}
