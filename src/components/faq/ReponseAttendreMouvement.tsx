const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseAttendreMouvement() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Un mouvement commence toujours par quelques personnes : pourquoi pas toi ?
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">N&apos;attends pas que les autres s&apos;y mettent</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Pas besoin d&apos;attendre qu&apos;un grand mouvement de boycott soit lancé pour commencer. Le boycott commence par une question toute simple, avant chaque achat : « Est-ce que je veux vraiment donner mon euro à cette entreprise ? ». Peu importe ce que font les autres : c&apos;est d&apos;abord une question de cohérence avec toi-même, pour être droit·e dans tes bottes.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Attendre, c&apos;est continuer à enrichir</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Si chacun attend que les autres commencent, personne ne commence. Et pendant ce temps, notre argent continue d&apos;enrichir des entreprises qui étouffent la concurrence des petits producteurs responsables, concentrent toujours plus de pouvoir économique et, pour certaines, mettent en danger notre planète et nos vies par leurs agissements controversés.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Et pas besoin que tout le monde s&apos;y mette pour que <a href="/faq#a-quoi-ca-sert" target="_blank" rel="noopener noreferrer" className={lienClass}>les marques le sentent</a>.
        </p>
      </div>
    </>
  );
}
