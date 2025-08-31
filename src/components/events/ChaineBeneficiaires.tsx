'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { BeneficiaireComplet, TypeBeneficiaire, ControverseBeneficiaire } from '@/types';
import { MarquesBadges } from '@/components/ui/MarquesBadges';
import { dataService } from '@/lib/services/dataService';
import { ControverseCard } from './ControverseCard';

interface ChaineNode {
  beneficiaire: {
    id: number;
    nom: string;
    controverses: Array<{
      id: number;
      beneficiaire_id: number;
      titre: string;
      source_url: string;
      ordre: number;
      created_at: string;
      updated_at: string;
    }>;
    impact_generique?: string;
    type_beneficiaire: string;
  };
  niveau: number;
  relations_suivantes: Array<{
    id: number;
    beneficiaire_source_id: number;
    beneficiaire_cible_id: number;
    type_relation: string;
    description_relation?: string;
  }>;
  lien_financier: string;
  marques_directes: Array<{
    id: number;
    nom: string;
  }>;
  marques_indirectes: Record<string, Array<{
    id: number;
    nom: string;
  }>>;
}

interface ChaineBeneficiaires {
  marque_nom: string;
  marque_id: number;
  chaine: ChaineNode[];
  profondeur_max: number;
}

interface ChaineBeneficiairesProps {
  marqueId: number;
  profondeurMax?: number;
}

// Styles uniformes pour tous les niveaux
const getUniformStyles = () => ({
  background: 'bg-white border-primary',
  iconColor: 'text-primary'
});

const getGridColumns = (count: number): string => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
};

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

// Composant pour afficher les controverses (version compacte)
const ControversesSection = ({ 
  controverses 
}: { 
  controverses: ControverseBeneficiaire[];
}) => {
  if (!controverses || controverses.length === 0) {
    return (
      <div className="text-neutral-500 italic text-sm py-2">
        Aucune controverse documentée
      </div>
    );
  }

  // Trier par date (plus récent en premier), puis par ordre
  const controversesSortees = [...controverses].sort((a, b) => {
    // D'abord par date si elle existe
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    
    // Puis par ordre
    return a.ordre - b.ordre;
  });

  return (
    <div className="space-y-3">
      {controversesSortees.map((controverse) => (
        <div key={controverse.id} className="relative">
          <div className="bg-white border border-primary rounded-lg p-3 hover:shadow-sm transition-shadow">
            {/* Header : Titre + Date */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm text-neutral-900 leading-tight pr-2">
                {controverse.titre}
              </h4>
              {controverse.date && (
                <span className="text-xs text-neutral-500 font-medium flex-shrink-0">
                  {new Date(controverse.date).toLocaleDateString('fr-FR', {
                    year: '2-digit',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>

            {/* Footer : Liens Source + Réponse + Condamnation */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <a 
                href={controverse.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-primary font-medium hover:text-primary-600 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Source
              </a>
              
              {controverse.reponse && (
                <a 
                  href={controverse.reponse}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium text-primary hover:text-primary-600 transition-colors"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Réponse
                </a>
              )}

              {controverse.condamnation_judiciaire && (
                <span className="inline-flex items-center text-xs text-primary font-medium">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Condamnation judiciaire
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant pour le header d'un bénéficiaire
interface BeneficiaireHeaderProps {
  beneficiaire: BeneficiaireComplet;
  isExpanded: boolean;
  onToggle: () => void;
  niveau: number;
  beneficiaireIndex: number;
}

const BeneficiaireHeader = ({ 
  beneficiaire, 
  isExpanded, 
  onToggle, 
  niveau, 
  beneficiaireIndex 
}: BeneficiaireHeaderProps) => {
  const Icon = beneficiaire.type_beneficiaire === 'groupe' ? Building2 : User;
  const styles = getUniformStyles();
  
  return (
    <button
      key={`niveau-${niveau}-${beneficiaire.id}-${beneficiaireIndex}`}
      onClick={onToggle}
      className={`${styles.background} ${isExpanded ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'} border-2 p-4 text-left`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className={`w-8 h-8 ${styles.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <div className="font-semibold text-base truncate">{beneficiaire.nom}</div>
              {/* {beneficiaire.beneficiaire_parent_nom && (
                <div className="text-xs opacity-75 flex-shrink-0">
                  via {beneficiaire.beneficiaire_parent_nom}
                </div>
              )} */}
            </div>
            <div className="text-xs opacity-75 truncate">
              {beneficiaire.lien_financier}
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>
    </button>
  );
};

export default function ChaineBeneficiaires({ marqueId, profondeurMax = 5 }: ChaineBeneficiairesProps) {
  const [chaine, setChaine] = useState<ChaineBeneficiaires | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedBeneficiaire, setExpandedBeneficiaire] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueId) return;

    const fetchChaine = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await dataService.getBeneficiairesChaine(marqueId, profondeurMax);
        setChaine(data as ChaineBeneficiaires);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la chaîne');
      } finally {
        setLoading(false);
      }
    };

    fetchChaine();
  }, [marqueId, profondeurMax]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpandedBeneficiaire(null);
      }
    };

    if (expandedBeneficiaire) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [expandedBeneficiaire]);

  // Toggle expansion d'un bénéficiaire (un seul à la fois)
  const toggleBeneficiaire = (uniqueId: string) => {
    setExpandedBeneficiaire(prev => prev === uniqueId ? null : uniqueId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-berry-500"></div>
        <span className="ml-3 text-gray-600">Chargement de la chaîne...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">❌ {error}</p>
      </div>
    );
  }

  if (!chaine || chaine.chaine.length === 0) {
    return null; // Ne rien afficher si pas de chaîne
  }

  // Organiser les bénéficiaires par niveau
  const beneficiairesParNiveau = chaine.chaine.reduce((acc, node) => {
    if (!acc[node.niveau]) acc[node.niveau] = [];
    acc[node.niveau].push(node);
    return acc;
  }, {} as Record<number, ChaineNode[]>);

  const niveaux = Object.keys(beneficiairesParNiveau).map(Number).sort((a, b) => a - b);

  // Fonction pour trouver le bénéficiaire parent (celui du niveau précédent qui mène à ce bénéficiaire)
  const trouverBeneficiaireParent = (node: ChaineNode): string | undefined => {
    if (node.niveau === 0) return undefined;
    
    // Chercher dans le niveau précédent quel bénéficiaire a une relation vers ce node
    const niveauPrecedent = node.niveau - 1;
    if (!beneficiairesParNiveau[niveauPrecedent]) return undefined;
    
    for (const parent of beneficiairesParNiveau[niveauPrecedent]) {
      if (parent.relations_suivantes.some(rel => rel.beneficiaire_cible_id === node.beneficiaire.id)) {
        return parent.beneficiaire.nom;
      }
    }
    
    return undefined;
  };

  // Convertir les nodes en format BeneficiaireComplet pour réutiliser DirigeantCard
  const convertNodeToBeneficiaire = (node: ChaineNode, _niveau: number): BeneficiaireComplet => ({
    id: node.beneficiaire.id,
    nom: node.beneficiaire.nom,
    controverses: node.beneficiaire.controverses,
    lien_financier: node.lien_financier,
    impact_description: node.beneficiaire.impact_generique || 'Impact à définir',
    marque_id: chaine!.marque_id,
    marque_nom: chaine!.marque_nom,
    liaison_id: 0, // Pas pertinent ici
    type_beneficiaire: node.beneficiaire.type_beneficiaire as TypeBeneficiaire,
    source_lien: node.niveau === 0 ? 'direct' : 'transitif',
    toutes_marques: [],
    beneficiaire_parent_nom: trouverBeneficiaireParent(node),
    marques_directes: node.marques_directes || [],
    marques_indirectes: node.marques_indirectes || {}
  });

  // Convertir les nodes pour l'affichage collapsible
  const convertirNodesParNiveau = () => {
    const resultat: Record<number, BeneficiaireComplet[]> = {};
    
    niveaux.forEach(niveau => {
      resultat[niveau] = beneficiairesParNiveau[niveau].map(node => 
        convertNodeToBeneficiaire(node, niveau)
      );
    });
    
    return resultat;
  };
  
  const beneficiairesParNiveauConverti = convertirNodesParNiveau();

  return (
    <div ref={containerRef}>
      {/* Affichage par niveau avec headers seulement */}
      {niveaux.map((niveau) => {
        // Espacement uniforme entre tous les niveaux
        const marginClass = "mb-3";
        
        return (
        <div key={niveau} className={marginClass}>

          {/* Bénéficiaires de ce niveau */}
          <div className={`grid gap-4 ${getGridColumns(beneficiairesParNiveauConverti[niveau].length)}`}>
            {beneficiairesParNiveauConverti[niveau].map((beneficiaire, beneficiaireIndex) => {
              const uniqueId = `${niveau}-${beneficiaireIndex}`;
              const isExpanded = expandedBeneficiaire === uniqueId;
              
              return (
                <BeneficiaireHeader
                  key={`niveau-${niveau}-${beneficiaire.id}-${beneficiaireIndex}`}
                  beneficiaire={beneficiaire}
                  isExpanded={isExpanded}
                  onToggle={() => toggleBeneficiaire(uniqueId)}
                  niveau={niveau}
                  beneficiaireIndex={beneficiaireIndex}
                />
              );
            })}
          </div>

          {/* Contenu expansible affiché en pleine largeur après le grid */}
          {beneficiairesParNiveauConverti[niveau].map((beneficiaire, beneficiaireIndex) => {
            const uniqueId = `${niveau}-${beneficiaireIndex}`;
            const isExpanded = expandedBeneficiaire === uniqueId;
            
            if (!isExpanded) return null;
            
            return (
              <div key={`expanded-${niveau}-${beneficiaire.id}-${beneficiaireIndex}`} className="w-full">
                <div className={`${getUniformStyles().background} border-2 border-t-0 rounded-b-2xl px-6 pb-6 pt-2`}>

                  {/* Informations financières */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className={`font-semibold text-xs mb-1 text-primary`}>
                        Impact de vos achats :
                      </div>
                      <div 
                        className="text-neutral-900 text-sm"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(beneficiaire.impact_description) }}
                      />
                    </div>
                  </div>

                  {/* Controverses - seulement si il y en a */}
                  {beneficiaire.controverses && beneficiaire.controverses.length > 0 && (
                    <div className="mb-6">
                      <div className={`font-semibold text-xs mb-3 text-primary`}>
                        Controverses documentées :
                      </div>
                      <ControversesSection 
                        controverses={beneficiaire.controverses}
                      />
                    </div>
                  )}

                  {/* Section marques directement liées */}
                  {beneficiaire.marques_directes && beneficiaire.marques_directes.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-primary">
                      <div className="font-semibold text-black text-xs mb-3">
                        Autres marques directement liées à {beneficiaire.nom} ({beneficiaire.marques_directes.length}) :
                      </div>
                      <MarquesBadges 
                        marques={beneficiaire.marques_directes}
                        variant="public"
                      />
                    </div>
                  )}

                  {/* Sections marques indirectement liées */}
                  {beneficiaire.marques_indirectes && Object.keys(beneficiaire.marques_indirectes).length > 0 && (
                    <div className="mt-6 pt-4 border-t border-primary space-y-4">
                      {Object.entries(beneficiaire.marques_indirectes).map(([beneficiaireIntermediaire, marques]) => (
                        <div key={beneficiaireIntermediaire}>
                          <div className="font-semibold text-black text-xs mb-3">
                            Autres marques indirectement liées à {beneficiaire.nom} via {beneficiaireIntermediaire} ({marques.length}) :
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
              </div>
            );
          })}
        </div>
        );
      })}
    </div>
  );
}