import { Evenement, DirigeantResult } from '@/types';
import { EventCard } from './EventCard';
import { DirigeantCard } from './DirigeantCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import Link from 'next/link';

interface EventListProps {
  events: Evenement[];
  dirigeantResults: DirigeantResult[];
  loading: boolean;
  searching: boolean;
  notFound: boolean;
  hasSearched: boolean;
}

export function EventList({ events, dirigeantResults, loading, searching, notFound, hasSearched }: EventListProps) {
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
      
      <div className="max-w-4xl mx-auto px-2 sm:px-0 space-y-8">
        {/* Dirigeants controversés (seulement lors de recherche) */}
        {hasDirigeants && (
          <div>
            <h3 className="heading-sub font-medium text-neutral-900 mb-6 text-center">
              Dirigeants controversés associés
            </h3>
            <div className="grid gap-10 sm:gap-12 grid-cols-1 lg:grid-cols-1">
              {dirigeantResults.map((dirigeantResult) => (
                <DirigeantCard key={dirigeantResult.id} dirigeantResult={dirigeantResult} />
              ))}
            </div>
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
