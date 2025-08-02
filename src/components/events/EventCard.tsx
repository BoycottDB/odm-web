import { Evenement } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface EventCardProps {
  event: Evenement;
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-berry-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête avec badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        {event.categorie?.nom && (
          <Badge variant="category">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {event.categorie.nom}
          </Badge>
        )}
        
        <Badge variant="date">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(event.date)}
        </Badge>
        
        <Badge variant="brand">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {event.marque?.nom}
        </Badge>
      </div>

      {/* Description */}
      <h3 className="text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
        {event.description}
      </h3>

      {/* Source */}
      {event.source_url && (
        <div className="pt-4 border-t border-gray-100">
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-lg font-medium text-berry-600 hover:text-berry-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir la source
          </a>
        </div>
      )}
    </div>
  );
}
