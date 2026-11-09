const lienClass = 'text-secondary-dark hover:text-secondary-900 underline';

export default function ReponseEtats() {
  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Les deux ne s&apos;opposent pas, au contraire : les États ont besoin d&apos;être poussés.
      </p>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Qu&apos;on le veuille ou non, on alimente le système</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Chaque fois qu&apos;on achète, on enrichit quelqu&apos;un. Ce n&apos;est pas une question de culpabilité, c&apos;est un constat. En attendant que la loi change, notre argent continue d&apos;enrichir les mêmes bénéficiaires.
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          On vote tous les cinq ans, mais on achète tous les jours.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les lois bougent quand on se mobilise</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Les lois changent plus vite quand le peuple est mobilisé et solidaire. Par exemple, le mouvement contre Nestlé et sa promotion du lait infantile a contribué à <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8139375/" target="_blank" rel="noopener noreferrer" className={lienClass}>l&apos;adoption du Code international de l&apos;OMS/UNICEF</a> en 1981. Ça ne fait pas de Nestlé une entreprise exemplaire, le site documente encore ses controverses, mais ça prouve qu&apos;un boycott peut faire bouger la règlementation.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les États ne sont pas un rempart neutre</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          L&apos;État ne s&apos;est pas toujours donné les moyens de contrôler : après la crise du lait infantile Lactalis contaminé aux salmonelles (38 bébés malades en France), <a href="https://www.assemblee-nationale.fr/dyn/15/rapports/celact/l15b1179-ti_rapport-enquete.pdf" target="_blank" rel="noopener noreferrer" className={lienClass}>une commission d&apos;enquête de l&apos;Assemblée nationale</a> a jugé en 2018 les contrôles de l&apos;État sur l&apos;usine « manifestement insuffisants » : en Mayenne, un seul agent suivait toutes les installations laitières du département.
        </p>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Pire : en 2025, <a href="https://www.senat.fr/rap/r24-628-1/r24-628-1_mono.html" target="_blank" rel="noopener noreferrer" className={lienClass}>une commission d&apos;enquête du Sénat</a> a conclu que l&apos;État avait caché pendant plus de deux ans les traitements interdits des eaux minérales de Nestlé et que l&apos;Élysée savait « au moins depuis 2022 » que Nestlé « trichait depuis des années ».
        </p>
        <p className="body-base text-neutral-700 leading-snug">
          Attendre que l&apos;État fasse tout le travail, ce serait oublier qu&apos;il s&apos;accommode très bien du système actuel.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Un levier parmi d&apos;autres</h4>
        <p className="body-base text-neutral-700 leading-snug">
          Le boycott ne remplace ni la loi, ni les syndicats, ni les associations : il les complète. C&apos;est juste l&apos;un des rares leviers que chacun peut utiliser tous les jours à son échelle.
        </p>
      </div>
    </>
  );
}
