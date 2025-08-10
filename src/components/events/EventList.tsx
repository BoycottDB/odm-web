import { Evenement, DirigeantResult, BeneficiaireComplet } from '@/types';
import { EventCard } from './EventCard';
import BeneficiaireNavigation from './BeneficiaireNavigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import { ShareButton } from '@/components/ui/ShareButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';

interface EventListProps {
  events: Evenement[];
  dirigeantResults: DirigeantResult[];
  loading: boolean;
  searching: boolean;
  notFound: boolean;
  hasSearched: boolean;
}

export function EventList({ events, dirigeantResults, loading, searching, notFound, hasSearched }: EventListProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  // Récupérer la valeur brute encodée depuis l'URL
  const rawSearchQuery = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('q') || '' : 
    searchQuery;
  const { canInstall } = useAddToHomeScreen();
  // État de chargement initial
  if (loading && !hasSearched) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="body-large font-light text-neutral-600">Chargement des données...</p>
      </div>
    );
  }

  // État de recherche en cours
  if (searching) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="body-large font-light text-neutral-600">Recherche en cours...</p>
      </div>
    );
  }

  // Aucun résultat trouvé
  if (notFound && hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="heading-sub font-medium text-neutral-900 mb-2">Une marque controversée manque ?</h3>
        <p className="body-large font-light text-neutral-600 mb-6">
          <strong>Ce répertoire est collaboratif</strong> : si une marque n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
        </p>
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
    );
  }

  // Pas encore de recherche effectuée
  if (!hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="heading-sub font-medium text-neutral-900 mb-2">Commencez votre recherche</h3>
        <p className="body-large font-light text-neutral-600">
          Tapez le nom d&apos;une marque pour découvrir les controverses associées.
        </p>
      </div>
    );
  }

  // Affichage des résultats
  const hasEvents = events.length > 0;
  const hasDirigeants = dirigeantResults.length > 0;
  const isSearchResults = hasSearched && (hasEvents || hasDirigeants);
  

  // Extraire la marque des résultats pour afficher les Boycott Tips
  const marque = hasEvents ? events[0].marque : (hasDirigeants ? dirigeantResults[0].marque : null);

  return (
    <div>
      
      {/* Section Boycott Tips - seulement pour les résultats de recherche avec marque spécifique */}
      {isSearchResults && marque && (
        <div className="max-w-4xl mx-auto px-2 sm:px-0 mb-6">
          <BoycottTipsSection marque={marque} />
        </div>
      )}

      <h2 className="heading-main font-light text-neutral-900 mb-12 text-center">
        {isSearchResults ? 'Résultats de recherche' : 'Derniers signalements'}
      </h2>

      {/* Bouton flottant desktop & mobile avec adaptation selon le banner PWA */}
      {isSearchResults && searchQuery && (
        <div className={`fixed right-6 z-50 md:bottom-24 md:right-24 ${canInstall ? 'bottom-16' : 'bottom-6'}`}>
          <ShareButton
            url={`/recherche?q=${rawSearchQuery}`}
            title={`Controverses de ${searchQuery} - Répertoire des marques`}
            text={`Découvrez les controverses documentées de ${searchQuery} sur notre répertoire collaboratif.`}
            variant="primary"
            size="lg"
            className="shadow-xl rounded-full px-4 py-4 hover:scale-105 transition-transform"
          />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-2 sm:px-0 space-y-8">
        {/* Bénéficiaires controversés (seulement lors de recherche) */}
        {hasDirigeants && (
          <div>
            <h3 className="heading-sub font-medium text-neutral-900 mb-6 text-center">
              Qui bénéficie de vos achats ?
            </h3>
            <p className="text-center text-neutral-600 mb-8 max-w-2xl mx-auto">
              Découvrez les individus et groupes controversés qui reçoivent une partie de votre argent quand vous achetez cette marque.
            </p>
            
            {/* Navigation entre bénéficiaires avec transformation des données */}
            <BeneficiaireNavigation 
              beneficiaires={dirigeantResults.map(dirigeantResult => {
                // Transformation existante + nouveaux champs bénéficiaires
                const beneficiaireComplet: BeneficiaireComplet = {
                  id: dirigeantResult.dirigeant.dirigeant_id || parseInt(dirigeantResult.id.replace('dirigeant-', '')),
                  nom: dirigeantResult.dirigeant.dirigeant_nom,
                  controverses: dirigeantResult.dirigeant.controverses,
                  sources: dirigeantResult.dirigeant.sources,
                  lien_financier: dirigeantResult.dirigeant.lien_financier,
                  impact_description: dirigeantResult.dirigeant.impact_description,
                  marque_id: dirigeantResult.marque.id,
                  marque_nom: dirigeantResult.marque.nom,
                  liaison_id: dirigeantResult.dirigeant.id,
                  toutes_marques: dirigeantResult.dirigeant.toutes_marques || [],
                  
                  // NOUVEAU - Type bénéficiaire avec fallback
                  type_beneficiaire: (dirigeantResult.beneficiaire as any)?.type_beneficiaire || 
                                   (dirigeantResult.dirigeant as any)?.type_beneficiaire || 
                                   'individu',
                  type_affichage: ((dirigeantResult.beneficiaire as any)?.type_beneficiaire || 
                                  (dirigeantResult.dirigeant as any)?.type_beneficiaire || 
                                  'individu') === 'groupe' ? 'Groupe' : 'Dirigeant'
                };
                
                return beneficiaireComplet;
              })}
            />
          </div>
        )}

        {/* Événements */}
        {hasEvents && (
          <div>
            {hasDirigeants && (
              <h3 className="heading-sub font-medium text-neutral-900 mb-6 text-center">
                Controverses documentées
              </h3>
            )}
            <div className="grid gap-10 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              
              {/* Fausse controverse d'incitation */}
              <div className="bg-primary-light/20 border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-3">
                  Une controverse manque ?
                </h3>
                <p className="text-neutral-600 mb-4">
                  <strong>Ce répertoire est collaboratif</strong> : si une controverse n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
                </p>
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
        )}
      </div>
    </div>
  );
}
