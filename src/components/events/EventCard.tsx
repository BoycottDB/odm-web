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

  const formatDateCompact = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-berry-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête principal : Marque et Date */}
      <div className="flex flex-col gap-3 mb-4">
          {/* Badges et date alignés sur mobile */}
          <div className="flex items-center justify-between">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Condamnation judiciaire en second */}
              {event.condamnation_judiciaire && (
                <Badge variant="condamnation">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 850 792">
                    {/* Marteau de juge détaillé */}
                    <g transform="translate(-1.99,1.8)">
                    <path
                      d="M426.8,761.5V731h212.5 212.5v30.5 30.5h-212.5-212.5z M23.4,768.75L2.85,747.5 146.7,603.5c79.12-79.2,171.57-171.9,205.44-206l61.59-62-54.42-54.46-54.42-54.46-6.79,6.56c-9.54,9.21-13.81,11.24-23.79,11.3-6.51,0.04-8.91-0.4-12.92-2.37-6.27-3.08-11.57-8.39-14.65-14.65-3.48-7.08-3.44-18.94,0.1-25.6,1.73-3.27,31.12-33.42,97.5-100.05,74.92-75.2,96.07-95.89,100-97.83,7.3-3.59,18.94-3.48,26.04,0.24,10.58,5.54,16.64,15.41,16.71,27.21,0.06,9.48-2.44,14.89-10.96,23.71l-6.73,6.97,130.4,130.4,130.4,130.4,6.65-6.28c9.27-8.74,14.47-11.13,23.97-11.01,5.31,0.07,8.88,0.71,12.23,2.21,5.67,2.53,12.58,9.19,15.25,14.7,2.73,5.64,3.21,16.86,1.01,23.67-1.63,5.06-6.56,10.18-97.36,101.15-70.93,71.07-96.93,96.51-100.64,98.49-4.29,2.28-6.21,2.66-13.5,2.67-6.89,0-9.3-0.42-12.72-2.24-10.6-5.63-16.33-14.27-17.04-25.66-0.63-10.22,1.95-16.42,10.75-25.85l6.88-7.36-54.28-54.28-54.28-54.28L251.77,584.4C138.85,697.48,45.89,790,45.21,790,44.53,790,34.72,780.44,23.4,768.75z M648.3,405l39-39L556.8,235.5,426.3,105l-38.75,38.75c-21.31,21.31-38.75,39.2-38.75,39.75,0,0.99,259.02,260.51,260,260.51,0.28,0,18.05-17.55,39.5-39z"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    </g>
                  </svg>
                  <span className="sm:hidden">Condamnation</span>
                  <span className="hidden sm:inline">Condamnation judiciaire</span>
                </Badge>
              )}
              {/* Catégorie */}
              {event.categorie?.nom && (
                <Badge variant="category">
                  <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {event.categorie.nom}
                </Badge>
              )} 
            </div>
            {/* Date alignée à droite sur mobile */}
            <span className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium shrink-0 sm:order-2">
              <span className="sm:hidden">{formatDateCompact(event.date)}</span>
              <span className="hidden sm:inline">{formatDate(event.date)}</span>
            </span>
          </div>
      </div>
        
        {/* Nom de la marque en dessous sur mobile, intégré dans la ligne sur desktop */}
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mt-2">
          {event.marque?.nom}
        </h3>

      {/* Description */}
      <h4 className="text-xl lg:text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
        {event.titre}
      </h4>

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

      {/* Réponse de la marque */}
      <div className="pt-3">
        {event.reponse ? (
          <a
            href={event.reponse}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-berry-600 hover:text-berry-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Réponse officielle de la marque
          </a>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Aucune réponse officielle de la marque
          </p>
        )}
      </div>
    </div>
  );
}
