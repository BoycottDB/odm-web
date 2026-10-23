const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseAutresSources() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Ici, on suit l&apos;argent de tes achats : les marques et ceux qui en profitent. Pour le reste, d&apos;autres font très bien le boulot.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les condamnations de personnalités politiques</h4>
        <p className="body-base text-neutral-700 leading-snug">
          <a href="https://casier-politique.fr/" target="_blank" rel="noopener noreferrer" className={lienClass}>Casier Politique</a> recense les personnalités politiques condamnées par la justice, par parti et par type d&apos;infraction. C&apos;est un projet citoyen indépendant du nôtre, construit à partir de Wikipédia (pense donc à remonter jusqu&apos;aux sources).
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">L&apos;influence des multinationales</h4>
        <p className="body-base text-neutral-700 leading-snug">
          L&apos;<a href="https://multinationales.org/fr/" target="_blank" rel="noopener noreferrer" className={lienClass}>Observatoire des multinationales</a> enquête sur le pouvoir des grandes entreprises, leur lobbying et leurs liens avec l&apos;État. On cite souvent leurs enquêtes comme sources sur le site.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">La cartographie des propriétaires des médias</h4>
        <p className="body-base text-neutral-700 leading-snug">
          La carte <a href="https://www.acrimed.org/Medias-francais-qui-possede-quoi" target="_blank" rel="noopener noreferrer" className={lienClass}>Médias français : qui possède quoi ?</a> d&apos;Acrimed et du Monde diplomatique montre quels milliardaires et quels groupes possèdent les principaux médias. Pratique pour savoir qui se cache derrière ce que tu lis, regardes ou écoutes.
        </p>
      </div>
    </>
  );
}
