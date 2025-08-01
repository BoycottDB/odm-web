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
  marqueId: number;
  description: string;
  date: string;
  categorieId: number;
  source: string;
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
  marqueId: number;
  description: string;
  date: string;
  categorieId: number;
  source: string;
}

// Types pour le système de modération
export interface Proposition {
  id: number;
  type: 'marque' | 'evenement';
  data: MarqueProposition | EvenementProposition;
  statut: 'en_attente' | 'approuve' | 'rejete';
  commentaire_admin?: string;
  decision_publique: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarqueProposition {
  nom: string;
}

export interface EvenementProposition {
  marque_nom: string;
  marque_id?: number;
  description: string;
  date: string;
  categorieId?: number; // Optionnel - sera assigné par l'admin
  source: string;
  source_url?: string;
}

export interface DecisionPublique {
  id: number;
  type: 'marque' | 'evenement';
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


export interface PropositionCreateRequest {
  type: 'marque' | 'evenement';
  data: MarqueProposition | EvenementProposition;
}

export interface PropositionUpdateRequest {
  statut: 'approuve' | 'rejete';
  commentaire_admin?: string;
  decision_publique: boolean;
}
