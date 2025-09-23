import { Evenement, Marque } from '@/types';
import { JudicialCondemnationNotice } from '@/components/ui/JudicialCondemnationNotice';

interface EventCardProps {
  event: Evenement;
  marque?: Marque | null; // Marque optionnelle quand event.marque n'est pas disponible
}

export function EventCard({ event, marque }: EventCardProps) {
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

  const formatMarqueName = (nom: string) => {
    const match = nom.match(/^([^(]+)(\(.+\))$/);
    if (match) {
      const [, mainName, parentheses] = match;
      return {
        mainName: mainName.trim(),
        parentheses: parentheses.trim()
      };
    }
    return { mainName: nom, parentheses: null };
  };

  return (
    <div className={`relative ${event.condamnation_judiciaire && 'mt-6'}`}>
      {/* Notification de condamnation judiciaire */}
      {event.condamnation_judiciaire && <JudicialCondemnationNotice />}
      <div className="relative z-10 bg-white rounded-3xl card-padding shadow-lg border border-primary-medium hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* En-tête principal : Marque et Date */}
      <div className="flex items-center justify-between mb-2">
        {/* Nom de la marque */}
        <h3 className="heading-sub font-bold text-primary-dark">
          {(() => {
            const marqueNom = event.marque?.nom || marque?.nom;
            if (marqueNom) {
              const { mainName, parentheses } = formatMarqueName(marqueNom);
              return (
                <>
                  {mainName}
                  {parentheses && (
                    <span className="heading-sub-brackets font-normal ml-1">{parentheses}</span>
                  )}
                </>
              );
            }
            return null;
          })()}
        </h3>
        
        {/* Date alignée à droite */}
        <span className="body-small sm:body-base text-primary-dark font-medium shrink-0">
          <span className="sm:hidden">{formatDateCompact(event.date)}</span>
          <span className="hidden sm:inline">{formatDate(event.date)}</span>
        </span>
      </div>

      {/* Badges commentés - peut-être à retirer */}
      {/* 
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {event.categorie?.nom && (
          <Badge variant="category" category={event.categorie}>
            {event.categorie.nom}
          </Badge>
        )}
      </div>
      */}

      {/* Description */}
      <h4 className="heading-sub font-medium text-neutral-900 mb-4 leading-snug">
        {event.titre}
      </h4>

      {/* Source */}
      {event.source_url && (
        <div className="pt-4 border-t border-neutral">
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center body-base font-medium text-primary hover:text-primary-700 transition-colors duration-200"
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
            className="inline-flex items-center body-base font-medium text-primary hover:text-primary-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Réponse officielle de la marque
          </a>
        ) : (
          <p className="body-small text-neutral-500 italic">
            Aucune réponse officielle de la marque
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
