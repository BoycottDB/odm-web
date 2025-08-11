// Types centralisés pour toute l'application
// Type pour la compatibilité avec l'ancienne structure (API marques)
export interface MarqueDirigeantLegacy {
  id: number; // ID de la liaison
  marque_id: number;
  dirigeant_id: number; // ID du dirigeant (nouveau)
  dirigeant_nom: string;
  controverses: string;
  lien_financier: string;
  impact_description: string;
  sources: string[];
  created_at: string;
  updated_at: string;
  toutes_marques: Array<{
    id: number;
    nom: string;
  }>;
}

export interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
  dirigeant_controverse?: MarqueDirigeantLegacy;
  // Champs spécifiques au contexte dirigeant-marque
  lien_financier?: string;
  impact_description?: string;
  liaison_id?: number;
  // Champs pour les Boycott Tips
  secteur_marque_id?: number;
  message_boycott_tips?: string;
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
  beneficiaire: MarqueDirigeantLegacy & {
    type_beneficiaire?: TypeBeneficiaire;
  };
}

// Alias pour rétrocompatibilité - même structure que BeneficiaireResult
export interface DirigeantResult {
  id: string;
  type: 'dirigeant';
  marque: Marque;
  beneficiaire: MarqueDirigeantLegacy & {
    type_beneficiaire?: TypeBeneficiaire;
  };
  dirigeant: MarqueDirigeantLegacy & {
    type_beneficiaire?: TypeBeneficiaire;
  };
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Evenement[];
  dirigeantResults: DirigeantResult[];
  notFound: boolean;
  loading: boolean;
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

// Table bénéficiaires centralisée (ex-dirigeants)
export interface Beneficiaire {
  id: number;
  nom: string;
  controverses: string;
  sources: string[];
  impact_generique?: string; // Template réutilisable
  type_beneficiaire: TypeBeneficiaire;
  created_at: string;
  updated_at: string;
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

// Types alias pour rétrocompatibilité
export type Dirigeant = Beneficiaire;
export type MarqueDirigeant = Omit<MarqueBeneficiaire, 'beneficiaire_id'> & {
  dirigeant_id: number;
};

// Interface pour la vue bénéficiaire-centrique
export interface BeneficiaireWithMarques {
  id: number;
  nom: string;
  controverses: string;
  sources: string[];
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
  controverses: string;
  sources: string[];
  lien_financier: string;
  impact_description: string; // impact_specifique || impact_generique
  marque_id: number;
  marque_nom: string;
  liaison_id: number;
  type_beneficiaire: TypeBeneficiaire;
  type_affichage: 'Dirigeant' | 'Groupe'; // Computed field for UI
  toutes_marques: Array<{
    id: number;
    nom: string;
  }>;
}

// Types alias pour rétrocompatibilité
export type DirigeantWithMarques = BeneficiaireWithMarques;
export type DirigeantComplet = BeneficiaireComplet;

// Requests pour l'API bénéficiaires
export interface BeneficiaireCreateRequest {
  nom: string;
  controverses: string;
  sources: string[];
  impact_generique?: string;
  type_beneficiaire: TypeBeneficiaire;
}

export interface BeneficiaireUpdateRequest {
  id: number;
  nom?: string;
  controverses?: string;
  sources?: string[];
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

// Types alias pour rétrocompatibilité
export type DirigeantCreateRequest = BeneficiaireCreateRequest;
export type DirigeantUpdateRequest = BeneficiaireUpdateRequest;
export type MarqueDirigeantCreateRequest = Omit<MarqueBeneficiaireCreateRequest, 'beneficiaire_id'> & {
  dirigeant_id: number;
};
export type MarqueDirigeantUpdateRequest = MarqueBeneficiaireUpdateRequest;

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
