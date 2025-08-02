// Types centralisés pour toute l'application
export interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
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
  id: number;
  marque_id: number;
  description: string;
  date: string;
  categorie_id: number;
  source_url: string;
  proposition_source_id?: number;
  marque?: Marque;
  categorie?: Categorie;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Evenement[];
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
  description: string;
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
