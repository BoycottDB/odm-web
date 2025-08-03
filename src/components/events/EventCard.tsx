import { Evenement } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { JudicialCondemnationNotice } from '@/components/ui/JudicialCondemnationNotice';

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
    <div className="relative">
      {/* Notification de condamnation judiciaire */}
      {event.condamnation_judiciaire && <JudicialCondemnationNotice />}
      <div className="relative z-10 bg-white rounded-3xl card-padding shadow-lg border border-berry-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête principal : Marque et Date */}
      <div className="flex flex-col gap-3 mb-4">
          {/* Badges et date alignés sur mobile */}
          <div className="flex items-center justify-between">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
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
            <span className="body-small sm:body-base text-gray-600 font-medium shrink-0 sm:order-2">
              <span className="sm:hidden">{formatDateCompact(event.date)}</span>
              <span className="hidden sm:inline">{formatDate(event.date)}</span>
            </span>
          </div>
      </div>
        
        {/* Nom de la marque en dessous sur mobile, intégré dans la ligne sur desktop */}
        <h3 className="heading-sub font-bold text-gray-900 mt-2">
          {event.marque?.nom}
        </h3>

      {/* Description */}
      <h4 className="heading-sub font-medium text-gray-900 mb-4 leading-relaxed">
        {event.titre}
      </h4>

      {/* Source */}
      {event.source_url && (
        <div className="pt-4 border-t border-gray-100">
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center body-base font-medium text-berry-600 hover:text-berry-700 transition-colors duration-200"
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
            className="inline-flex items-center body-small font-medium text-berry-600 hover:text-berry-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Réponse officielle de la marque
          </a>
        ) : (
          <p className="body-small text-gray-500 italic">
            Aucune réponse officielle de la marque
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
