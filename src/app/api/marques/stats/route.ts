import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { MarqueWithStats, CategorieStats } from '@/types';


export async function GET() {
  try {
    // Récupérer toutes les marques avec leurs événements et dirigeants
    const { data: marques, error: marquesError } = await supabase
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
        marque_dirigeant!marque_id (
          id,
          dirigeant_nom,
          controverses
        )
      `);

    if (marquesError) throw marquesError;

    // Calculer les statistiques pour chaque marque
    const marquesWithStats: MarqueWithStats[] = (marques || []).map((marque: {
      id: number;
      nom: string;
      Evenement: Array<{
        id: number;
        categorie_id: number | null;
        condamnation_judiciaire: boolean;
        Categorie: { id: number; nom: string; emoji?: string; couleur?: string } | Array<{ id: number; nom: string; emoji?: string; couleur?: string }>;
      }>;
      marque_dirigeant: Array<{ id: number; dirigeant_nom: string; controverses: string }> | null;
    }) => {
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
      
      // Nombre de dirigeants controversés (comme dans l'API marques normale)
      const nbDirigeantsControverses = marque.marque_dirigeant ? (Array.isArray(marque.marque_dirigeant) ? marque.marque_dirigeant.length : 1) : 0;
      
      return {
        id: marque.id,
        nom: marque.nom,
        nbControverses,
        categories,
        nbCondamnations,
        nbDirigeantsControverses
      };
    });

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