import GalerieImages from '@/components/ui/GalerieImages';

const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

const PHOTOS_LOGO_DECOUSU = ['/Decat1.webp', '/Decat2.webp', '/Decat3.webp'];

export default function ReponseProduitsDejaAchetes() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Garde-les ! Le boycott porte sur tes prochains achats, pas sur ce que tu possèdes déjà.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Ne jette rien</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Jeter ou brûler ce que tu as déjà ne ferait de mal qu&apos;à la planète et à ton portefeuille : la marque, elle, a déjà été payée. Au contraire, fais-les durer le plus longtemps possible.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Répare plutôt que racheter</h4>
        <p className="body-base text-neutral-700 leading-snug">
          L&apos;État propose un <a href="https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/bonus-reparation-comment-ca-marche" target="_blank" rel="noopener noreferrer" className={lienClass}>bonus réparation</a> qui te donne une réduction quand tu fais réparer un vêtement, une paire de chaussures ou certains appareils chez un réparateur agréé. Tu peux bien entendu aussi le faire toi-même, c&apos;est encore plus satisfaisant !
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Lance la tendance « unbranded »</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Dès lors que tu portes un logo, tu fais consciemment ou non de la pub gratuite à la marque. Alors pourquoi ne pas lancer la tendance « unbranded » en retirant les logos ou en ajoutant un patch par dessus ?
        </p>
        <GalerieImages images={PHOTOS_LOGO_DECOUSU} alt="Logo Decathlon décousu d'un pantalon" />
      </div>
    </>
  );
}
