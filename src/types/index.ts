// Types centralisés pour toute l'application
export interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
}

export interface Evenement {
  id: number;
  marqueId: number;
  description: string;
  date: string;
  categorie: string;
  source: string;
  marque?: Marque;
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
  categorie: string;
  source: string;
}
