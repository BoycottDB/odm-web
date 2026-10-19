const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponsePasLesMoyens() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Boycotter ne veut pas forcément dire acheter plus cher : ça peut même faire économiser.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Personne n&apos;a le couteau sous la gorge</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Le boycott n&apos;est jamais une obligation. Chacun·e fait selon ses moyens, son temps, ce qu&apos;iel trouve près de chez soi et ses propres valeurs, qui peuvent elles-mêmes évoluer avec le temps. Si tu continues d&apos;acheter certains produits parce que ton budget ne te laisse pas le choix, tu n&apos;as de comptes à rendre à personne.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Comme le dit une chercheuse <a href="https://www.youtube.com/watch?v=Yc_DlyC4w_g&t=965s" target="_blank" rel="noopener noreferrer" className={lienClass}>interrogée par Sept à Huit</a>, quand on n&apos;a pas beaucoup d&apos;argent, faire porter au consommateur la responsabilité du choix, « c&apos;est un petit peu gonflé ».
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Boycotter peut faire économiser</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Acheter moins ou ne plus acheter, c&apos;est aussi de l&apos;argent économisé. Avant un achat, demande-toi : « Ai-je vraiment besoin de ce produit aujourd&apos;hui ? ». Et quand on paie une grande marque, on paie aussi son nom et sa pub.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Petit à petit, produit par produit</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Commence par ce qui est le plus simple pour toi : un produit, une marque. Explore de nouvelles enseignes, compare, et partage tes bons plans autour de toi. Le marché, l&apos;épicerie de quartier ou les producteurs locaux ne sont pas toujours plus chers qu&apos;on ne le croit.
        </p>
      </div>
    </>
  );
}
