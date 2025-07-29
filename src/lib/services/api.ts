import { Marque, Evenement, ApiResponse, MarqueCreateRequest, EvenementCreateRequest } from '@/types';

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

  // Événements
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
      event.categorie.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const apiService = new ApiService();
