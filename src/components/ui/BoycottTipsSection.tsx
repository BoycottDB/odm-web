'use client';

import { useState } from 'react';
import { Marque } from '@/types';

interface BoycottTipsSectionProps {
  marque: Marque;
}

export default function BoycottTipsSection({ marque }: BoycottTipsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Vérifier s'il y a des tips à afficher
  const hasBoycottTips = marque.message_boycott_tips || marque.secteur_marque?.message_boycott_tips;
  
  if (!hasBoycottTips) {
    return null;
  }

  // Messages génériques hardcodés (option 3)
  const messagesGeneriques = [
    {
      titre: "Emploi et carrière",
      contenu: "**Ne pas travailler pour cette marque.** Si vous cherchez un emploi, privilégiez les entreprises dont les valeurs correspondent aux vôtres."
    },
    {
      titre: "Alternatives responsables", 
      contenu: "**Privilégiez les petites enseignes locales.** Même si elles ne sont pas parfaitement \"clean\", elles causeront toujours moins de tort à leur échelle que les grandes multinationales."
    },
    {
      titre: "Réflexion sur le besoin",
      contenu: "**Remettez en question votre besoin d'achat.** Avant tout achat, demandez-vous : \"Ai-je vraiment besoin de ce produit aujourd'hui ?\""
    }
  ];

  // Fonction pour formater le markdown basique
  const formatMarkdown = (text: string) => {
    return text
      .replace(/\[img-group\]([\s\S]*?)\[\/img-group\]/g, (_, content) => {
        // Traiter le contenu du groupe pour extraire les images
        const imageContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
        return `<div class="image-group">${imageContent}</div>`;
      }) // groupes d'images [img-group]...[/img-group]
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />') // images individuelles ![alt](url)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **gras**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italique*
      .replace(/^• (.+)$/gm, '<div class="flex items-start"><span class="text-primary mr-2">•</span><span>$1</span></div>') // listes avec •
      .replace(/\n/g, '<br />') // tous les retours à la ligne
      .replace(/(<\/div>)<br \/>/g, '$1'); // supprimer les <br /> immédiatement après les éléments de liste
  };

  return (
    <div className="mb-8">
      {/* Bouton pour ouvrir/fermer */}
      <div className="text-center mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-lg font-bold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary-hover to-primary rounded-2xl hover:scale-105 transform hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          {/* Effet de brillance shiny */}
          <div className="absolute inset-0 w-0 h-full transition-all duration-300 ease-out bg-white opacity-10 group-hover:w-full"></div>
          
          {/* Icône */}
          <div className="relative flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg 
                className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="relative z-10">
              Comment bien boycotter {marque.nom}
            </span>
          </div>
          
          {/* Effet de pulse */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-primary-hover opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
        </button>
      </div>

      {/* Section dépliable avec animation */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
          {/* Header avec bouton fermer */}
          <div className="flex items-center justify-between pb-4 mb-2">
            <div className="flex-1">
              <h2 className="heading-sub font-bold text-neutral-900 mb-2">
                Comment bien boycotter {marque.nom}
              </h2>
              <p className="body-small text-neutral-600">
                Conseils pratiques pour un boycott efficace
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message spécifique à la marque */}
          {marque.message_boycott_tips && (
            <div className="p-4 bg-warning-light border border-warning rounded-xl mb-8">
              <div className="flex items-center mb-3">
                <h3 className="body-large font-semibold text-neutral-900">
                  Conseils spécifiques pour {marque.nom}
                </h3>
              </div>
              <div 
                className="body-small text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.message_boycott_tips) }}
              />
            </div>
          )}

          {/* Message du secteur */}
          {marque.secteur_marque?.message_boycott_tips && (
            <div className="p-4 bg-primary-light border border-primary rounded-xl">
              <div className="flex items-center mb-3">
                <h3 className="body-large font-semibold text-neutral-900">
                  Conseils généraux pour le secteur &quot;{marque.secteur_marque.nom}&quot;
                </h3>
              </div>
              <div 
                className="body-small text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.secteur_marque.message_boycott_tips) }}
              />
            </div>
          )}

          {/* Messages génériques */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="body-large font-semibold text-neutral-900">
                Conseils généraux pour tout boycott
              </h3>
            </div>
            
            {messagesGeneriques.map((message, index) => (
              <div key={index} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                <h4 className="body-base font-medium text-neutral-900 mb-2">
                  {message.titre}
                </h4>
                <div 
                  className="body-small text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(message.contenu) }}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-neutral-200 text-center">
            <p className="body-xs text-neutral-500">
              Ces conseils sont donnés à titre informatif pour vous aider dans vos choix de consommation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}