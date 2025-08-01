import { 
  Marque, 
  Evenement, 
  ApiResponse, 
  MarqueCreateRequest, 
  EvenementCreateRequest,
  Proposition,
  PropositionCreateRequest,
  PropositionUpdateRequest,
  DecisionPublique,
  SimilarityScore
} from '@/types';

class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Marques
  async getMarques(): Promise<Marque[]> {
    return this.request<Marque[]>('/marques');
  }

  async createMarque(data: MarqueCreateRequest): Promise<Marque> {
    return this.request<Marque>('/marques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Controverses
  async getEvenements(): Promise<Evenement[]> {
    return this.request<Evenement[]>('/evenements');
  }

  async createEvenement(data: EvenementCreateRequest): Promise<Evenement> {
    return this.request<Evenement>('/evenements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Recherche
  async searchEvents(query: string): Promise<Evenement[]> {
    const allEvents = await this.getEvenements();
    
    return allEvents.filter(event =>
      event.marque?.nom.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.categorie?.nom.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Propositions
  async createProposition(data: PropositionCreateRequest): Promise<Proposition> {
    return this.request<Proposition>('/propositions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropositions(): Promise<Proposition[]> {
    return this.request<Proposition[]>('/propositions');
  }

  async updateProposition(id: number, data: PropositionUpdateRequest): Promise<Proposition> {
    return this.request<Proposition>(`/propositions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Décisions publiques
  async getDecisionsPubliques(): Promise<DecisionPublique[]> {
    return this.request<DecisionPublique[]>('/decisions-publiques');
  }

  // Recherche de doublons
  async searchSimilaire(query: {
    type: 'marque' | 'evenement';
    marque_nom?: string;
    description?: string;
  }): Promise<{ 
    marques: Array<Marque & { score: SimilarityScore }>;
    evenements: Array<Evenement & { score: SimilarityScore }>;
  }> {
    const params = new URLSearchParams();
    params.append('type', query.type);
    if (query.marque_nom) params.append('marque_nom', query.marque_nom);
    if (query.description) params.append('description', query.description);

    return this.request(`/search-similaire?${params.toString()}`);
  }

  // Recherche de marques pour auto-complétion
  async searchMarques(query: string): Promise<Marque[]> {
    const allMarques = await this.getMarques();
    
    return allMarques.filter(marque =>
      marque.nom.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limiter à 5 suggestions
  }

  // Catégories - ⚠️ Non utilisé depuis la simplification du formulaire
  // async getCategories(): Promise<Categorie[]> {
  //   return this.request('/categories');
  // }
}

export const apiService = new ApiService();
