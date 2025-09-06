'use client';

import { User, Building2, ExternalLink, X } from 'lucide-react';
import { DirigeantComplet, TypeBeneficiaire, ControverseBeneficiaire } from '@/types';
import { MarquesBadges } from '@/components/ui/MarquesBadges';

// Fonction pour formater le markdown basique avec gestion des liens
const formatMarkdown = (text: string) => {
  if (!text) return '';
  
  return text
    .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (match: string, text: string, url: string) => {
      // Valider que l'URL commence par http:// ou https://
      const isValidUrl = /^https?:\/\//.test(url);
      if (isValidUrl) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-hover underline font-medium">${text}</a>`;
      }
      return match; // Retourner le texte original si l'URL n'est pas valide
    }) // liens [texte](url) - negative lookbehind pour éviter les images ![alt](url)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **gras**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italique*
    .replace(/^• (.+)$/gm, '<div class="flex items-start"><span class="text-primary mr-2">•</span><span>$1</span></div>') // listes avec •
    .replace(/\n/g, '<br />') // tous les retours à la ligne
    .replace(/(<\/div>)<br \/>/g, '$1'); // supprimer les <br /> immédiatement après les éléments de liste
};

interface DirigeantCardProps {
  dirigeant: DirigeantComplet;
  onClose?: () => void;
}

// Nouveau composant pour afficher toutes les controverses de façon compacte
const ControversesSection = ({ 
  controverses 
}: { 
  controverses: ControverseBeneficiaire[];
}) => {
  if (!controverses || controverses.length === 0) {
    return (
      <div className="text-neutral-500 italic text-sm">
        Aucune controverse documentée
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {controverses.map((controverse) => (
        <div key={controverse.id} className="flex items-start gap-2 text-sm">
          {/* Bullet point */}
          <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1"></span>
          
          {/* Contenu de la controverse */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-neutral-900 leading-tight mb-1">
              {controverse.titre}
            </div>
            <a 
              href={controverse.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-primary hover:text-primary-600 hover:underline transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {controverse.source_url.includes('://') 
                  ? new URL(controverse.source_url).hostname 
                  : controverse.source_url}
              </span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export function DirigeantCard({ dirigeant, onClose }: DirigeantCardProps) {
  // Fonction helper pour les labels
  const getTypeLabel = (type: TypeBeneficiaire): string => {
    return type === 'groupe' ? 'groupe' : 'dirigeant';
  };

  const getTypeIcon = (type: TypeBeneficiaire) => {
    return type === 'groupe' ? Building2 : User;
  };

  const Icon = getTypeIcon(dirigeant.type_beneficiaire);
  const typeLabel = getTypeLabel(dirigeant.type_beneficiaire);
  
  // Déterminer si c'est un lien transitif
  const isTransitif = dirigeant.source_lien === 'transitif';
  
  // Classes CSS selon le type de lien
  const cardClasses = isTransitif 
    ? "mt-6 bg-gradient-to-r from-primary-50 to-primary-50 rounded-3xl card-padding shadow-lg border-2 border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    : "mt-6 bg-gradient-to-r from-primary-50 to-primary-50 rounded-3xl card-padding shadow-lg border-2 border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300";

  return (
    <div className={cardClasses}>
      {/* En-tête bénéficiaire controversé */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            isTransitif ? 'bg-lavande-100' : 'bg-primary-50'
          }`}>
          <Icon className={`w-7 h-7 flex-shrink-0 ${
            isTransitif ? 'text-lavande-600' : 'text-primary'
          }`} />
          </div>
          <div>         
            <div className={`body-small ${
             isTransitif ? 'text-lavande-600' : 'text-primary'
            }`}>
              Vos achats <strong className="body-large font-semibold">{dirigeant.marque_nom}</strong> profitent {isTransitif ? 'indirectement' : 'directement'} à ce {typeLabel.toLowerCase()} controversé{isTransitif ? ' via ' : ''}<strong className="body-large font-semibold">{isTransitif ? dirigeant.beneficiaire_parent_nom : ''}</strong>
            </div>
            {/* Nom du dirigeant */}
            <h3 className="heading-sub font-bold text-neutral-900">
              {dirigeant.nom}
            </h3>
          </div>
        </div>
        
        {/* Bouton de fermeture */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:shadow-sm transition-colors flex-shrink-0"
            title="Fermer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>


      {/* Informations financières */}
      <div className="space-y-4 mb-6">
        <div>
          <div className={`font-semibold body-small mb-1 ${
              isTransitif ? 'text-lavande-600' : 'text-primary'
            }`}>
            Lien financier :
          </div>
          <div className="text-neutral-700">
            {dirigeant.lien_financier}
          </div>
        </div>
        
        <div>
          <div className={`font-semibold body-small mb-1 text-primary`}>
            Impact de vos achats :
          </div>
          <div 
            className="text-neutral-900"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(dirigeant.impact_description) }}
          />
        </div>
      </div>

      {/* Controverses - NOUVEAU composant */}
      <div className="mb-6">
        <div className={`font-semibold body-small mb-3 text-primary`}>
          Controverses documentées :
        </div>
        <ControversesSection 
          controverses={dirigeant.controverses}
        />
      </div>

      {/* Section marques directement liées */}
      {dirigeant.marques_directes && dirigeant.marques_directes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-primary">
          <div className="font-semibold text-black body-small mb-3">
            Autres marques directement liées à {dirigeant.nom} ({dirigeant.marques_directes.length}) :
          </div>
          <MarquesBadges 
            marques={dirigeant.marques_directes}
            variant="public"
          />
        </div>
      )}

      {/* Sections marques indirectement liées */}
      {dirigeant.marques_indirectes && Object.keys(dirigeant.marques_indirectes).length > 0 && (
        <div className="mt-6 pt-4 border-t border-primary space-y-4">
          {Object.entries(dirigeant.marques_indirectes).map(([beneficiaireIntermediaire, marques]) => (
            <div key={beneficiaireIntermediaire}>
              <div className="font-semibold text-black body-small mb-3">
                Autres marques indirectement liées à {dirigeant.nom} via {beneficiaireIntermediaire} ({marques.length}) :
              </div>
              <MarquesBadges 
                marques={marques}
                variant="indirect"
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}