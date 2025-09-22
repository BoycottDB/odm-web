import { ControverseBeneficiaire } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { JudicialCondemnationNotice } from '@/components/ui/JudicialCondemnationNotice';

interface ControverseCardProps {
  controverse: ControverseBeneficiaire;
}

export function ControverseCard({ controverse }: ControverseCardProps) {
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
    <div className={`relative ${controverse.condamnation_judiciaire && 'mt-6'}`}>
      {/* Notification de condamnation judiciaire */}
      {controverse.condamnation_judiciaire && <JudicialCondemnationNotice />}
      <div className="relative z-10 bg-white rounded-3xl card-padding shadow-lg border border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* En-tête principal : Badges et Date */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Badges et date alignés sur mobile */}
          <div className="flex items-center justify-between">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Catégorie */}
              {controverse.Categorie && (
                <Badge variant="category" category={controverse.Categorie}>
                  {controverse.Categorie.nom}
                </Badge>
              )}
            </div>
            {/* Date alignée à droite sur mobile */}
            {controverse.date && (
              <span className="body-small sm:body-base text-neutral-600 font-medium shrink-0 sm:order-2">
                <span className="sm:hidden">{formatDateCompact(controverse.date)}</span>
                <span className="hidden sm:inline">{formatDate(controverse.date)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Titre de la controverse */}
        <h4 className="heading-sub font-medium text-neutral-900 mb-4 leading-snug">
          {controverse.titre}
        </h4>

        {/* Source */}
        {controverse.source_url && (
          <div className="pt-4 border-t border-neutral">
            <a
              href={controverse.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center body-base font-medium text-primary hover:text-primary transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir la source
            </a>
          </div>
        )}

        {/* Réponse officielle du bénéficiaire */}
        <div className="pt-3">
          {controverse.reponse ? (
            <a
              href={controverse.reponse}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center body-small font-medium text-primary hover:text-primary transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Réponse officielle du bénéficiaire
            </a>
          ) : (
            <p className="body-small text-neutral-500 italic">
              Aucune réponse officielle du bénéficiaire
            </p>
          )}
        </div>
      </div>
    </div>
  );
}