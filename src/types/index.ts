// Types centralisés pour toute l'application

// Une catégorie de controverses d'un acteur, avec leur nombre
export interface Etiquette {
  nom: string;
  emoji?: string;
  nombre: number;
}

// D'où viennent les étiquettes d'une marque dans la liste
export type OrigineEtiquettes = 'marque' | 'beneficiaires' | 'marque_ou_beneficiaires';

export interface MarqueStats {
  id: number;
  nom: string;
  etiquettes: Etiquette[];
  origineEtiquettes: OrigineEtiquettes | null;
  beneficiairesControverses: Array<{id: number, nom: string}>;
  nbBeneficiairesControverses?: number;
  secteur?: { id: number; nom: string } | null;
  pays_origine?: string;
  updated_at?: string;
}

export interface Marque {
  id: number;
  nom: string;
  // Gammes vendues sous la marque (ex. Knacki pour Herta) : elles mènent à sa page
  autres_noms?: string[];
  // Autres façons d'écrire la marque (ex. Total pour TotalEnergies) : elles mènent à sa page, sans y être listées
  variantes?: string[];
  evenements?: Evenement[];
  // Champs pour les Boycott Tips
  message_boycott_tips?: string;
  // Nouvelles propriétés pour la chaîne complète de bénéficiaires
  total_beneficiaires_chaine?: number;
  total_evenements?: number;
  chaine_beneficiaires?: Array<{
    beneficiaire: {
      id: number;
      nom: string;
      controverses: ControverseBeneficiaire[];
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
  }>;
  secteur_marque?: {
    nom: string;
    message_boycott_tips?: string;
  };
  // Propriétés pour l'administration uniquement
  beneficiaires_marque?: Array<{
    id: number;
    lien_financier: string;
    beneficiaire: {
      id: number;
      nom: string;
      controverses: ControverseBeneficiaire[];
      impact_generique?: string;
      type_beneficiaire?: string;
      created_at: string;
      updated_at: string;
      marques_directes?: Array<{
        id: number;
        nom: string;
      }>;
      marques_indirectes?: {
        [beneficiaireIntermediaire: string]: Array<{
          id: number;
          nom: string;
        }>;
      };
    };
  }>;
  secteur_marque_id?: number;
  secteur?: string;
  pays_origine?: string;
  updated_at?: string;
}

export interface SecteurMarque {
  id: number;
  nom: string;
  description?: string;
  message_boycott_tips?: string;
  created_at: string;
  updated_at: string;
}

export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  emoji?: string;
  couleur?: string;
  actif: boolean;
  ordre: number;
  created_at: string;
  updated_at: string;
}

export interface Evenement {
  id: number | string; // Peut être virtuel (string) ou réel (number)
  titre: string; // Renommé de 'description' pour plus de clarté
  date: string;
  source_url: string;
  reponse?: string; // URL de la réponse officielle de la marque à la controverse
  categorie?: Categorie | null;
  // Champs techniques pour autres contextes (admin, etc.)
  marque_id?: number;
  description?: string;
  categorie_id?: number | null;
  proposition_source_id?: number;
  moderation_status?: string;
  created_at?: string;
  updated_at?: string;
  marque?: Marque;
  beneficiaire?: { id: number; nom: string }; // Controverse d'un bénéficiaire (signalements récents)
}

// Types pour les résultats de recherche
// ✅ État pour recherche + suggestions (ex-UnifiedSearchState, remplace SearchState + SuggestionState legacy)
export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Evenement[];
  marque: Marque | null;
  notFound: boolean;
  loading: boolean;
  hasPerformedSearch: boolean;
  suggestions: Marque[];
  suggestionHighlighted: number;
  showSuggestions: boolean;
}

// Types pour les API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface MarqueCreateRequest {
  nom: string;
  secteur_marque_id?: number;
  message_boycott_tips?: string;
}

export interface MarqueUpdateRequest {
  id: number;
  nom?: string;
  secteur_marque_id?: number;
  message_boycott_tips?: string;
  autres_noms?: string[];
  variantes?: string[];
}

export interface EvenementCreateRequest {
  marque_id: number;
  description: string;
  date: string;
  categorie_id: number;
  source_url: string;
}

// Types pour le système de modération (simplifié - seulement des controverses)
export interface Proposition {
  id: number;
  marque_nom: string;
  marque_id?: number;
  description: string; // Message du contributeur aux modérateurs
  titre_controverse?: string; // Titre public de la controverse (rempli par le modérateur)
  date: string;
  categorie_id?: number; // Optionnel - sera assigné par l'admin
  source_url: string;
  statut: 'en_attente' | 'approuve' | 'rejete';
  commentaire_admin?: string;
  created_at: string;
  updated_at: string;
}

export interface Decision {
  id: number;
  titre?: string; // Titre publié aujourd'hui (validées seulement), jamais celui du signalement
  reponse?: string; // URL de la réponse de la marque, si elle existe
  marque_nom: string;
  statut: 'approuve' | 'rejete';
  commentaire_admin: string;
  date: string;
}

export interface SimilarityScore {
  marque: number;
  description: number;
  date: number;
  overall: number;
}

// Interface pour créer une nouvelle proposition (formulaire public)
export interface PropositionCreateRequest {
  marque_nom: string;
  description: string;
  date: string;
  source_url: string;
}

export interface PropositionUpdateRequest {
  statut: 'approuve' | 'rejete';
  commentaire_admin?: string;
  reponse?: string; // URL de la réponse de la marque (sera appliquée à l'événement lors de l'approbation)
}

// Types pour la gestion des bénéficiaires controversés - Version 2 (ex-dirigeants)
export type TypeBeneficiaire = 'individu' | 'groupe';

// Nouvelle interface pour une controverse individuelle
export interface ControverseBeneficiaire {
  id: number;
  beneficiaire_id: number;
  titre: string;
  source_url: string;
  ordre: number;
  
  // NOUVEAUX champs pour alignement avec Evenement
  date?: string | null; // Date de la controverse
  categorie_id?: number | null; // Référence vers Categorie
  reponse?: string | null; // URL réponse officielle
  
  created_at: string;
  updated_at: string;
  
  // NOUVELLE relation
  Categorie?: Categorie | null;
}

// Table bénéficiaires centralisée (ex-dirigeants)
export interface Beneficiaire {
  id: number;
  nom: string;
  // ✅ NOUVEAU : Controverses structurées
  controverses: ControverseBeneficiaire[];
  impact_generique?: string; // Template réutilisable
  type_beneficiaire: TypeBeneficiaire;
  created_at: string;
  updated_at: string;
  toutes_marques?: Array<{
    id: number;
    nom: string;
  }>; // Toutes les marques liées à ce bénéficiaire (ajouté par l'API)
  marques_directes?: Array<{
    id: number;
    nom: string;
  }>; // Marques directement liées à ce bénéficiaire (exclut la marque actuelle)
  marques_indirectes?: {
    [beneficiaireIntermediaire: string]: Array<{
      id: number;
      nom: string;
    }>;
  }; // Marques indirectement liées via d'autres bénéficiaires
}

// Table liaisons marque-bénéficiaire (ex-marque_dirigeant)
export interface MarqueBeneficiaire {
  id: number;
  marque_id: number;
  beneficiaire_id: number;
  lien_financier: string;
  source_url?: string | null; // Interne : source du lien, jamais affichée
  verifie_le?: string | null;
  part_detenue?: string | null;
  created_at: string;
  updated_at: string;
  // Relations populées
  beneficiaire?: Beneficiaire;
  marque?: { id: number; nom: string };
}

// Interface pour la vue bénéficiaire-centrique
export interface BeneficiaireWithMarques {
  id: number;
  nom: string;
  controverses: ControverseBeneficiaire[];
  impact_generique?: string;
  type_beneficiaire: TypeBeneficiaire;
  marques: Array<{
    id: number;
    nom: string;
    lien_financier: string;
    liaison_id: number; // ID de la liaison pour pouvoir l'éditer
  }>;
}

// Requests pour l'API bénéficiaires
export interface BeneficiaireCreateRequest {
  nom: string;
  impact_generique?: string;
  type_beneficiaire: TypeBeneficiaire;
}

export interface BeneficiaireUpdateRequest {
  id: number;
  nom?: string;
  impact_generique?: string;
  type_beneficiaire?: TypeBeneficiaire;
}

// Requests pour l'API liaisons marque-bénéficiaire
export interface MarqueBeneficiaireCreateRequest {
  marque_id: number;
  beneficiaire_id: number;
  lien_financier: string;
  source_url: string;
  part_detenue?: string;
}

// Requests pour l'API controverses-beneficiaire
export interface ControverseBeneficiaireCreateRequest {
  beneficiaire_id: number;
  titre: string;
  source_url: string;
  ordre?: number;
  
  // NOUVEAUX champs optionnels
  date?: string;
  categorie_id?: number;
  reponse?: string;
}

export interface ControverseBeneficiaireUpdateRequest {
  id: number;
  titre?: string;
  source_url?: string;
  ordre?: number;
  
  // NOUVEAUX champs optionnels  
  date?: string;
  categorie_id?: number;
  reponse?: string;
}

// Types pour les secteurs marque
export interface SecteurMarqueCreateRequest {
  nom: string;
  description?: string;
  message_boycott_tips?: string;
}

export interface SecteurMarqueUpdateRequest {
  id: number;
  nom?: string;
  description?: string;
  message_boycott_tips?: string;
}

// Types pour les relations entre bénéficiaires
export interface BeneficiaireRelation {
  id: number;
  beneficiaire_source_id: number;
  beneficiaire_cible_id: number;
  type_relation: string; // 'actionnaire', 'filiale', 'partenaire', 'controleur'
  description_relation?: string;
  created_at: string;
  updated_at: string;
  // Relations populées
  beneficiaire_source?: Beneficiaire;
  beneficiaire_cible?: Beneficiaire;
}

// Types pour la chaîne de bénéficiaires
export interface ChaineNode {
  beneficiaire: Beneficiaire;
  niveau: number;
  relations_suivantes: BeneficiaireRelation[];
}

export interface ChaineBeneficiaires {
  marque_nom: string;
  marque_id: number;
  chaine: ChaineNode[];
  profondeur_max: number;
}
