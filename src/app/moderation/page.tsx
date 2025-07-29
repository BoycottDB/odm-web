export default function Moderation() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
            Modération et validation
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            Transparence totale sur les décisions de validation et de refus
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Principe de modération */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Principe de modération</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Chaque ajout, correction ou suppression d&apos;entrée est soumis à validation par la communauté et la modération. Les décisions sont publiques, justifiées et consultables ici.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Cette transparence garantit la fiabilité des informations et permet à chacun de comprendre les critères de validation utilisés.
                </p>
              </div>
            </div>
          </div>

          {/* Critères de validation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Critères de validation</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">✅ Accepté si :</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Source fiable et vérifiable</li>
                      <li>• Information factuelle et datée</li>
                      <li>• Respect de la neutralité</li>
                      <li>• Pertinence pour les consommateurs</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">❌ Refusé si :</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Source douteuse ou inexistante</li>
                      <li>• Information non vérifiée</li>
                      <li>• Contenu partial ou militant</li>
                      <li>• Hors sujet ou non pertinent</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des décisions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des décisions</h2>
                
                {/* Note de développement */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-yellow-800 font-medium mb-1">Fonctionnalité en développement</p>
                      <p className="text-yellow-700 text-sm">
                        L&apos;affichage automatique des validations/refus d&apos;entrées sera bientôt disponible. En attendant, voici quelques exemples du type de décisions qui seront affichées.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exemples de décisions */}
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;REFUSÉ&quot;</span>
                        <span className="font-semibold text-gray-900">&quot;Ajout de &quot;Nike&quot;&quot;</span>
                      </div>
                      <span className="text-sm text-gray-500">30 juillet 2025</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Justification :</strong> Source insuffisante - L&apos;article fourni ne contient pas de preuves suffisantes pour étayer les allégations. Une source plus fiable et détaillée est nécessaire.&quot;
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Modérateur :</strong> @moderateur1 • <strong>Votes communauté :</strong> 3 pour, 7 contre
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;VALIDÉ&quot;</span>
                        <span className="font-semibold text-gray-900">&quot;Ajout de &quot;Nestlé&quot;&quot;</span>
                      </div>
                      <span className="text-sm text-gray-500">29 juillet 2025</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Justification :</strong> Source vérifiée - Article de presse fiable avec citations officielles et dates précises. L&apos;information est factuelle et pertinente pour les consommateurs.&quot;
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Modérateur :</strong> @moderateur2 • <strong>Votes communauté :</strong> 8 pour, 1 contre
                    </p>
                  </div>

                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;MODIFIÉ&quot;</span>
                        <span className="font-semibold text-gray-900">&quot;Correction &quot;Amazon&quot;&quot;</span>
                      </div>
                      <span className="text-sm text-gray-500">28 juillet 2025</span>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Justification :</strong> Date corrigée - La date de l&apos;incident a été mise à jour suite à la vérification de sources complémentaires. Description également précisée pour plus de clarté.&quot;
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Modérateur :</strong> @moderateur1 • <strong>Votes communauté :</strong> 6 pour, 0 contre
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment contribuer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment contribuer à la modération</h2>
                <p className="text-lg text-gray-700 mb-6">
                  La modération est un processus collaboratif. Voici comment vous pouvez participer :
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Proposer du contenu</h3>
                      <p className="text-gray-700">Soumettez vos contributions via GitHub avec des sources fiables et des informations vérifiées.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Participer aux votes</h3>
                      <p className="text-gray-700">Votez sur les propositions de la communauté en argumentant vos choix de manière constructive.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Signaler des problèmes</h3>
                      <p className="text-gray-700">Signalez les informations incorrectes ou les sources douteuses pour maintenir la qualité de la base de données.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Participer sur GitHub
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
