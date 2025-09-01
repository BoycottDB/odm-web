/**
 * Data Service - Architecture Simplifiée
 * Lectures via odm-api, écritures via Supabase direct
 */

// Import dynamique pour éviter l'initialisation côté client
// import { supabaseAdmin } from '@/lib/supabaseClient';
import { 
  Marque, 
  Evenement, 
  DirigeantWithMarques, 
  SecteurMarque,
  Categorie,
  MarqueCreateRequest,
  EvenementCreateRequest,
  DirigeantCreateRequest,
  MarqueDirigeantCreateRequest,
  MarqueBeneficiaireCreateRequest
} from '@/types';

class DataService {
  private extensionApiUrl: string;

  constructor() {
    this.extensionApiUrl = process.env.NEXT_PUBLIC_EXTENSION_API_URL!;
  }

  // ============= LECTURES (odm-api uniquement) =============

  /**
   * Méthode privée pour fetch depuis odm-api
   */
  private async fetchFromExtensionApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.extensionApiUrl}/.netlify/functions/${endpoint}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Service indisponible (${response.status})`);
    }
    
    return response.json();
  }

  /**
   * Get all brands with search capability
   */
  async getMarques(search?: string, limit?: number, offset?: number): Promise<Marque[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const endpoint = `marques${params.toString() ? '?' + params.toString() : ''}`;
    return this.fetchFromExtensionApi<Marque[]>(endpoint);
  }

  /**
   * Get all events with related data
   */
  async getEvenements(limit?: number, offset?: number): Promise<Evenement[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const endpoint = `evenements${params.toString() ? '?' + params.toString() : ''}`;
    return this.fetchFromExtensionApi<Evenement[]>(endpoint);
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Categorie[]> {
    return this.fetchFromExtensionApi<Categorie[]>('categories');
  }

  /**
   * Get all brand sectors
   */
  async getSecteurs(id?: number): Promise<SecteurMarque[] | SecteurMarque> {
    const endpoint = id ? `secteurs-marque?id=${id}` : 'secteurs-marque';
    return this.fetchFromExtensionApi<SecteurMarque[] | SecteurMarque>(endpoint);
  }

  /**
   * Get brand statistics (for /marques page)
   */
  async getMarquesStats(): Promise<{
    id: number;
    nom: string;
    nbControverses: number;
    categories: Array<{ id: number; nom: string; emoji?: string; couleur?: string }>;
    nbCondamnations: number;
    nbBeneficiairesControverses: number;
  }[]> {
    return this.fetchFromExtensionApi<{
      id: number;
      nom: string;
      nbControverses: number;
      categories: Array<{ id: number; nom: string; emoji?: string; couleur?: string }>;
      nbCondamnations: number;
      nbBeneficiairesControverses: number;
    }[]>('marques-stats');
  }

  /**
   * Get beneficiary chain for a brand
   */
  async getBeneficiairesChaine(marqueId: number, profondeurMax: number = 5): Promise<unknown> {
    const endpoint = `beneficiaires-chaine?marqueId=${marqueId}&profondeur=${profondeurMax}`;
    return this.fetchFromExtensionApi<unknown>(endpoint);
  }

  // ============= ÉCRITURES (Supabase direct uniquement) =============

  /**
   * Create a new brand
   */
  async createMarque(data: MarqueCreateRequest): Promise<Marque> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: marque, error } = await supabaseAdmin
      .from('Marque')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return marque;
  }

  /**
   * Update a brand
   */
  async updateMarque(id: number, data: Partial<Marque>): Promise<Marque> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: marque, error } = await supabaseAdmin
      .from('Marque')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return marque;
  }

  /**
   * Delete a brand
   */
  async deleteMarque(id: number): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Marque')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Create a new event
   */
  async createEvenement(data: EvenementCreateRequest): Promise<Evenement> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: evenement, error } = await supabaseAdmin
      .from('Evenement')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return evenement;
  }

  /**
   * Update an event
   */
  async updateEvenement(id: number, data: Partial<Evenement>): Promise<Evenement> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: evenement, error } = await supabaseAdmin
      .from('Evenement')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return evenement;
  }

  /**
   * Delete an event
   */
  async deleteEvenement(id: number): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Evenement')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Create a new leader
   */
  async createDirigeant(data: DirigeantCreateRequest): Promise<DirigeantWithMarques> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: beneficiaire, error } = await supabaseAdmin
      .from('Beneficiaires')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...beneficiaire,
      marques: []
    };
  }

  /**
   * Update a leader
   */
  async updateDirigeant(id: number, data: Partial<DirigeantCreateRequest>): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Beneficiaires')
      .update(data)
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Delete a leader
   */
  async deleteDirigeant(id: number): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Beneficiaires')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Create a brand-leader relationship
   */
  async createMarqueDirigeant(data: MarqueDirigeantCreateRequest): Promise<void> {
    // Transform dirigeant_id to beneficiaire_id for the new schema
    const transformedData = {
      marque_id: data.marque_id,
      beneficiaire_id: 'dirigeant_id' in data ? (data as { dirigeant_id: number }).dirigeant_id : (data as MarqueBeneficiaireCreateRequest).beneficiaire_id,
      lien_financier: data.lien_financier,
      impact_specifique: data.impact_specifique
    };
    
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .insert([transformedData]);
    
    if (error) throw error;
  }

  /**
   * Update a brand-leader relationship
   */
  async updateMarqueDirigeant(id: number, data: Partial<MarqueDirigeantCreateRequest>): Promise<void> {
    // Transform dirigeant_id to beneficiaire_id for the new schema
    const transformedData: Record<string, unknown> = { ...data };
    if ('dirigeant_id' in data) {
      transformedData.beneficiaire_id = (data as { dirigeant_id: number }).dirigeant_id;
      delete transformedData.dirigeant_id;
    }
    
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .update(transformedData)
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Delete a brand-leader relationship
   */
  async deleteMarqueDirigeant(id: number): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Create a new sector
   */
  async createSecteur(data: Omit<SecteurMarque, 'id' | 'created_at' | 'updated_at'>): Promise<SecteurMarque> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: secteur, error } = await supabaseAdmin
      .from('SecteurMarque')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return secteur;
  }

  /**
   * Update a sector
   */
  async updateSecteur(id: number, data: Partial<SecteurMarque>): Promise<SecteurMarque> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { data: secteur, error } = await supabaseAdmin
      .from('SecteurMarque')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return secteur;
  }

  /**
   * Delete a sector
   */
  async deleteSecteur(id: number): Promise<void> {
    const { supabaseAdmin } = await import('@/lib/supabaseClient');
    const { error } = await supabaseAdmin
      .from('SecteurMarque')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ============= UTILITAIRES =============

  /**
   * Check if extension API is available
   */
  async checkExtensionApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.extensionApiUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Extension API health check failed:', error);
      return false;
    }
  }

  /**
   * Get service configuration
   */
  getConfig() {
    return {
      extensionApiUrl: this.extensionApiUrl,
      mode: 'simplified' // Plus de hybrid mode
    };
  }
}

// Export singleton instance
export const dataService = new DataService();