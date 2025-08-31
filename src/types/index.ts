// Types centralisés pour toute l'application

// ✅ SUPPRIMÉ : MarqueDirigeantLegacy n'est plus nécessaire

export interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
  beneficiaires_marque?: Array<{
    id: number;
    lien_financier: string;
    impact_specifique?: string;
    source_lien?: 'direct' | 'transitif'; // NOUVEAU : origine du lien
    beneficiaire_parent_nom?: string; // ✅ NOUVEAU : Nom du bénéficiaire intermédiaire pour relations transitives
    beneficiaire: {
      id: number;
      nom: string;
      // ✅ NOUVEAU : Controverses structurées
      controverses: ControverseBeneficiaire[];
      impact_generique?: string;
      type_beneficiaire?: string;
      created_at: string;
      updated_at: string;
      toutes_marques?: Array<{
        id: number;
        nom: string;
      }>; // Toutes les marques liées à ce bénéficiaire (ajouté par l'API)
      // ✅ NOUVEAU : Sections séparées pour marques directes et indirectes
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
    };
  }>;
  // Champs spécifiques au contexte dirigeant-marque
  lien_financier?: string;
  impact_description?: string;
  liaison_id?: number;
  // Champs pour les Boycott Tips
  secteur_marque_id?: number;
  message_boycott_tips?: string;
  // Hierarchical structure for inheritance
  marque_parent_id?: number;
  marque_parent?: Marque;
  filiales?: Marque[];
  secteur_marque?: SecteurMarque;
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
  marque_id: number;
  titre: string; // Renommé de 'description' pour plus de clarté
  description?: string; // Description détaillée si nécessaire
  date: string;
  categorie_id: number | null;
  source_url: string;
  reponse?: string; // URL de la réponse officielle de la marque à la controverse
  proposition_source_id?: number;
  moderation_status?: string;
  condamnation_judiciaire?: boolean; // Indique si la controverse a fait l'objet d'une condamnation judiciaire
  created_at?: string;
  updated_at?: string;
  marque?: Marque;
  categorie?: Categorie | null;
}

// Types pour les résultats de recherche
export interface BeneficiaireResult {
  id: string;
  type: 'beneficiaire';
  marque: Marque;
  beneficiaire: BeneficiaireComplet;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Evenement[];
  beneficiaireResults: BeneficiaireResult[];
  notFound: boolean;
  loading: boolean;
  hasPerformedSearch: boolean; // True quand une recherche a été effectivement exécutée
}

export interface SuggestionState {
  items: Marque[];
  highlighted: number;
  visible: boolean;
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
}

export interface EvenementCreateRequest {
  marque_id: number;
  description: string;
  date: string;
  categorie_id: number;
  source_url: string;
  condamnation_judiciaire?: boolean;
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
  titre: string;
  marque_nom: string;
  statut: 'approuve' | 'rejete';
  commentaire_admin: string;
  source_url?: string;
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
  condamnation_judiciaire?: boolean;
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
  condamnation_judiciaire?: boolean; // Badge condamnation
  reponse?: string | null; // URL réponse officielle
  
  created_at: string;
  updated_at: string;
  
  // NOUVELLE relation
  Categorie?: Categorie;
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
  // ✅ NOUVEAU : Sections séparées pour marques directes et indirectes
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
  impact_specifique?: string; // Override optionnel de l'impact générique
  created_at: string;
  updated_at: string;
  // Relations populées
  beneficiaire?: Beneficiaire;
  marque?: { id: number; nom: string };
}

// TODO: DETTE TECHNIQUE - Types alias pour rétrocompatibilité
// À supprimer avec MarqueDirigeantLegacy
export type Dirigeant = Beneficiaire;
export type MarqueDirigeant = Omit<MarqueBeneficiaire, 'beneficiaire_id'> & {
  dirigeant_id: number;
};

// Interface pour la vue bénéficiaire-centrique
export interface BeneficiaireWithMarques {
  id: number;
  nom: string;
  // ✅ NOUVEAU : Controverses structurées
  controverses: ControverseBeneficiaire[];
  impact_generique?: string;
  type_beneficiaire: TypeBeneficiaire;
  marques: Array<{
    id: number;
    nom: string;
    lien_financier: string;
    impact_specifique?: string;
    liaison_id: number; // ID de la liaison pour pouvoir l'éditer
  }>;
}

// Vue complète bénéficiaire + liaison (pour affichage public)
export interface BeneficiaireComplet {
  id: number;
  nom: string;
  // ✅ NOUVEAU : Controverses structurées
  controverses: ControverseBeneficiaire[];
  lien_financier: string;
  impact_description: string; // impact_specifique || impact_generique
  marque_id: number;
  marque_nom: string;
  liaison_id: number;
  type_beneficiaire: TypeBeneficiaire;
  source_lien?: 'direct' | 'transitif'; // NOUVEAU : origine du lien
  toutes_marques: Array<{
    id: number;
    nom: string;
  }>;
  // ✅ NOUVEAU : Sections séparées pour marques directes et indirectes
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
  // ✅ NOUVEAU : Nom du bénéficiaire intermédiaire pour relations transitives
  beneficiaire_parent_nom?: string;
}

// Types alias pour rétrocompatibilité
export type DirigeantComplet = BeneficiaireComplet;
export type DirigeantWithMarques = BeneficiaireWithMarques;

// Requests pour l'API bénéficiaires
export interface BeneficiaireCreateRequest {
  nom: string;
  // ✅ SUPPRIMER : controverses et sources (gérés via API séparée)
  impact_generique?: string;
  type_beneficiaire: TypeBeneficiaire;
}

export interface BeneficiaireUpdateRequest {
  id: number;
  nom?: string;
  // ✅ SUPPRIMER : controverses et sources (gérés via API séparée)
  impact_generique?: string;
  type_beneficiaire?: TypeBeneficiaire;
}

// Requests pour l'API liaisons marque-bénéficiaire
export interface MarqueBeneficiaireCreateRequest {
  marque_id: number;
  beneficiaire_id: number;
  lien_financier: string;
  impact_specifique?: string;
}

export interface MarqueBeneficiaireUpdateRequest {
  id: number;
  lien_financier?: string;
  impact_specifique?: string;
}

// TODO: DETTE TECHNIQUE - Types alias pour rétrocompatibilité
// À supprimer avec MarqueDirigeantLegacy
export type DirigeantCreateRequest = BeneficiaireCreateRequest;
export type DirigeantUpdateRequest = BeneficiaireUpdateRequest;
export type MarqueDirigeantCreateRequest = Omit<MarqueBeneficiaireCreateRequest, 'beneficiaire_id'> & {
  dirigeant_id: number;
};
export type MarqueDirigeantUpdateRequest = MarqueBeneficiaireUpdateRequest;

// Requests pour l'API controverses-beneficiaire
export interface ControverseBeneficiaireCreateRequest {
  beneficiaire_id: number;
  titre: string;
  source_url: string;
  ordre?: number;
  
  // NOUVEAUX champs optionnels
  date?: string;
  categorie_id?: number;
  condamnation_judiciaire?: boolean;
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
  condamnation_judiciaire?: boolean;
  reponse?: string;
}

// Interface simplifiée pour les catégories dans les stats
export interface CategorieStats {
  id: number;
  nom: string;
  emoji?: string;
  couleur?: string;
}

// Interface pour les statistiques de marques
export interface MarqueWithStats {
  id: number;
  nom: string;
  nbControverses: number;
  categories: CategorieStats[]; // Catégories uniques de controverses avec émojis et couleurs
  nbCondamnations: number; // Nombre de controverses avec condamnation judiciaire
  nbDirigeantsControverses: number; // Nombre de bénéficiaires controversés associés
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
