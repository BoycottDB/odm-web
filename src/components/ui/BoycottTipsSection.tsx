'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Lightbulb, ShoppingBasket, Tag } from 'lucide-react';
import { safeTrack } from '@/lib/analytics';
import Image from 'next/image';
import Link from 'next/link';
import { Marque } from '@/types';

// Titre de section : pastille avec icône, puis libellé
const TitreSection = ({ icone: Icone, children }: { icone: typeof Tag; children: React.ReactNode }) => (
  <h3 className="flex items-center gap-2 mb-3">
    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary-100 text-secondary-700" aria-hidden="true">
      <Icone className="w-4 h-4" />
    </span>
    <span className="font-semibold text-sm md:text-base text-secondary-900">{children}</span>
  </h3>
);

// Pièces qui montent lentement dans le bouton, à vitesses différentes (effet de profondeur),
// très transparentes pour ne pas gêner la lecture ; au survol, à l'appui et quand les conseils
// sont ouverts, elles fuient vers le bord le plus proche.
// Positions fixes pour un rendu identique côté serveur et navigateur.
const PARTICULES = [
  { gauche: 4, taille: 8, duree: 7, delai: -1 },
  { gauche: 11, taille: 12, duree: 9, delai: -6 },
  { gauche: 19, taille: 7, duree: 6, delai: -3 },
  { gauche: 27, taille: 10, duree: 8, delai: -5 },
  { gauche: 35, taille: 6, duree: 5.5, delai: -2 },
  { gauche: 43, taille: 11, duree: 9.5, delai: -8 },
  { gauche: 51, taille: 8, duree: 6.5, delai: -4 },
  { gauche: 59, taille: 13, duree: 10, delai: -2.5 },
  { gauche: 66, taille: 7, duree: 6, delai: -5.5 },
  { gauche: 74, taille: 10, duree: 8.5, delai: -1.5 },
  { gauche: 82, taille: 6, duree: 5, delai: -3.5 },
  { gauche: 89, taille: 12, duree: 9, delai: -7 },
  { gauche: 96, taille: 8, duree: 7, delai: -4.5 },
];

const PieceSvg = ({ taille }: { taille: number }) => (
  <svg width={taille} height={taille} viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="9" fill="#f6c945" stroke="#c9971c" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="5.5" fill="none" stroke="#c9971c" strokeWidth="1" />
  </svg>
);

const ParticulesPieces = () => (
  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
    {PARTICULES.map((particule, index) => (
      <span
        key={index}
        className="absolute top-full animate-particule"
        style={{
          left: `${particule.gauche}%`,
          opacity: 0.77,
          animationDuration: `${particule.duree}s`,
          animationDelay: `${particule.delai}s`,
        }}
      >
        <span
          className="particule-fuite block"
          style={{
            '--fuite': particule.gauche < 50
              ? `-${particule.gauche * 5 + 40}px`
              : `${(100 - particule.gauche) * 5 + 40}px`,
          } as React.CSSProperties}
        >
          <PieceSvg taille={particule.taille} />
        </span>
      </span>
    ))}
  </span>
);

// Déclaration globale pour étendre le type Window
declare global {
  interface Window {
    handleImageClick?: (src: string, groupIndex?: string) => void;
  }
}

const ANCRE_CONSEILS = 'conseils';

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

  const ancreRef = useRef<HTMLDivElement>(null);

  // Arrivée via l'ancre #conseils (ex. depuis l'accueil) : conseils ouverts d'emblée.
  // On défile nous-mêmes, une fois la page affichée, pour arriver toujours au même endroit
  // quel que soit le scroll de la page précédente (les liens vers l'ancre ont scroll={false}).
  useEffect(() => {
    if (window.location.hash !== `#${ANCRE_CONSEILS}`) return;
    setIsExpanded(true);
    // Léger délai, comme pour le défilement vers la liste des marques : laisse la navigation se terminer
    const minuteur = setTimeout(() => {
      ancreRef.current?.scrollIntoView({ block: 'start' });
    }, 100);
    return () => clearTimeout(minuteur);
  }, []);

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

  // Tracking: vue des Boycott Tips quand la section s'ouvre (dédupliqué par session et par marque)
  useEffect(() => {
    if (isExpanded) {
      try {
        const storageKey = 'odm_boycott_tips_viewed';
        const trackKey = String(marque.id);
        const raw = typeof window !== 'undefined' ? sessionStorage.getItem(storageKey) : null;
        let viewed: Record<string, boolean> = {};
        if (raw) {
          try { viewed = JSON.parse(raw) || {}; } catch { viewed = {}; }
        }

        if (!viewed[trackKey]) {
          safeTrack('boycott_tips_view', { marque_id: marque.id });
          viewed[trackKey] = true;
          sessionStorage.setItem(storageKey, JSON.stringify(viewed));
        }
      } catch (e) {
        // En cas d'échec du storage, on track quand même (best-effort)
        safeTrack('boycott_tips_view', { marque_id: marque.id });
      }
    }
  }, [isExpanded, marque.id]);

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
              const raw = urlMatch ? urlMatch[2] : '';
              if (!raw) return '';
              const resolved = /^(https?:|data:|blob:)/i.test(raw) || raw.startsWith('/')
                ? raw
                : '/' + raw.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
              return resolved;
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
      contenu: "**Ne travaillez pas pour cette marque.** <br> Si vous cherchez un emploi, privilégiez les entreprises dont les valeurs correspondent aux vôtres. <br>Si vous êtes déjà en poste dans cette boîte, ne prenez pas une décision hâtive qui pourrait vous mettre dans une galère financière. Prenez le temps de trouver une porte de sortie et n'hésitez pas à demander à vos dirigeants de rendre des comptes en attendant. Cœur sur vous, le marché du travail est dur 🫶"
    },
    {
      contenu: "**Privilégiez les petites enseignes locales.** <br>Même si elles ne sont pas parfaitement \"clean\", elles causeront toujours moins de tort à leur échelle que les grandes multinationales."
    },
    {
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
          const resolvedSrc = (/^(https?:|data:|blob:)/i.test(src) || src.startsWith('/'))
            ? src
            : '/' + src.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
          return `<img src="${resolvedSrc}" alt="${alt}" onclick="handleImageClick('${resolvedSrc}', '${currentGroupIndex}')" style="cursor: pointer;" data-image-index="${currentIndex}" data-group-index="${currentGroupIndex}" />`;
        });
        return `<div class="image-group">${imageContent}</div>`;
      }) // groupes d'images [img-group]...[/img-group]
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match: string, alt: string, src: string) => {
        const currentIndex = imageIndex++;
        const resolvedSrc = (/^(https?:|data:|blob:)/i.test(src) || src.startsWith('/'))
          ? src
          : '/' + src.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
        return `<img src="${resolvedSrc}" alt="${alt}" class="max-w-full h-auto rounded-lg my-2" onclick="handleImageClick('${resolvedSrc}')" style="cursor: pointer;" data-image-index="${currentIndex}" />`;
      }) // images individuelles ![alt](url)
      .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (match: string, text: string, url: string) => {
        // Valider que l'URL commence par http:// ou https://
        const isValidUrl = /^https?:\/\//.test(url);
        if (isValidUrl) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-dark underline font-medium">${text}</a>`;
        }
        return match; // Retourner le texte original si l'URL n'est pas valide
      }) // liens [texte](url) - negative lookbehind pour éviter les images ![alt](url)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **gras**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italique*
      .replace(/^• (.+)$/gm, '<div class="flex items-start"><span class="text-primary mr-2">•</span><span>$1</span></div>') // listes avec •
      .replace(/\n/g, '<br />') // tous les retours à la ligne
      .replace(/(<\/div>)<br \/>/g, '$1'); // supprimer les <br /> immédiatement après les éléments de liste
  };

  const texteConseil = 'text-sm text-neutral-800 leading-snug boycott-content';


  return (
    <div id={ANCRE_CONSEILS} ref={ancreRef} className="scroll-mt-24">
      {/* Bouton pour ouvrir/fermer */}
      <div className="text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="group relative inline-flex items-center justify-center px-3 py-3 md:px-6 md:py-4 overflow-hidden text-base md:text-lg font-bold text-white transition-all duration-300 ease-in-out bg-primary rounded-2xl hover:scale-105 transform hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-secondary-700/30"
        >
          <ParticulesPieces />

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
            <span className="relative z-10 text-white [text-shadow:_2px_2px_0_rgba(152,16,91,0.5),_-2px_-2px_0_rgba(152,16,91,0.5),_2px_-2px_0_rgba(152,16,91,0.5),_-2px_2px_0_rgba(152,16,91,0.5)]">
              Je ne veux plus leur donner mon argent
            </span>
          </div>

          {/* Assombrissement au survol, à l'appui et quand les conseils sont ouverts */}
          <div className="absolute inset-0 rounded-2xl bg-secondary-800 opacity-0 group-hover:opacity-20 group-active:opacity-20 group-aria-expanded:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Section dépliable avec animation */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-none mt-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className={`border rounded-2xl p-4 md:p-6 space-y-4 bg-secondary-50 border-secondary-200`}>
          {marque.message_boycott_tips && (
            <section className={`bg-white border rounded-xl p-4 border-secondary-200`}>
              <TitreSection icone={Tag}>Conseils spécifiques pour {marque.nom}</TitreSection>
              <div
                className={texteConseil}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.message_boycott_tips) }}
              />
            </section>
          )}

          {marque.secteur_marque?.message_boycott_tips && (
            <section className={`bg-white border rounded-xl p-4 border-secondary-200`}>
              <TitreSection icone={ShoppingBasket}>Conseils pour le secteur {marque.secteur_marque.nom}</TitreSection>
              <div
                className={texteConseil}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(marque.secteur_marque.message_boycott_tips) }}
              />
            </section>
          )}

          <section className={`bg-white border rounded-xl p-4 border-secondary-200`}>
            <TitreSection icone={Lightbulb}>Conseils généraux pour toutes marques</TitreSection>
            <ul className="space-y-3">
              {messagesGeneriques.map((message, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 text-secondary-600`} aria-hidden="true" />
                  <div
                    className={texteConseil}
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(message.contenu) }}
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* Questions que se pose souvent le visiteur au moment d'agir */}
          <p className="text-sm text-neutral-700 text-center">
            Pour aller plus loin :{' '}
            <Link href="/faq/pourquoi" className="font-medium text-secondary-800 underline hover:text-secondary-900">
              Boycotter, ça sert vraiment ?
            </Link>
            <span className="mx-2 text-neutral-400" aria-hidden="true">·</span>
            <Link href="/faq/alternatives" className="font-medium text-secondary-800 underline hover:text-secondary-900">
              Pourquoi on ne propose pas d&apos;alternatives ?
            </Link>
          </p>

          <p className="text-xs text-neutral-500 text-center">
            Ces conseils sont donnés à titre informatif pour vous aider dans vos choix de consommation.
          </p>
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