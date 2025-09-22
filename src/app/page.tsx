'use client';

import Link from 'next/link';
import { Download, Search, SearchX, Compass, TextSearch, WavesLadder, Sailboat, FileInput, CircleQuestionMark, Zap, ChevronRight } from 'lucide-react';
import { useMobileDetection } from '@/hooks/useMobileDetection';

export default function Home() {
  const { isMobile } = useMobileDetection();

  // Sections dans l'ordre d'apparition sur la page
  const SearchSection = () => (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 lg:items-center">
      {/* Titre - order-1 sur mobile et desktop */}
      <div className="order-1 lg:order-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 glassmorphism-bg rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <SearchX className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Scrutez les marques !
          </h3>
        </div>
        {/* Texte et CTA - visibles sur desktop seulement */}
        <div className="hidden lg:block">
          <p className="text-base md:text-lg font-light text-neutral-700 mb-4 md:mb-6 lg:mb-8">
            Recherchez une marque pour repérer ses éventuelles controverses documentées mais aussi ses éventuels <strong>bénéficiaires</strong> à qui vos achats profitent.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              href="/recherche"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Rechercher une marque
            </Link>
          </div>
        </div>
      </div>

      {/* Vidéo - order-2 sur mobile et desktop */}
      <div className="order-2 lg:order-2  glassmorphism-bg rounded-xl md:rounded-2xl p-0 md:p-3 text-center border border-secondary-100">
        <video
          src="/videos/recherche.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-[3/2] object-cover rounded-lg"
        />
      </div>

      {/* Texte et CTA - order-3 sur mobile, caché sur desktop */}
      <div className="order-3 lg:hidden text-center md:text-left">
        <p className="text-base md:text-lg font-light text-neutral-700 mb-4 md:mb-6 lg:mb-8">
          Recherchez une marque pour repérer ses éventuelles controverses documentées mais aussi ses éventuels <strong>bénéficiaires</strong> à qui vos achats profitent.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            href="/recherche"
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Rechercher une marque
          </Link>
        </div>
      </div>
    </div>
  );

  const BoycottTipsSection = () => (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 lg:items-center">
      {/* Titre - order-1 sur mobile et desktop */}
      <div className="order-1 lg:order-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 glassmorphism-bg rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <Compass className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Changez de cap !
          </h3>
        </div>
        {/* Texte et CTA - visibles sur desktop seulement */}
        <div className="hidden lg:block">
          <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
            Découvez des conseils pratiques et adaptés à chaque secteur d&apos;activité pour vous guider sans forcément bousculer toutes vos habitudes de consommation.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              href="/recherche?q=Nike"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
            >
              <TextSearch className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Voir des exemples de conseils
            </Link>
          </div>
        </div>
      </div>

      {/* Vidéo - order-2 sur mobile et desktop */}
      <div className="order-2 lg:order-1 glassmorphism-bg rounded-xl md:rounded-2xl p-0 md:p-3 text-center border border-secondary-100">
        <video
          src="/videos/boycott.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-[3/2] object-cover rounded-lg"
        />
      </div>

      {/* Texte et CTA - order-3 sur mobile, caché sur desktop */}
      <div className="order-3 lg:hidden text-center md:text-left">
        <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
          Découvez des conseils pratiques et adaptés à chaque secteur d&apos;activité pour vous guider sans forcément bousculer toutes vos habitudes de consommation.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            href="/recherche?q=Nike"
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
          >
            <TextSearch className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Voir des exemples de conseils
          </Link>
        </div>
      </div>
    </div>
  );

  const ExtensionSection = () => (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 lg:items-center">
      {/* Titre - order-1 sur mobile et desktop */}
      <div className="order-1 lg:order-1 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 glassmorphism-bg rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <Sailboat className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Naviguez librement !
          </h3>
        </div>
        {/* Texte et CTA - visibles sur desktop seulement */}
        <div className="hidden lg:block">
          <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
            Parcourrez les sites de vente en ligne en toute tranquillité, notre extension guette et vous signale automatiquement les produits de marques controversées qui apparaissent sur votre écran.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              href=""
              className={`inline-flex items-center px-4 py-2 md:px-6 md:py-3 font-semibold rounded-lg transition-all duration-300 text-sm md:text-base ${isMobile
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm'
                //bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark
                }`}
              {...(isMobile ? { onClick: (e) => e.preventDefault() } : {})}
            >
              <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              {/* Installer l&apos;extension */}
              Bientôt disponible <span className="ml-2">👀</span>
            </Link>
          </div>
          {isMobile && (
            <p className="text-sm text-primary mt-3">
              Extension disponible sur ordinateur uniquement
            </p>
          )}
        </div>
      </div>

      {/* Vidéo - order-2 sur mobile et desktop */}
      <div className="order-2 lg:order-2  glassmorphism-bg rounded-xl md:rounded-2xl p-0 md:p-3 text-center border border-secondary-100">
        <video
          src="/videos/extension.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-[3/2] object-cover rounded-lg"
        />
      </div>

      {/* Texte et CTA - order-3 sur mobile, caché sur desktop */}
      <div className="order-3 lg:hidden text-center md:text-left">
        <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
          Parcourrez les sites de vente en ligne en toute tranquillité, notre extension guette et vous signale automatiquement les produits de marques controversées qui apparaissent sur votre écran.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            href=""
            className={`inline-flex items-center px-4 py-2 md:px-6 md:py-3 font-semibold rounded-lg transition-all duration-300 text-sm md:text-base ${isMobile
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm'
              //bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark
              }`}
            {...(isMobile ? { onClick: (e) => e.preventDefault() } : {})}
          >
            <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            {/* Installer l&apos;extension */}
            Bientôt disponible <span className="ml-2">👀</span>
          </Link>
        </div>
        {isMobile && (
          <p className="text-sm text-primary mt-3">
            Extension disponible sur ordinateur uniquement
          </p>
        )}
      </div>
    </div>
  );

  const SignalementSection = () => (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-12 lg:items-center">
      {/* Titre - order-1 sur mobile et desktop */}
      <div className="order-1 lg:order-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start md:mb-6 lg:mb-8">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 glassmorphism-bg rounded-lg md:rounded-xl flex items-center justify-center mr-3 md:mr-4 lg:mr-6">
            <WavesLadder className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-neutral-900">
            Montez à bord !
          </h3>
        </div>
        {/* Texte et CTA - visibles sur desktop seulement */}
        <div className="hidden lg:block">
          <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
            Rejoignez le mouvement en participant à la collecte de données. Chaque signalement fait l&apos;objet d&apos;une modération transparente :
            notre équipe vérifie les sources, argumente sa décision et rend publique
            l&apos;historique de validation ou de refus.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link
              href="/signaler"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
            >
              <FileInput className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Signaler une controverse
            </Link>
          </div>
        </div>
      </div>

      {/* Vidéo - order-2 sur mobile et desktop */}
      <div className="order-2 lg:order-1 glassmorphism-bg rounded-xl md:rounded-2xl p-0 md:p-3 text-center border border-secondary-100">
        <video
          src="/videos/signalement.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full aspect-[3/2] object-cover rounded-lg"
        />
      </div>

      {/* Texte et CTA - order-3 sur mobile, caché sur desktop */}
      <div className="order-3 lg:hidden text-center md:text-left">
        <p className="text-base md:text-lg font-light text-neutral-700 leading-snug mb-4 md:mb-6 lg:mb-8">
          Rejoignez le mouvement en participant à la collecte de données. Chaque signalement fait l&apos;objet d&apos;une modération transparente :
          notre équipe vérifie les sources, argumente sa décision et rend publique
          l&apos;historique de validation ou de refus.
        </p>
        <div className="flex justify-center md:justify-start">
          <Link
            href="/signaler"
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary hover:shadow-primary-dark text-sm md:text-base"
          >
            <FileInput className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Signaler une controverse
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Parallax Background */}
      <div className="fixed inset-0 bg-gradient-hero parallax-bg"></div>

      {/* Hero Section */}
      <section className="relative z-10 section-padding">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="heading-hero font-light text-neutral-900 mb-6 leading-tight">
            L&apos;Observatoire des Marques
          </h1>
          <p className="heading-sub font-light text-neutral-700 mx-auto leading-snug">
            {/* Découvrez qui bénéficie vraiment de vos achats, retrouvez des conseils pratiques pour adapter votre consommation et rejoignez une communauté engagée pour une consommation éthique et responsable. */}
            Recherchez des marques, découvrez ce qu&apos;elles vous cachent <br className="hidden lg:block" />
            et retrouvez des conseils pratiques pour adapter vos achats <br className="hidden lg:block" />
            vers une consommation plus éthique et responsable.
          </p>

          <div className="space-y-20 md:space-y-32 my-16 md:my-32">
            {/* Ordre unifié : Recherche, BoycottTips, Extension, Signalement */}
            <div className="glassmorphism-section p-6 pb-8 md:p-0">
              <SearchSection/>
            </div>
            <div className="glassmorphism-section p-6 pb-8 md:p-0">
              <BoycottTipsSection />
            </div>
            <div className="glassmorphism-section p-6 pb-8 md:p-0">
              <ExtensionSection />
            </div>
            <div className="glassmorphism-section p-6 pb-8 md:p-0">
              <SignalementSection />
            </div>
          </div>
        </div>
      </section>

      {/* Section Pourquoi ce projet */}
      <section className="relative z-10 section-padding bg-white">
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
      <section className="relative z-10 section-padding">
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
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-secondary shadow-sm hover:shadow-md/60 transition-all duration-300 group text-left"
              draggable={false}
            >
              <div className="flex items-start space-x-4">
                <CircleQuestionMark className="w-12 h-12 text-accent-dark" />
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
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-secondary shadow-sm hover:shadow-md/60 transition-all duration-300 group text-left"
              draggable={false}
            >
              <div className="flex items-start space-x-4">
                <Zap className="w-12 h-12 text-accent-dark" />
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
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg/60 hover:shadow-secondary"
          >
            Consulter la FAQ complète
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Palette de couleurs */}
      {/* <section className="section-padding bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="heading-main text-neutral-900 mb-8">
            Palette de couleurs ODM
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Primary - Rouge bordeaux
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#fdf5f7' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-50</div>
                    <div className="text-xs text-neutral-500">#fdf5f7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#fae8ed' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-100</div>
                    <div className="text-xs text-neutral-500">#fae8ed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#f2c8d4' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-200</div>
                    <div className="text-xs text-neutral-500">#f2c8d4</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#e8a3b7' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-300</div>
                    <div className="text-xs text-neutral-500">#e8a3b7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#c85a85' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-400</div>
                    <div className="text-xs text-neutral-500">#c85a85</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#98105b' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-500</div>
                    <div className="text-xs text-neutral-500">#98105b</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#800d4d' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-600</div>
                    <div className="text-xs text-neutral-500">#800d4d</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#6f0c43' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-700</div>
                    <div className="text-xs text-neutral-500">#6f0c43</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#5c0a37' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-800</div>
                    <div className="text-xs text-neutral-500">#5c0a37</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#4a082e' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">primary-900</div>
                    <div className="text-xs text-neutral-500">#4a082e</div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Secondary - Lavande
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#f7f7fd' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-50</div>
                    <div className="text-xs text-neutral-500">#f7f7fd</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#eeeefa' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-100</div>
                    <div className="text-xs text-neutral-500">#eeeefa</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#ddddf4' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-200</div>
                    <div className="text-xs text-neutral-500">#ddddf4</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#c7c7ed' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-300</div>
                    <div className="text-xs text-neutral-500">#c7c7ed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#b0b0e0' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-400</div>
                    <div className="text-xs text-neutral-500">#b0b0e0</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#9999d3' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-500</div>
                    <div className="text-xs text-neutral-500">#9999d3</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#8080c6' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-600</div>
                    <div className="text-xs text-neutral-500">#8080c6</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#7070b3' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-700</div>
                    <div className="text-xs text-neutral-500">#7070b3</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#5d5d96' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-800</div>
                    <div className="text-xs text-neutral-500">#5d5d96</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#4d4d7a' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">secondary-900</div>
                    <div className="text-xs text-neutral-500">#4d4d7a</div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Accent - Bleu gris
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#f6f9fc' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-50</div>
                    <div className="text-xs text-neutral-500">#f6f9fc</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#eef5fb' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-100</div>
                    <div className="text-xs text-neutral-500">#eef5fb</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#dae9f6' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-200</div>
                    <div className="text-xs text-neutral-500">#dae9f6</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#b8d4ed' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-300</div>
                    <div className="text-xs text-neutral-500">#b8d4ed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#95b8dc' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-400</div>
                    <div className="text-xs text-neutral-500">#95b8dc</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#729dd0' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-500</div>
                    <div className="text-xs text-neutral-500">#729dd0</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#5a84ba' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-600</div>
                    <div className="text-xs text-neutral-500">#5a84ba</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#4d6ea4' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-700</div>
                    <div className="text-xs text-neutral-500">#4d6ea4</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#3f5a87' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-800</div>
                    <div className="text-xs text-neutral-500">#3f5a87</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#344b6d' }}></div>
                  <div className="text-left">
                    <div className="text-sm font-mono text-neutral-600">accent-900</div>
                    <div className="text-xs text-neutral-500">#344b6d</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

    </div>
  );
}
