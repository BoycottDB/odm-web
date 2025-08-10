/**
 * Data Service - Abstraction layer for hybrid architecture
 * Reads from extension-api, writes to Supabase directly
 */

import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { EXTENSION_API_CONFIG, getExtensionApiUrl, isHybridModeEnabled, getApiConfig } from '@/lib/config/api';
import { 
  Marque, 
  Evenement, 
  DirigeantWithMarques, 
  SecteurMarque,
  Categorie,
  MarqueCreateRequest,
  EvenementCreateRequest,
  DirigeantCreateRequest,
  MarqueDirigeantCreateRequest
} from '@/types';

class DataService {
  private extensionApiUrl: string;
  private useExtensionApi: boolean;

  constructor() {
    this.extensionApiUrl = EXTENSION_API_CONFIG.url;
    this.useExtensionApi = isHybridModeEnabled();
  }

  // Helper method to fetch from extension API with fallback
  private async fetchFromExtensionApi<T>(endpoint: string, fallbackFn?: () => Promise<T>): Promise<T> {
    if (!this.useExtensionApi && fallbackFn) {
      return fallbackFn();
    }

    try {
      const response = await fetch(getExtensionApiUrl(endpoint), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Ensure fresh data
      });
      
      if (!response.ok) {
        throw new Error(`Extension API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`Extension API failed for ${endpoint}:`, error);
      
      // Fallback to direct Supabase if available
      if (fallbackFn) {
        console.log(`Falling back to direct Supabase for ${endpoint}`);
        return fallbackFn();
      }
      
      throw error;
    }
  }

  // ============= READ OPERATIONS (via extension-api) =============

  /**
   * Get all brands with search capability
   */
  async getMarques(search?: string, limit?: number, offset?: number): Promise<Marque[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const endpoint = `marques${params.toString() ? '?' + params.toString() : ''}`;
    
    return this.fetchFromExtensionApi(
      endpoint,
      // Fallback to direct Supabase
      async () => {
        let query = supabase
          .from('Marque')
          .select(`
            *,
            Marque_beneficiaire!marque_id (
              id,
              beneficiaire_id,
              lien_financier,
              impact_specifique,
              created_at,
              updated_at,
              beneficiaire:Beneficiaires!marque_beneficiaire_beneficiaire_id_fkey (
                id,
                nom,
                controverses,
                sources,
                impact_generique,
                type_beneficiaire
              )
            ),
            SecteurMarque!secteur_marque_id (
              id,
              nom,
              description,
              message_boycott_tips,
              created_at,
              updated_at
            )
          `);
        
        if (search) {
          query = query.ilike('nom', `%${search}%`);
        }
        
        if (limit && offset !== undefined) {
          query = query.range(offset, offset + limit - 1);
        }
        
        const { data: marques, error } = await query;
        if (error) throw error;
        
        // Transform to match frontend expectations
        const transformedMarques = await Promise.all(
          (marques || []).map(async (marque) => {
            let dirigeant_controverse = null;
            const dirigeantLiaison = marque.Marque_beneficiaire?.[0];
            
            if (dirigeantLiaison && dirigeantLiaison.beneficiaire) {
              // Récupérer toutes les marques pour ce bénéficiaire
              const { data: toutesMarquesDuBeneficiaire } = await supabase
                .from('Marque_beneficiaire')
                .select(`
                  marque:Marque!marque_id (id, nom)
                `)
                .eq('beneficiaire_id', dirigeantLiaison.beneficiaire.id);
              
              const toutesMarques = toutesMarquesDuBeneficiaire?.map(m => {
                const marqueData = m.marque as unknown as { id: number; nom: string };
                return { id: marqueData.id, nom: marqueData.nom };
              }) || [];
              
              dirigeant_controverse = {
                id: dirigeantLiaison.id,
                marque_id: marque.id,
                dirigeant_id: dirigeantLiaison.beneficiaire.id,
                dirigeant_nom: dirigeantLiaison.beneficiaire.nom,
                controverses: dirigeantLiaison.beneficiaire.controverses,
                lien_financier: dirigeantLiaison.lien_financier,
                impact_description: dirigeantLiaison.impact_specifique || dirigeantLiaison.beneficiaire.impact_generique || '',
                sources: dirigeantLiaison.beneficiaire.sources,
                created_at: dirigeantLiaison.created_at,
                updated_at: dirigeantLiaison.updated_at,
                toutes_marques: toutesMarques,
                type_beneficiaire: dirigeantLiaison.beneficiaire.type_beneficiaire || 'individu'
              };
            }
            
            return {
              ...marque,
              dirigeant_controverse,
              secteur_marque: marque.SecteurMarque || null
            };
          })
        );
        
        return transformedMarques;
      }
    );
  }

  /**
   * Get all events with related data
   */
  async getEvenements(limit?: number, offset?: number): Promise<Evenement[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const endpoint = `evenements${params.toString() ? '?' + params.toString() : ''}`;
    
    return this.fetchFromExtensionApi(
      endpoint,
      // Fallback to direct Supabase
      async () => {
        let query = supabase
          .from('Evenement')
          .select(`
            *,
            Marque!Evenement_marque_id_fkey (
              id,
              nom,
              secteur_marque_id,
              message_boycott_tips,
              SecteurMarque!secteur_marque_id (
                id,
                nom,
                message_boycott_tips
              )
            ),
            Categorie!Evenement_categorie_id_fkey (
              id,
              nom,
              emoji,
              couleur,
              ordre
            )
          `)
          .order('date', { ascending: false });
        
        if (limit && offset !== undefined) {
          query = query.range(offset, offset + limit - 1);
        }
        
        const { data: evenements, error } = await query;
        if (error) throw error;
        
        return evenements?.map(evt => ({
          id: evt.id,
          marque_id: evt.marque_id,
          titre: evt.titre || evt.description,
          description: evt.description,
          date: evt.date,
          categorie_id: evt.categorie_id,
          source_url: evt.source_url || evt.source,
          reponse: evt.reponse,
          condamnation_judiciaire: evt.condamnation_judiciaire || false,
          created_at: evt.created_at,
          updated_at: evt.updated_at,
          marque: evt.Marque ? {
            id: evt.Marque.id,
            nom: evt.Marque.nom,
            secteur_marque_id: evt.Marque.secteur_marque_id,
            message_boycott_tips: evt.Marque.message_boycott_tips,
            secteur_marque: evt.Marque.SecteurMarque
          } as Marque : undefined,
          categorie: evt.Categorie
        })) || [];
      }
    );
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Categorie[]> {
    return this.fetchFromExtensionApi(
      'categories',
      // Fallback to direct Supabase
      async () => {
        const { data: categories, error } = await supabase
          .from('Categorie')
          .select('*')
          .eq('actif', true)
          .order('ordre', { ascending: true });
        
        if (error) throw error;
        return categories || [];
      }
    );
  }

  /**
   * Get all leaders with their brand relationships
   */
  async getDirigeants(id?: number): Promise<DirigeantWithMarques[] | DirigeantWithMarques> {
    const endpoint = id ? `dirigeants?id=${id}` : 'dirigeants';
    
    return this.fetchFromExtensionApi(
      endpoint,
      // Fallback to direct Supabase
      async () => {
        let query = supabase
          .from('Beneficiaires')
          .select(`
            *,
            Marque_beneficiaire!beneficiaire_id (
              id,
              marque_id,
              lien_financier,
              impact_specifique,
              Marque!marque_id (
                id,
                nom
              )
            )
          `)
          .order('nom');

        if (id) {
          query = query.eq('id', id);
        }

        const { data: dirigeants, error } = await (id ? query.single() : query);
        if (error) throw error;

        // Define types for Supabase response
        interface BeneficiaireSupabaseResponse {
          id: number;
          nom: string;
          controverses: string;
          sources: string[];
          impact_generique?: string;
          type_beneficiaire?: string;
          Marque_beneficiaire?: {
            id: number;
            marque_id: number;
            lien_financier: string;
            impact_specifique?: string;
            Marque: {
              id: number;
              nom: string;
            };
          }[];
        }

        const transform = (beneficiaire: BeneficiaireSupabaseResponse) => ({
          id: beneficiaire.id,
          nom: beneficiaire.nom,
          controverses: beneficiaire.controverses,
          sources: beneficiaire.sources,
          impact_generique: beneficiaire.impact_generique,
          type_beneficiaire: beneficiaire.type_beneficiaire || 'individu',
          marques: beneficiaire.Marque_beneficiaire?.map((liaison) => ({
            id: liaison.Marque.id,
            nom: liaison.Marque.nom,
            lien_financier: liaison.lien_financier,
            impact_specifique: liaison.impact_specifique,
            liaison_id: liaison.id
          })) || []
        });

        return id ? transform(dirigeants) : dirigeants?.map(transform) || [];
      }
    );
  }

  /**
   * Get all brand sectors
   */
  async getSecteurs(id?: number): Promise<SecteurMarque[] | SecteurMarque> {
    const endpoint = id ? `secteurs-marque?id=${id}` : 'secteurs-marque';
    
    return this.fetchFromExtensionApi(
      endpoint,
      // Fallback to direct Supabase
      async () => {
        let query = supabase.from('SecteurMarque').select('*').order('nom');
        
        if (id) {
          query = query.eq('id', id);
        }
        
        const { data: secteurs, error } = await (id ? query.single() : query);
        if (error) throw error;
        
        return secteurs;
      }
    );
  }

  // ============= WRITE OPERATIONS (direct Supabase) =============

  /**
   * Create a new brand
   */
  async createMarque(data: MarqueCreateRequest): Promise<Marque> {
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
      beneficiaire_id: (data as any).dirigeant_id || (data as any).beneficiaire_id,
      lien_financier: data.lien_financier,
      impact_specifique: data.impact_specifique
    };
    
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
    const transformedData: any = { ...data };
    if ((data as any).dirigeant_id) {
      transformedData.beneficiaire_id = (data as any).dirigeant_id;
      delete transformedData.dirigeant_id;
    }
    
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
    const { error } = await supabaseAdmin
      .from('SecteurMarque')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // ============= UTILITY METHODS =============

  /**
   * Check if extension API is available
   */
  async checkExtensionApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.extensionApiUrl}/.netlify/functions/health`, {
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
    return getApiConfig();
  }
}

// Export singleton instance
export const dataService = new DataService();