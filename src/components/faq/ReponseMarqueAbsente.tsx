const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseMarqueAbsente() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Parce qu&apos;on ne peut pas tout couvrir d&apos;un coup : on commence par les marques disponibles en France et connues du grand public et la liste grandit au fil des signalements.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Une marque absente n&apos;est pas une marque « clean »</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Si une marque n&apos;apparaît pas, ça veut seulement dire qu&apos;on ne l&apos;a pas encore étudiée, ou qu&apos;on n&apos;a pas encore trouvé de controverse documentée. Une marque peut aussi <a href="/boycotter#alternatives" target="_blank" rel="noopener noreferrer" className={lienClass}>cacher son jeu</a>.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les mêmes règles pour toutes</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Même une marque réputée « éthique » a sa place sur le site si elle a une controverse documentée. Chaque controverse doit reposer sur une source et les entreprises peuvent y répondre grâce au <a href="/droit-de-reponse" target="_blank" rel="noopener noreferrer" className={lienClass}>droit de réponse</a>. Toutes les règles sont détaillées dans <a href="/faq/moderation" target="_blank" rel="noopener noreferrer" className={lienClass}>Comment sont modérés les signalements ?</a>.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">À toi de nous aider</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Tu connais une controverse sur une marque absente du site ? <a href="/signaler" target="_blank" rel="noopener noreferrer" className={lienClass}>Signale-la</a> : c&apos;est anonyme et chaque signalement est relu et publié s&apos;il respecte les règles de modération.
        </p>
      </div>
    </>
  );
}
