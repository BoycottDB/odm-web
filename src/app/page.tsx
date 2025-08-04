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

          <div className="space-y-16">
            {/* Extension navigateur - Illustration à gauche */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-berry-50 to-white rounded-2xl p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/Nt6Zju-KjTsAAAAC/luffy-one-piece.gif" 
                  alt="Extension en action" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="body-base text-neutral-600">
                  Extension en action sur site e-commerce
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-berry-100 rounded-xl flex items-center justify-center mr-6">
                    <Globe className="w-10 h-10 text-berry-600" />
                  </div>
                  <h3 className="heading-main text-neutral-900">
                    Extension navigateur
                  </h3>
                </div>
                <p className="body-large text-neutral-700 leading-relaxed mb-8">
                  Notre extension détecte automatiquement les marques controversées dans vos parcours d'achat en ligne afin de vous aider à consommer de manière éclairée et responsable.
                </p>
                <Link 
                  href="https://chrome.google.com/webstore" 
                  className="inline-flex items-center px-6 py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Installer l'extension
                </Link>
              </div>
            </div>

            {/* Recherche rapide - Texte à gauche */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-berry-100 rounded-xl flex items-center justify-center mr-6">
                    <Search className="w-10 h-10 text-berry-600" />
                  </div>
                  <h3 className="heading-main text-neutral-900">
                    Explorez notre base de données
                  </h3>
                </div>
                <p className="body-large text-neutral-700 leading-relaxed mb-8">
                  Pour chaque marque, nous mentionnons ses diverses controverses en précisant s'il y a eu condamnations juridiques et/ou réponses officielle de la marque. Une marque peut aussi être référencée pour les faits de ses dirigeants.
                </p>
                <Link 
                  href="/recherche" 
                  className="inline-flex items-center px-6 py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher une marque
                </Link>
              </div>
              <div className="bg-gradient-to-br from-berry-50 to-white rounded-2xl p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/j6hODwAA_VQAAAAd/fat-luffy-fat-luffy-rubbing-belly.gif" 
                  alt="Interface de recherche" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="body-base text-neutral-600">
                  Interface de recherche avec suggestions
                </p>
              </div>
            </div>

            {/* Signalement facile - Illustration à gauche */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-berry-50 to-white rounded-2xl p-12 text-center border border-berry-100">
                <img 
                  src="https://media1.tenor.com/m/qanLZ89oReAAAAAC/gear-5-gear-5-luffy.gif" 
                  alt="Processus de signalement" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="body-base text-neutral-600">
                  Processus de signalement collaboratif
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-berry-100 rounded-xl flex items-center justify-center mr-6">
                    <AlertTriangle className="w-10 h-10 text-berry-600" />
                  </div>
                  <h3 className="heading-main text-neutral-900">
                    Signalement collaboratif
                  </h3>
                </div>
                <p className="body-large text-neutral-700 leading-relaxed mb-8">
                  Participez à notre démarche collaborative en signalant de nouvelles controverses. 
                  Processus simplifié avec vérification de sources, modération transparente par la communauté 
                  et historique public de toutes les décisions.
                </p>
                <Link 
                  href="/signaler" 
                  className="inline-flex items-center px-6 py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Signaler une controverse
                </Link>
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
            <p className="body-large">
              <strong className="text-neutral-900">Nous croyons au pouvoir du boycott</strong> comme acte démocratique puissant. 
              En choisissant de ne plus financer des entreprises dont les pratiques vont à l'encontre de nos valeurs, nous pouvons collectivement réduire leur pouvoir économique et les inciter au changement.
            </p>
            <p className="body-large">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-berry-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="body-large font-medium text-neutral-900 mb-4">
                Identifiez
              </h3>
              <p className="body-base text-neutral-700 leading-relaxed">
                Identifiez les marques controversées en utilisant notre moteur de recherche ou notre extension.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-berry-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="body-large font-medium text-neutral-900 mb-4">
                Consultez
              </h3>
              <p className="body-base text-neutral-700 leading-relaxed">
                Consultez les controverses documentées, les dirigeants problématiques 
                et leurs sources vérifiées pour comprendre les enjeux.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-berry-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="body-large font-medium text-neutral-900 mb-4">
                Décidez
              </h3>
              <p className="body-base text-neutral-700 leading-relaxed">
                Prenez votre décision d&apos;achat en toute connaissance de cause, 
                selon vos valeurs personnelles et votre seuil de tolérance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white section-padding">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <p className="body-large text-neutral-300 mb-2">
              Développé avec ❤️ par le collectif
            </p>
            <h3 className="heading-main text-white font-bold">
              Ethik Pirates
            </h3>
          </div>
          <div className="border-t border-neutral-700 pt-6">
            <p className="body-base text-neutral-400">
              "Lancez l'ère de la piraterie partout !" - Pour une consommation qui favorise la vie plutôt que les profits
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
