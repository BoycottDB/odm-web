'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Marque } from '@/types';

// Déclaration globale pour étendre le type Window
declare global {
  interface Window {
    handleImageClick?: (src: string, groupIndex?: string) => void;
  }
}

interface BoycottTipsSectionProps {
  marque: Marque;
}

interface ImageGroup {
  images: string[];
  currentIndex: number;
}

export default function BoycottTipsSection({ marque }: BoycottTipsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageGroup, setCurrentImageGroup] = useState<ImageGroup | null>(null);

  // Effet pour attacher les event listeners aux images après le rendu
  useEffect(() => {
    if (isExpanded) {
      // Définir la fonction globalement pour qu'elle soit accessible depuis onclick
      window.handleImageClick = (src: string, groupIndex?: string) => {
        setSelectedImage(src);
        
        // Si l'image fait partie d'un groupe, récupérer les informations du groupe
        if (groupIndex !== undefined) {
          const groupId = parseInt(groupIndex);
          const imageGroups = extractImageGroups();
          if (imageGroups[groupId]) {
            const images = imageGroups[groupId];
            const currentIndex = images.indexOf(src);
            if (currentIndex !== -1) {
              setCurrentImageGroup({ images, currentIndex });
            }
          }
        } else {
          setCurrentImageGroup(null);
        }
      };

      return () => {
        delete window.handleImageClick;
      };
    }
  }, [isExpanded]);

  // Fonction pour extraire tous les groupes d'images du contenu
  const extractImageGroups = (): string[][] => {
    const groups: string[][] = [];
    const texts = [
      marque.message_boycott_tips,
      marque.secteur_marque?.message_boycott_tips,
      ...messagesGeneriques.map(m => m.contenu)
    ].filter(Boolean) as string[];

    texts.forEach(text => {
      const groupMatches = text.match(/\[img-group\]([\s\S]*?)\[\/img-group\]/g);
      if (groupMatches) {
        groupMatches.forEach(groupMatch => {
          const imageMatches = groupMatch.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
          if (imageMatches) {
            const imageUrls = imageMatches.map(match => {
              const urlMatch = match.match(/!\[([^\]]*)\]\(([^)]+)\)/);
              return urlMatch ? urlMatch[2] : '';
            }).filter(Boolean);
            groups.push(imageUrls);
          }
        });
      }
    });

    return groups;
  };

  // Navigation dans le groupe d'images
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentImageGroup) return;

    const newIndex = direction === 'prev' 
      ? (currentImageGroup.currentIndex - 1 + currentImageGroup.images.length) % currentImageGroup.images.length
      : (currentImageGroup.currentIndex + 1) % currentImageGroup.images.length;

    const newImageSrc = currentImageGroup.images[newIndex];
    setSelectedImage(newImageSrc);
    setCurrentImageGroup({
      ...currentImageGroup,
      currentIndex: newIndex
    });
  };

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          setSelectedImage(null);
          setCurrentImageGroup(null);
          break;
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [selectedImage, currentImageGroup]);

  // Vérifier s'il y a des tips à afficher
  const hasBoycottTips = marque.message_boycott_tips || marque.secteur_marque?.message_boycott_tips;
  
  if (!hasBoycottTips) {
    return null;
  }

  // Messages génériques hardcodés (option 3)
  const messagesGeneriques = [
    {
      // titre: "Emploi et carrière",
      contenu: "**Ne travaillez pas pour cette marque.** <br> Si vous cherchez un emploi, privilégiez les entreprises dont les valeurs correspondent aux vôtres. <br>Si vous êtes déjà en poste dans cette boîte, ne prenez pas une décision hâtive qui pourrait vous mettre dans une galère financière. Prenez le temps de trouver une porte de sortie et n'hésitez pas à demander à vos dirigeants de rendre des comptes en attendant. Cœur sur vous, le marché du travail est dur."
    },
    {
      // titre: "Alternatives responsables", 
      contenu: "**Privilégiez les petites enseignes locales.** <br>Même si elles ne sont pas parfaitement \"clean\", elles causeront toujours moins de tort à leur échelle que les grandes multinationales."
    },
    {
      // titre: "Réflexion sur le besoin",
      contenu: "**Remettez en question votre besoin d'achat.** <br> Avant tout achat, demandez-vous : \"Ai-je vraiment besoin de ce produit aujourd'hui ?\""
    }
  ];

  // Fonction pour formater le markdown basique avec gestion des clics sur images et liens
  const formatMarkdown = (text: string) => {
    let imageIndex = 0;
    let groupIndex = 0;
    
    return text
      .replace(/\[img-group\]([\s\S]*?)\[\/img-group\]/g, (_, content) => {
        const currentGroupIndex = groupIndex++;
        // Traiter le contenu du groupe pour extraire les images avec clics
        const imageContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match: string, alt: string, src: string) => {
          const currentIndex = imageIndex++;
          return `<img src="${src}" alt="${alt}" onclick="handleImageClick('${src}', '${currentGroupIndex}')" style="cursor: pointer;" data-image-index="${currentIndex}" data-group-index="${currentGroupIndex}" />`;
        });
        return `<div class="image-group">${imageContent}</div>`;
      }) // groupes d'images [img-group]...[/img-group]
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match: string, alt: string, src: string) => {
        const currentIndex = imageIndex++;
        return `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg my-2" onclick="handleImageClick('${src}')" style="cursor: pointer;" data-image-index="${currentIndex}" />`;
      }) // images individuelles ![alt](url)
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

  return (
    <div>
      {/* Bouton pour ouvrir/fermer */}
      <div className="text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative inline-flex items-center justify-center px-3 py-3 md:px-6 md:py-4 overflow-hidden text-base md:text-lg font-bold text-white transition-all duration-300 ease-in-out bg-primary rounded-2xl hover:scale-105 transform hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          {/* Effet de brillance shiny */}
          <div className="absolute inset-0 w-0 h-full transition-all duration-300 ease-out bg-white opacity-10 group-hover:w-full"></div>
          
          {/* Icône */}
          <div className="relative flex items-center space-x-2 md:space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg 
                className={`w-3 h-3 md:w-4 md:h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="relative z-10">
              Comment bien boycotter {marque.nom} ?
            </span>
          </div>
          
          {/* Effet de pulse */}
          <div className="absolute inset-0 rounded-2xl bg-primary-hover opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
        </button>
      </div>

      {/* Section dépliable avec animation */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none mt-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6">
          {/* Header avec bouton fermer */}
          <div className="flex items-center justify-between pb-4 mb-2">
            <div className="flex-1">
              <h2 className="heading-sub font-bold text-neutral-900 mb-2">
                Comment bien boycotter {marque.nom} ?
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
                className="body-small text-neutral-700 leading-snug boycott-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.message_boycott_tips) }}
              />
            </div>
          )}

          {/* Message du secteur */}
          {marque.secteur_marque?.message_boycott_tips && (
            <div className="p-4 bg-secondary-light border border-secondary rounded-xl">
              <div className="flex items-center mb-3">
                <h3 className="body-large font-semibold text-neutral-900">
                  Conseils pour le secteur {marque.secteur_marque.nom}
                </h3>
              </div>
              <div 
                className="body-small text-neutral-700 leading-snug boycott-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.secteur_marque.message_boycott_tips) }}
              />
            </div>
          )}

          {/* Messages génériques */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="body-large font-semibold text-neutral-900">
                Conseils généraux pour toutes marques
              </h3>
            </div>
            
            {messagesGeneriques.map((message, index) => (
              <div key={index} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                {/* <h4 className="body-base font-medium text-neutral-900 mb-2">
                  {message.titre}
                </h4> */}
                <div 
                  className="body-small text-neutral-700 leading-snug boycott-content"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(message.contenu) }}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-4 text-center">
            <p className="body-xs text-neutral-500">
              Ces conseils sont donnés à titre informatif pour vous aider dans vos choix de consommation.
            </p>
          </div>
        </div>
      </div>

      {/* Modal pour affichage d'image en grand */}
      {selectedImage && (
        <div 
          className="fixed inset-0 backdrop-blur-xs bg-black/50 flex items-center justify-center z-50 p-7"
          onClick={() => {
            setSelectedImage(null);
            setCurrentImageGroup(null);
          }}
        >
          <div className="relative max-w-md md:max-w-xl flex items-center">
            {/* Bouton navigation gauche */}
            {currentImageGroup && currentImageGroup.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all z-10"
                aria-label="Image précédente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Image agrandie"
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
                unoptimized
              />
              
              {/* Bouton fermeture */}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setCurrentImageGroup(null);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
                aria-label="Fermer"
              >
                ×
              </button>

              {/* Indicateur de position dans le groupe */}
              {currentImageGroup && currentImageGroup.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {currentImageGroup.currentIndex + 1} / {currentImageGroup.images.length}
                </div>
              )}
            </div>

            {/* Bouton navigation droite */}
            {currentImageGroup && currentImageGroup.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all z-10"
                aria-label="Image suivante"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}