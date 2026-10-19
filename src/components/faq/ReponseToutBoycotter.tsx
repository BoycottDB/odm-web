const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseToutBoycotter() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Personne ne te demande de tout boycotter, ni d&apos;être irréprochable : la consommation parfaite n&apos;existe pas (<a href="/faq#iphone" target="_blank" rel="noopener noreferrer" className={lienClass}>Tu boycottes, mais tu as un iPhone !</a>).
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les marques de ton magasin ne sont pas représentatives de toutes les marques</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Un magasin ne peut pas tout proposer. Il garde en rayon ce qui se vend le mieux, et les grands fournisseurs paient pour être mis en avant : têtes de gondole, promotions, catalogues. Les marques aux plus gros budgets prennent donc la place. Pourtant, rien qu&apos;en 2025, plus de 100 000 demandes de marques ont été déposées en France. Derrière, il y a des artisans, des petites entreprises, des créateurs… et peut-être bientôt toi (<a href="/faq#proposer-des-alternatives" target="_blank" rel="noopener noreferrer" className={lienClass}>Comment pourrait-on proposer des alternatives ?</a>).
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          C&apos;est justement là que le boycott agit : ce qui ne se vend plus finit par quitter les rayons, et laisse la place à autre chose.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Le boycott sera toujours subjectif</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Une marque irréprochable aujourd&apos;hui peut ne plus l&apos;être demain. Chaque marque du site a des controverses différentes : c&apos;est à toi de juger lesquelles comptent le plus pour toi, et lesquelles tu pardonnes, parce que le fait est ancien ou que la marque a changé depuis. C&apos;est pour cela que nous les classons par date, et non par gravité.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Boycotter, ce n&apos;est pas forcément remplacer</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Boycotter peut vouloir dire acheter ailleurs, mais aussi acheter moins, ou ne plus acheter du tout. Pour ce que tu possèdes déjà : <a href="/faq#produits-deja-achetes" target="_blank" rel="noopener noreferrer" className={lienClass}>J&apos;ai déjà des produits de ces marques, que faire ?</a>. Pour le budget : <a href="/faq#pas-les-moyens" target="_blank" rel="noopener noreferrer" className={lienClass}>Je n&apos;ai pas les moyens d&apos;acheter éthique</a>.
        </p>
      </div>
    </>
  );
}
