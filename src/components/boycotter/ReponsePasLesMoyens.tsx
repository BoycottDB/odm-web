const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponsePasLesMoyens() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Boycotter ne veut pas forcément dire acheter plus cher : ça peut même faire économiser.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Boycotter, ce n&apos;est pas forcément remplacer</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Boycotter peut vouloir dire acheter ailleurs mais ça peut aussi dire acheter moins, ou ne plus acheter du tout. Avant un achat, demande-toi : « Ai-je vraiment besoin de ce produit aujourd&apos;hui ? ».<a href="/boycotter#produits-deja-achetes" target="_blank" rel="noopener noreferrer" className={lienClass}>Peut-être peux-tu faire avec ce que tu as déjà !</a>
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">La seconde main est souvent moins chère mais...</h4>
        <p className="body-base text-neutral-700 leading-snug">
          La seconde main est super pour l&apos;environnement et pour une économie circulaire au lieu de donner ton argent à une marque. Cela dit, porter un vêtement d&apos;une grande marque, même fripé, contribuera toujours à donner de la visibilité à la marque.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Petit à petit, produit par produit</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Commence par ce qui est le plus simple pour toi : un produit, une marque. Explore de nouvelles enseignes, compare et partage tes bons plans autour de toi. Le marché, l&apos;épicerie de quartier ou les producteurs locaux ne sont pas toujours plus chers qu&apos;on ne le croit.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Personne n&apos;a le couteau sous la gorge</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Le boycott n&apos;est jamais une obligation. Chacun·e fait selon ses moyens, son temps, ce qu&apos;iel trouve près de chez soi et ses propres valeurs, qui peuvent elles-mêmes évoluer avec le temps. Si tu continues d&apos;acheter certains produits parce que ton budget ne te laisse pas le choix, tu n&apos;as de comptes à rendre à personne.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          On peut d&apos;ailleurs consommer et quand même critiquer pour faire bouger les choses. Comme le dit très bien <a href="https://www.youtube.com/watch?v=Yc_DlyC4w_g&t=965s" target="_blank" rel="noopener noreferrer" className={lienClass}>cette directrice de recherche à la Sorbonne</a>, quand on n&apos;a pas beaucoup d&apos;argent, faire porter au consommateur la responsabilité du choix, « c&apos;est un petit peu gonflé ».
        </p>
      </div>
    </>
  );
}
