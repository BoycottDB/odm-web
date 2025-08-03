// Types centralisés pour toute l'application
export interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
  dirigeant_controverse?: MarqueDirigeant;
  // Champs spécifiques au contexte dirigeant-marque
  lien_financier?: string;
  impact_description?: string;
  liaison_id?: number;
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
  proposition_source_id?: number;
  moderation_status?: string;
  created_at?: string;
  updated_at?: string;
  marque?: Marque;
  categorie?: Categorie | null;
}

export interface DirigeantResult {
  id: string;
  type: 'dirigeant';
  marque: Marque;
  dirigeant: MarqueDirigeant;
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
  decision_publique: boolean;
  created_at: string;
  updated_at: string;
}

export interface DecisionPublique {
  id: number;
  titre: string;
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
  decision_publique: boolean;
}

// Types pour la gestion des dirigeants controversés
export interface MarqueDirigeant {
  id: number;
  marque_id: number;
  dirigeant_nom: string;
  controverses: string;
  lien_financier: string;
  impact_description: string;
  sources: string[];
  created_at: string;
  updated_at: string;
}

// Interface pour la vue dirigeant-centrique
export interface DirigeantWithMarques {
  nom: string;
  controverses: string;
  sources: string[];
  marques: Array<{
    id: number;
    nom: string;
    lien_financier: string;
    impact_description: string;
  }>;
}

// Requests pour l'API dirigeants
export interface MarqueDirigeantCreateRequest {
  marque_id: number;
  dirigeant_nom: string;
  controverses: string;
  lien_financier: string;
  impact_description: string;
  sources: string[];
}

export interface MarqueDirigeantUpdateRequest {
  id: number;
  dirigeant_nom?: string;
  controverses?: string;
  lien_financier?: string;
  impact_description?: string;
  sources?: string[];
}
