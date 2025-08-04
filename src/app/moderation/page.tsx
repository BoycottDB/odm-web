import Link from 'next/link';

export default function Moderation() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Modération et validation
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Transparence totale sur les décisions de validation et de refus
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Principe de modération */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-info-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Principe de modération</h2>
                <p className="body-large text-neutral-700 leading-relaxed mb-4">
                  Chaque ajout, correction ou suppression d&apos;entrée est soumis à validation par la communauté et la modération. Les décisions sont publiques, justifiées et consultables ici.
                </p>
                <p className="body-large text-neutral-700 leading-relaxed">
                  Cette transparence garantit la fiabilité des informations et permet à chacun de comprendre les critères de validation utilisés.
                </p>
              </div>
            </div>
          </div>

          {/* Critères de validation */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-success-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-6">Critères de validation</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-success pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">✅ Accepté si :</h3>
                    <ul className="text-neutral-700 space-y-2">
                      <li>• Source fiable et vérifiable</li>
                      <li>• Information factuelle et datée</li>
                      <li>• Respect de la neutralité</li>
                      <li>• Pertinence pour les consommateurs</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-error pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">❌ Refusé si :</h3>
                    <ul className="text-neutral-700 space-y-2">
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
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-primary-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-6">Historique des décisions</h2>
                
                {/* Note de développement */}
                <div className="bg-warning-light border border-warning rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-warning mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-warning font-medium mb-1">Fonctionnalité en développement</p>
                      <p className="text-warning body-small">
                        L&apos;affichage automatique des validations/refus d&apos;entrées sera bientôt disponible. En attendant, voici quelques exemples du type de décisions qui seront affichées.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exemples de décisions */}
                <div className="space-y-4">
                  <div className="border border-error rounded-lg p-4 bg-error-light">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-error-light text-error body-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;REFUSÉ&quot;</span>
                        <span className="font-semibold text-neutral-900">&quot;Controverse Nike - Conditions de travail&quot;</span>
                      </div>
                      <span className="body-small text-neutral-500">30 juillet 2025</span>
                    </div>
                    <p className="text-neutral-700 mb-2">
                      <strong>Justification :</strong> Source insuffisante - L&apos;article fourni ne contient pas de preuves suffisantes pour étayer les allégations concernant les conditions de travail. Une source plus fiable et détaillée est nécessaire.
                    </p>
                  </div>

                  <div className="border border-success rounded-lg p-4 bg-success-light">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-success-light text-success body-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;VALIDÉ&quot;</span>
                        <span className="font-semibold text-neutral-900">&quot;Controverse Nestlé - Gestion de l&apos;eau&quot;</span>
                      </div>
                      <span className="body-small text-neutral-500">29 juillet 2025</span>
                    </div>
                    <p className="text-neutral-700 mb-2">
                      <strong>Justification :</strong> Source vérifiée - Article de presse fiable avec citations officielles et dates précises concernant la gestion de l&apos;eau. L&apos;information est factuelle et pertinente pour les consommateurs.
                    </p>
                  </div>

                  <div className="border border-info rounded-lg p-4 bg-info-light">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="bg-info-light text-info body-xs font-medium px-2.5 py-0.5 rounded-full mr-3">&quot;MODIFIÉ&quot;</span>
                        <span className="font-semibold text-neutral-900">&quot;Controverse Amazon - Évasion fiscale&quot;</span>
                      </div>
                      <span className="body-small text-neutral-500">28 juillet 2025</span>
                    </div>
                    <p className="text-neutral-700 mb-2">
                      <strong>Justification :</strong> Date corrigée - La date de l&apos;incident d&apos;évasion fiscale a été mise à jour suite à la vérification de sources complémentaires. Description également précisée pour plus de clarté.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment contribuer */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8">
            <div className="flex items-start">
              <div className="bg-neutral-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Comment signaler</h2>
                <p className="body-large text-neutral-700 mb-6">
                  Vous souhaitez signaler une controverse ? Utilisez notre formulaire de signalement pour contribuer à la base de données.
                </p>
                <div className="bg-primary-light border border-primary rounded-lg p-6 mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Signaler une controverse</h3>
                      <p className="text-primary mb-4">
                        Utilisez notre formulaire pour signaler des controverses liées aux marques. Tous les signalements sont vérifiés et modérés de manière transparente.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/signaler"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Signaler une controverse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
