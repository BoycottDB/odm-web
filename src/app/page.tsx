import Link from 'next/link';
import { Download, Search, AlertTriangle, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            L&apos;Observatoire des Marques
          </h1>
          <p className="heading-sub font-light text-neutral-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Une plateforme collaborative pour documenter les controverses des marques et encourager une consommation éthique et responsable
          </p>

          <div className="space-y-8 md:space-y-16">
            {/* Extension navigateur */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="order-2 lg:order-1 bg-gradient-to-br from-berry-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/Nt6Zju-KjTsAAAAC/luffy-one-piece.gif" 
                  alt="Extension en action" 
                  className="w-full h-24 md:h-32 lg:h-48 object-cover rounded-lg mb-2 md:mb-4"
                />
                <p className="text-sm md:text-base text-neutral-600">
                  Extension en action sur site e-commerce
                </p>
              </div>
              <div className="order-1 lg:order-2 text-left">
                <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
                    <Globe className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
                    Extension navigateur
                  </h3>
                </div>
                <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
                  Notre extension détecte automatiquement les marques controversées dans vos parcours d&apos;achat en ligne afin de vous aider à consommer de manière éclairée et responsable.
                </p>
                <div className="flex justify-start md:justify-start">
                  <Link 
                    href="https://chrome.google.com/webstore" 
                    className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors text-sm md:text-base"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Installer l&apos;extension
                  </Link>
                </div>
              </div>
            </div>

            {/* Recherche rapide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="text-left">
                <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
                    <Search className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
                    Explorez les données
                  </h3>
                </div>
                <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
                  Pour chaque marque, nous mentionnons ses diverses controverses en précisant s&apos;il y a eu condamnations juridiques et/ou réponses officielle de la marque. Une marque peut aussi être référencée pour les faits de ses dirigeants.
                </p>
                <div className="flex justify-start md:justify-start">
                  <Link 
                    href="/recherche" 
                    className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors text-sm md:text-base"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Rechercher une marque
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-berry-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/j6hODwAA_VQAAAAd/fat-luffy-fat-luffy-rubbing-belly.gif" 
                  alt="Interface de recherche" 
                  className="w-full h-24 md:h-32 lg:h-48 object-cover rounded-lg mb-2 md:mb-4"
                />
                <p className="text-sm md:text-base text-neutral-600">
                  Interface de recherche avec suggestions
                </p>
              </div>
            </div>

            {/* Signalement facile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="order-2 lg:order-1 bg-gradient-to-br from-berry-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/qanLZ89oReAAAAAC/gear-5-gear-5-luffy.gif" 
                  alt="Processus de signalement" 
                  className="w-full h-24 md:h-32 lg:h-48 object-cover rounded-lg mb-2 md:mb-4"
                />
                <p className="text-sm md:text-base text-neutral-600">
                  Processus de signalement collaboratif
                </p>
              </div>
              <div className="order-1 lg:order-2 text-left">
                <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
                    <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
                    Signalement collaboratif
                  </h3>
                </div>
                <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
                  Participez à notre démarche collaborative en signalant de nouvelles controverses. 
                  Processus simplifié avec vérification de sources, modération transparente par la communauté 
                  et historique public de toutes les décisions.
                </p>
                <div className="flex justify-start md:justify-start">
                  <Link 
                    href="/signaler" 
                    className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors text-sm md:text-base"
                  >
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Signaler une controverse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi ce projet */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="heading-main text-neutral-900 mb-8">
            Pourquoi ce projet ?
          </h2>
          <div className="prose prose-lg max-w-none text-neutral-700 space-y-6">
            <p className="body-large font-light">
              <strong className="text-neutral-900">Nous croyons au pouvoir du boycott</strong> comme acte démocratique puissant. 
              En choisissant de ne plus financer des entreprises dont les pratiques vont à l&apos;encontre de nos valeurs, nous pouvons collectivement réduire leur pouvoir économique et les inciter au changement.
            </p>
            <p className="body-large font-light">
              Notre rôle est de vous permettre d&apos;effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. 
              Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement 
              à centraliser des informations factuelles et vérifiées pour vous aider à décider librement.
            </p>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="section-padding bg-gradient-to-br from-berry-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-main text-neutral-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="heading-sub font-light text-neutral-700">
              En 3 étapes simples pour une consommation éclairée
            </p>
          </div>

          <div className="space-y-6 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
            {/* Étape 1 */}
            <div className="flex items-start md:flex-col md:text-center space-x-4">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-berry-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold flex-shrink-0 md:mx-auto md:mb-6">
                1
              </div>
              <div className="flex-1 md:flex-none">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2 md:mb-4">
                  Identifiez
                </h3>
                <p className="text-sm md:text-base font-light text-neutral-700 leading-relaxed">
                  Identifiez les marques controversées en utilisant notre moteur de recherche ou notre extension.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex items-start md:flex-col md:text-center space-x-4">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-berry-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold flex-shrink-0 md:mx-auto md:mb-6">
                2
              </div>
              <div className="flex-1 md:flex-none">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2 md:mb-4">
                  Consultez
                </h3>
                <p className="text-sm md:text-base font-light text-neutral-700 leading-relaxed">
                  Consultez les controverses documentées, les dirigeants problématiques 
                  et leurs sources vérifiées pour comprendre les enjeux.
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex items-start md:flex-col md:text-center space-x-4">
              <div className="w-12 h-12 md:w-20 md:h-20 bg-berry-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold flex-shrink-0 md:mx-auto md:mb-6">
                3
              </div>
              <div className="flex-1 md:flex-none">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2 md:mb-4">
                  Décidez
                </h3>
                <p className="text-sm md:text-base font-light text-neutral-700 leading-relaxed">
                  Prenez votre décision d&apos;achat en toute connaissance de cause, 
                  selon vos valeurs personnelles et votre seuil de tolérance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
