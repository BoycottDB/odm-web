import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { MarqueWithStats, CategorieStats, ChaineBeneficiaires } from '@/types';

// Fonction pour compter les bénéficiaires controversés via l'API existante
async function getNbBeneficiairesControverses(marqueId: number): Promise<number> {
  try {
    const url = new URL('/api/beneficiaires/chaine', 'http://localhost');
    url.searchParams.append('marqueId', marqueId.toString());
    url.searchParams.append('profondeur', '5');
    
    const response = await fetch(url.toString().replace('http://localhost', ''), {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) return 0;
    
    const data: ChaineBeneficiaires = await response.json();
    if (!data.chaine || !Array.isArray(data.chaine)) return 0;
    
    // Compter les bénéficiaires uniques ayant des controverses
    const beneficiairesControverses = new Set<number>();
    
    data.chaine.forEach((node) => {
      if (node.beneficiaire.controverses && node.beneficiaire.controverses.length > 0) {
        beneficiairesControverses.add(node.beneficiaire.id);
      }
    });
    
    return beneficiairesControverses.size;
  } catch (error) {
    console.error(`Erreur lors du comptage des bénéficiaires controversés pour la marque ${marqueId}:`, error);
    return 0;
  }
}


export async function GET() {
  try {
    // Récupérer toutes les marques avec leurs événements et bénéficiaires
    const { data: marques, error: marquesError } = await supabaseAdmin
      .from('Marque')
      .select(`
        id,
        nom,
        Evenement (
          id,
          categorie_id,
          condamnation_judiciaire,
          Categorie!Evenement_categorie_id_fkey (
            id,
            nom,
            emoji,
            couleur
          )
        ),
        Marque_beneficiaire!marque_id (
          id,
          beneficiaire_id,
          lien_financier,
          beneficiaire:Beneficiaires!marque_beneficiaire_beneficiaire_id_fkey (
            id,
            nom,
            type_beneficiaire
          )
        )
      `);

    if (marquesError) throw marquesError;

    // Calculer les statistiques pour chaque marque
    type EvenementRow = {
      id: number;
      categorie_id: number | null;
      condamnation_judiciaire: boolean;
      Categorie: { id: number; nom: string; emoji?: string; couleur?: string } | Array<{ id: number; nom: string; emoji?: string; couleur?: string }>;
    };

    type MarqueBeneficiaireRow = {
      id: number;
      beneficiaire_id: number;
      lien_financier: string;
      beneficiaire: { id: number; nom: string; type_beneficiaire?: string } | Array<{ id: number; nom: string; type_beneficiaire?: string }>;
    };

    type MarqueRow = {
      id: number;
      nom: string;
      Evenement: EvenementRow[] | null;
      Marque_beneficiaire: MarqueBeneficiaireRow[] | null;
    };

    const marquesTyped = (marques || []) as unknown as MarqueRow[];

    const marquesWithStats: MarqueWithStats[] = await Promise.all(marquesTyped.map(async (marque) => {
      const evenements = marque.Evenement || [];
      
      // Nombre total de controverses
      const nbControverses = evenements.length;
      
      // Catégories uniques (filtrer les null et undefined)
      // Gérer le cas où Categorie peut être un objet ou un tableau
      const categoriesMap = new Map<number, CategorieStats>();
      evenements.forEach((e) => {
        const categorie = e.Categorie;
        let cat: CategorieStats | null = null;
        if (Array.isArray(categorie) && categorie.length > 0) {
          cat = categorie[0];
        } else if (categorie && 'nom' in categorie) {
          cat = categorie as CategorieStats;
        }
        if (cat && cat.id) {
          categoriesMap.set(cat.id, cat);
        }
      });
      const categories = Array.from(categoriesMap.values());
      
      // Nombre de condamnations judiciaires
      const nbCondamnations = evenements.filter((e) => e.condamnation_judiciaire === true).length;
      
      // Nombre de bénéficiaires controversés (multi-niveaux)
      const nbBeneficiairesControverses = await getNbBeneficiairesControverses(marque.id);
      
      return {
        id: marque.id,
        nom: marque.nom,
        nbControverses,
        categories,
        nbCondamnations,
        nbBeneficiairesControverses
      };
    }));

    // Trier par nombre de controverses décroissant, puis par nom
    marquesWithStats.sort((a, b) => {
      if (b.nbControverses !== a.nbControverses) {
        return b.nbControverses - a.nbControverses;
      }
      return a.nom.localeCompare(b.nom, 'fr');
    });

    return NextResponse.json(marquesWithStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des marques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques des marques' },
      { status: 500 }
    );
  }
}