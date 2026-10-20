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
          Les lois changent plus vite quand le peuple est mobilisé et solidaire. Par exemple, le mouvement contre Nestlé et sa promotion du lait infantile a abouti à <a href="https://fr.wikipedia.org/wiki/Boycott_de_Nestl%C3%A9" target="_blank" rel="noopener noreferrer" className={lienClass}>l&apos;adoption du Code international de l&apos;OMS/UNICEF</a>. Ça ne fait pas de Nestlé une entreprise exemplaire, le site documente encore ses controverses, mais ça prouve qu&apos;un boycott peut provoquer une règlementation.
        </p>
      </div>

      <div className="border-l-2 border-neutral-200 pl-4">
        <h4 className="body-large font-semibold text-neutral-900 mb-3">Les États ne sont pas un rempart neutre</h4>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          En 2025, <a href="https://www.senat.fr/rap/r24-628-1/r24-628-1_mono.html" target="_blank" rel="noopener noreferrer" className={lienClass}>une commission d&apos;enquête du Sénat</a> a conclu que l&apos;État avait caché pendant plus de deux ans les traitements interdits des eaux minérales de Nestlé et que l&apos;Élysée savait « au moins depuis 2022 » que Nestlé « trichait depuis des années ».
        </p>
        <p className="body-base text-neutral-700 leading-snug mb-3">
          Et les grands acteurs économiques savent se faire entendre : en 2019, en pleine préparation de la réforme des retraites, BlackRock <a href="https://web.archive.org/web/20210114234442/https://www.blackrock.com/fr/intermediaries/themes/retirement/blackrock-retirement-recommendations" target="_blank" rel="noopener noreferrer" className={lienClass}>faisait du lobbying auprès du gouvernement</a> pour que les salariés soient inscrits automatiquement à une épargne-retraite placée sur les marchés financiers.
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
