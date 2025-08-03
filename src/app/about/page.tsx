import { APP_CONFIG } from '@/lib/utils/constants';

export default function About() {
  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            À propos du projet
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Découvrez notre mission, nos valeurs et notre fonctionnement
          </p>
        </div>
        {/* Encadré informatif */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mt-8 max-w-3xl mx-auto border border-primary shadow-lg">
          <p className="body-base font-light text-neutral-700 mb-4 text-center">
            Ce projet est <strong>open source</strong> et <strong>non lucratif</strong>. Notre objectif est de fournir des informations factuelles et vérifiées pour aider les consommateurs à faire des choix éclairés.
          </p>
          <div className="text-center">
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="body-small inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary text-white font-medium rounded-full hover:from-primary-hover hover:to-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Contribuer sur GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-info-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Notre mission</h2>
                <p className="body-large text-neutral-700 leading-relaxed mb-4">
                  Ce répertoire vous aide à prendre des décisions d&apos;achat éclairées et responsables en vous informant sur les pratiques éthiques, sociales et environnementales des marques. Notre application vous accompagne tout au long de votre parcours d&apos;achat, en vous fournissant des informations factuelles et vérifiées, issues d&apos;une base de données collaborative alimentée par des utilisateurs comme vous.
                </p>
                <p className="body-large text-neutral-700 leading-relaxed mb-4">
                  Nous ne vous empêcherons jamais de passer commande. Nous comprenons que pour de nombreuses raisons, notamment pour les produits de première nécessité, vous pouvez être amenés à acheter des produits de marques dont les pratiques ne sont pas parfaitement alignées avec vos valeurs.
                </p>
                <p className="body-large text-neutral-700 leading-relaxed mb-4">
                  Notre rôle est simplement de vous permettre d&apos;effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement à vous fournir les informations nécessaires pour décider librement.
                </p>
                <p className="body-large text-neutral-700 leading-relaxed">
                  <strong>Nous croyons au pouvoir du boycott.</strong> En choisissant de ne plus financer certaines entreprises ou dirigeants dont les pratiques vont à l&apos;encontre de nos valeurs, nous pouvons collectivement réduire leur pouvoir économique et les inciter au changement. Le boycott est un acte démocratique puissant qui permet aux citoyens de faire entendre leur voix par leur portefeuille, en soutenant les entreprises responsables et en sanctionnant celles qui ne le sont pas.
                </p>
              </div>
            </div>
          </div>

          {/* Valeurs */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-success-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-6">Nos valeurs fondamentales</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-info pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">Transparence totale</h3>
                    <p className="text-neutral-700">Toutes les décisions (ajout ou refus d&apos;une marque) sont publiques et argumentées. Nous accordons une grande importance à la transparence : toutes les décisions relatives à l&apos;ajout ou au refus d&apos;une marque dans notre base de données sont publiquement accessibles, avec un historique clair et des motifs argumentés.</p>
                  </div>
                  <div className="border-l-4 border-success pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">Collaboration communautaire</h3>
                    <p className="text-neutral-700">Contribution ouverte à tous, avec validation par modération communautaire stricte. Chacun peut proposer, corriger ou enrichir les données dans le respect mutuel.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">Neutralité et responsabilité</h3>
                    <p className="text-neutral-700">Information claire sans jugement moral ; chaque utilisateur reste libre de son choix. Aucune promotion ou attaque, uniquement des faits vérifiés et sourcés.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold body-large text-neutral-900 mb-2">Non lucratif</h3>
                    <p className="text-neutral-700">Projet open source, sans publicité ni partenariat commercial. Seuls les dons éventuels serviront à couvrir les frais d&apos;hébergement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fonctionnement */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-primary-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">Comment ça fonctionne</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-info text-white rounded-full w-8 h-6 flex items-center justify-center body-small font-bold mr-4 mt-1">1</div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Base de données collaborative</h3>
                      <p className="text-neutral-700">Stockée dans un dépôt Git public (GitHub/GitLab). Contributions via merge requests, modération transparente, historique clair et accessible.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-info text-white rounded-full w-8 h-6 flex items-center justify-center body-small font-bold mr-4 mt-1">2</div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Workflow de contribution</h3>
                      <p className="text-neutral-700">Fork du dépôt → Création d&apos;une merge request → Validation (ou refus justifié) par la communauté → Historique public et argumenté.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-info text-white rounded-full w-8 h-6 flex items-center justify-center body-small font-bold mr-4 mt-1">3</div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Modération transparente</h3>
                      <p className="text-neutral-700">Chaque validation ou refus est justifié publiquement dans un onglet dédié. Les débats et contributions doivent rester courtois et argumentés.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandation seconde main */}
          <div className="bg-success-light border border-success rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <h3 className="font-semibold text-success mb-2">Notre recommandation : privilégier la seconde main</h3>
                <p className="text-success">
                  Lorsque cela est possible, nous vous encourageons à privilégier l&apos;achat de produits de seconde main, afin de limiter votre impact environnemental et d&apos;éviter de financer directement des entreprises dont vous ne partagez pas les valeurs. Gardez cependant à l&apos;esprit que l&apos;achat en seconde main maintient indirectement la visibilité de ces marques : faites-le donc en connaissance de cause, avec discernement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
