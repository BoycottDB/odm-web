import { Evenement } from '@/types';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EventListProps {
  events: Evenement[];
  loading: boolean;
  searching: boolean;
  notFound: boolean;
  hasSearched: boolean;
}

export function EventList({ events, loading, searching, notFound, hasSearched }: EventListProps) {
  // État de chargement initial
  if (loading && !hasSearched) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-lg font-light text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  // État de recherche en cours
  if (searching) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-lg font-light text-gray-600">Recherche en cours...</p>
      </div>
    );
  }

  // Aucun résultat trouvé
  if (notFound && hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
        <p className="text-lg font-light text-gray-600">
          Essayez avec un autre terme de recherche ou vérifiez l&apos;orthographe.
        </p>
      </div>
    );
  }

  // Pas encore de recherche effectuée
  if (!hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-medium text-gray-900 mb-2">Commencez votre recherche</h3>
        <p className="text-lg font-light text-gray-600">
          Tapez le nom d&apos;une marque pour découvrir les événements associés.
        </p>
      </div>
    );
  }

  // Affichage des résultats
  return (
    <div>
      <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">
        Événements liés à votre recherche
      </h2>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto px-2 sm:px-0">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
