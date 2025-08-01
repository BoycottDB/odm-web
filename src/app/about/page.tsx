export default function About() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
            À propos du projet
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            Découvrez notre mission, nos valeurs et notre fonctionnement
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Ce répertoire vous aide à prendre des décisions d&apos;achat éclairées et responsables en vous informant sur les pratiques éthiques, sociales et environnementales des marques. Notre application vous accompagne tout au long de votre parcours d&apos;achat, en vous fournissant des informations factuelles et vérifiées, issues d&apos;une base de données collaborative alimentée par des utilisateurs comme vous.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Nous ne vous empêcherons jamais de passer commande. Nous comprenons que pour de nombreuses raisons, notamment pour les produits de première nécessité, vous pouvez être amenés à acheter des produits de marques dont les pratiques ne sont pas parfaitement alignées avec vos valeurs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Notre rôle est simplement de vous permettre d&apos;effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement à vous fournir les informations nécessaires pour décider librement.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Nous croyons au pouvoir du boycott.</strong> En choisissant de ne plus financer certaines entreprises ou dirigeants dont les pratiques vont à l&apos;encontre de nos valeurs, nous pouvons collectivement réduire leur pouvoir économique et les inciter au changement. Le boycott est un acte démocratique puissant qui permet aux citoyens de faire entendre leur voix par leur portefeuille, en soutenant les entreprises responsables et en sanctionnant celles qui ne le sont pas.
                </p>
              </div>
            </div>
          </div>

          {/* Valeurs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos valeurs fondamentales</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Transparence totale</h3>
                    <p className="text-gray-700">Toutes les décisions (ajout ou refus d&apos;une marque) sont publiques et argumentées. Nous accordons une grande importance à la transparence : toutes les décisions relatives à l&apos;ajout ou au refus d&apos;une marque dans notre base de données sont publiquement accessibles, avec un historique clair et des motifs argumentés.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Collaboration communautaire</h3>
                    <p className="text-gray-700">Contribution ouverte à tous, avec validation par modération communautaire stricte. Chacun peut proposer, corriger ou enrichir les données dans le respect mutuel.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Neutralité et responsabilité</h3>
                    <p className="text-gray-700">Information claire sans jugement moral ; chaque utilisateur reste libre de son choix. Aucune promotion ou attaque, uniquement des faits vérifiés et sourcés.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Non lucratif</h3>
                    <p className="text-gray-700">Projet open source, sans publicité ni partenariat commercial. Seuls les dons éventuels serviront à couvrir les frais d&apos;hébergement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fonctionnement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment ça fonctionne</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Base de données collaborative</h3>
                      <p className="text-gray-700">Stockée dans un dépôt Git public (GitHub/GitLab). Contributions via merge requests, modération transparente, historique clair et accessible.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Workflow de contribution</h3>
                      <p className="text-gray-700">Fork du dépôt → Création d&apos;une merge request → Validation (ou refus justifié) par la communauté → Historique public et argumenté.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Modération transparente</h3>
                      <p className="text-gray-700">Chaque validation ou refus est justifié publiquement dans un onglet dédié. Les débats et contributions doivent rester courtois et argumentés.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandation seconde main */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Notre recommandation : privilégier la seconde main</h3>
                <p className="text-green-800">
                  Lorsque cela est possible, nous vous encourageons à privilégier l&apos;achat de produits de seconde main, afin de limiter votre impact environnemental et d&apos;éviter de financer directement des entreprises dont vous ne partagez pas les valeurs. Gardez cependant à l&apos;esprit que l&apos;achat en seconde main maintient indirectement la visibilité de ces marques : faites-le donc en connaissance de cause, avec discernement.
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact et contribution</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Pour toute question, suggestion ou pour contribuer au projet, plusieurs options s&apos;offrent à vous :
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Contribuer sur GitHub
                  </a>
                  <a 
                    href="https://github.com/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ouvrir une issue
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
