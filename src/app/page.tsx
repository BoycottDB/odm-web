'use client';

import Link from 'next/link';
import { Download, Search, SearchX, Compass, TextSearch, WavesLadder, Sailboat, FileInput, CircleQuestionMark, Zap, ChevronRight } from 'lucide-react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

export default function Home() {
  const { isMobile } = useMobileDetection();

  // Sections dans l'ordre d'apparition sur la page
  const SearchSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
      <div className="text-left">
        <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <SearchX className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Scrutez les marques !
          </h3>
        </div>
        <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
          Recherchez une marque pour repérer ses éventuelles controverses documentées mais aussi ses éventuels <strong>bénéficiaires</strong> à qui vos achats profitent.
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
  );

  const BoycottTipsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
      <div className="order-2 lg:order-1 bg-gradient-to-br from-berry-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-12 text-center border border-berry-100">
        <img
          src="https://media1.tenor.com/m/j6hODwAA_VQAAAAd/fat-luffy-fat-luffy-rubbing-belly.gif"
          alt="Conseils pratiques"
          className="w-full h-24 md:h-32 lg:h-48 object-cover rounded-lg mb-2 md:mb-4"
        />
        <p className="text-sm md:text-base text-neutral-600">
          Des conseils adaptés à chaque secteur d&apos;activité
        </p>
      </div>
      <div className="order-1 lg:order-2 text-left">
        <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <Compass className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Changez de cap !
          </h3>
        </div>
        <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
          Découvez des conseils pratiques et adaptés à chaque secteur d&apos;activité pour vous guider sans forcément bousculer toutes vos habitudes de consommation.
        </p>
        <div className="flex justify-start md:justify-start">
          <Link
            href="/recherche?q=Nike"
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors text-sm md:text-base"
          >
            <TextSearch className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Voir des exemples de conseils
          </Link>
        </div>
      </div>
    </div>
  );

  const ExtensionSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
      <div className="text-left">
        <div className="flex items-center mb-4 md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-berry-100 rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <Sailboat className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Naviguez librement !
          </h3>
        </div>
        <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
          Parcourrez les sites de vente en ligne en toute tranquillité, notre extension guette et vous signale automatiquement les produits de marques controversées qui apparaissent sur votre écran.
        </p>
        <div className="flex justify-start md:justify-start">
          <Link
            href="https://chrome.google.com/webstore"
            className={`inline-flex items-center px-4 py-2 md:px-6 md:py-3 font-semibold rounded-lg transition-colors text-sm md:text-base ${isMobile
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-berry-600 text-white hover:bg-berry-700'
              }`}
            {...(isMobile ? { onClick: (e) => e.preventDefault() } : {})}
          >
            <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Installer l&apos;extension
          </Link>
        </div>
        {isMobile && (
          <p className="text-sm text-primary mt-3">
            Extension disponible sur ordinateur uniquement
          </p>
        )}
      </div>
      <div className="bg-gradient-to-br from-berry-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-12 text-center border border-berry-100">
        <img
          src="https://media1.tenor.com/m/Nt6Zju-KjTsAAAAC/luffy-one-piece.gif"
          alt="Extension en action"
          className="w-full h-24 md:h-32 lg:h-48 object-cover rounded-lg mb-2 md:mb-4"
        />
        <p className="text-sm md:text-base text-neutral-600">
          Extension en action sur site e-commerce
        </p>
      </div>
    </div>
  );

  const SignalementSection = () => (
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
            <WavesLadder className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-berry-600" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Montez à bord !
          </h3>
        </div>
        <p className="text-base md:text-lg font-light text-neutral-700 leading-relaxed mb-4 md:mb-6 lg:mb-8">
          Rejoignez le mouvement en participant à la collecte de données. Chaque signalement fait l&apos;objet d&apos;une modération transparente :
          notre équipe vérifie les sources, argumente sa décision et rend publique
          l&apos;historique de validation ou de refus.
        </p>
        <div className="flex justify-start md:justify-start">
          <Link
            href="/signaler"
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-berry-600 text-white font-semibold rounded-lg hover:bg-berry-700 transition-colors text-sm md:text-base"
          >
            <FileInput className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Signaler une controverse
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            L&apos;Observatoire des Marques
          </h1>
          {/* <p className="heading-sub font-light text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Une plateforme collaborative qui vous donne les clés d'une consommation éthique et responsable.
          </p> */}
          <p className="heading-sub font-light text-neutral-700 mb-16 max-w-3xl mx-auto leading-relaxed">
            Découvrez qui bénéficie vraiment de vos achats, retrouvez des conseils pratiques pour adapter votre consommation et rejoignez une communauté engagée pour une consommation éthique et responsable.
          </p>

          <div className="space-y-8 md:space-y-16">
            {/* Ordre unifié : Recherche, BoycottTips, Extension, Signalement */}
            <SearchSection />
            <BoycottTipsSection />
            <ExtensionSection />
            <SignalementSection />
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
              <strong className="text-neutral-900">Nous croyons au pouvoir du boycott</strong> comme acte démocratique puissant. En choisissant de ne plus financer des entreprises dont les pratiques vont à l&apos;encontre de nos valeurs, nous pouvons collectivement réduire leur pouvoir économique et les inciter au changement.
            </p>
            <p className="body-large font-light">
              ODM vous permet d&apos;effectuer vos achats en pleine conscience, selon vos propres valeurs, votre seuil de tolérance et votre contexte. Nous restons strictement neutres : <strong>vous avez toujours le choix</strong>, et notre engagement consiste uniquement à centraliser des informations sourcées pour vous aider à décider.
            </p>
            <p className="body-large font-light">
              <em>L&apos;heure est à la mutinerie !</em>
            </p>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="section-padding bg-gradient-to-r from-primary-light via-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="heading-main text-neutral-900 mb-4">
            Des questions ? Des doutes ?
          </h2>
          <p className="heading-sub font-light text-neutral-700 mb-12">
            Rassurez-vous, nous aussi nous en avons eu et voici nos réponses.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Question efficacité */}
            <Link
              href="/faq/pourquoi"
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all group text-left"
              draggable={false}
            >
              <div className="flex items-start space-x-4">
                <CircleQuestionMark className="w-12 h-12 text-info" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                    &quot;À quoi ça sert ? C&apos;est peine perdue de toute façon...&quot;
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Pourquoi, nous, on y croit et pourquoi ça nous semble important aujourd&apos;hui de nous mobiliser pour essayer de changer la donne.
                  </p>
                </div>
              </div>
            </Link>

            {/* Question alternatives */}
            <Link
              href="/faq/alternatives"
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all group text-left"
              draggable={false}
            >
              <div className="flex items-start space-x-4">
                <Zap className="w-12 h-12 text-info" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                    &quot;Pourquoi ne proposez-vous pas des alternatives ?&quot;
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Notre position sur les alternatives et pourquoi nous mettons en lumière le mauvais plutôt que le bon, pour le moment...
                  </p>
                </div>
              </div>
            </Link>
          </div>
          {/* Lien vers FAQ complète */}
          <Link
            href="/faq"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Consulter la FAQ complète
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}
