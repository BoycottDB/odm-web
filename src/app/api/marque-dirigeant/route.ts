import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { MarqueBeneficiaireCreateRequest, MarqueBeneficiaireUpdateRequest, DirigeantComplet } from '@/types';

// GET /api/marque-dirigeant - Récupérer toutes les liaisons avec données complètes
// Optionnel: ?marque_id=X pour filtrer par marque
// Optionnel: ?beneficiaire_id=X pour filtrer par dirigeant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueId = searchParams.get('marque_id');
    const dirigeantId = searchParams.get('beneficiaire_id');
    
    let query = supabaseAdmin
      .from('Marque_beneficiaire')
      .select(`
        id,
        marque_id,
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        created_at,
        updated_at,
        beneficiaire:Beneficiaires!beneficiaire_id (
          id,
          nom,
          controverses,
          sources,
          impact_generique
        ),
        marque:Marque!marque_id (
          id,
          nom
        )
      `);
    
    if (marqueId) {
      query = query.eq('marque_id', marqueId);
    }
    
    if (dirigeantId) {
      query = query.eq('beneficiaire_id', dirigeantId);
    }
    
    const { data: liaisons, error } = await query;
    
    if (error) throw error;
    
    // TS: typage explicite pour garantir des objets (et non tableaux) sur les relations
    type LiaisonRow = {
      id: number;
      marque_id: number;
      beneficiaire_id: number;
      lien_financier: string;
      impact_specifique?: string | null;
      dirigeant: {
        id: number;
        nom: string;
        controverses: string;
        sources: string[];
        impact_generique?: string | null;
      };
      marque: { id: number; nom: string };
    };

    const liaisonsTyped = (liaisons || []) as unknown as LiaisonRow[];

    // Transformer en format DirigeantComplet pour l'affichage
    const dirigeantsMap = new Map<number, DirigeantComplet>();
    
    for (const liaison of liaisonsTyped) {
      const dirigeantId = liaison.dirigeant.id;
      
      if (!dirigeantsMap.has(dirigeantId)) {
        // Premier dirigeant, récupérer toutes ses marques
        const { data: toutesMarques } = await supabaseAdmin
          .from('Marque_beneficiaire')
          .select(`
            marque:Marque!marque_id (id, nom)
          `)
          .eq('beneficiaire_id', dirigeantId);
        
        const marquesArray = toutesMarques?.map(m => {
          const marqueData = m.marque as unknown as { id: number; nom: string };
          return { id: marqueData.id, nom: marqueData.nom };
        }) || [];
        
        dirigeantsMap.set(dirigeantId, {
          id: liaison.dirigeant.id,
          nom: liaison.dirigeant.nom,
          controverses: liaison.dirigeant.controverses,
          sources: liaison.dirigeant.sources,
          lien_financier: liaison.lien_financier,
          // Priorité à l'impact spécifique, sinon impact générique
          impact_description: liaison.impact_specifique || liaison.dirigeant.impact_generique || '',
          marque_id: liaison.marque.id,
          marque_nom: liaison.marque.nom,
          liaison_id: liaison.id,
          type_beneficiaire: 'individu', // Default value for legacy compatibility
          type_affichage: 'Dirigeant' as const,
          toutes_marques: marquesArray
        });
      }
    }
    
    const dirigeantsComplets = Array.from(dirigeantsMap.values());
    
    return NextResponse.json(dirigeantsComplets);
  } catch (error) {
    console.error('Erreur lors de la récupération des liaisons marque-dirigeant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des liaisons' },
      { status: 500 }
    );
  }
}

// POST /api/marque-dirigeant - Créer nouvelle liaison marque-dirigeant
export async function POST(request: NextRequest) {
  try {
    const data: MarqueBeneficiaireCreateRequest = await request.json();
    
    // Validation des champs obligatoires
    if (!data.marque_id || !data.beneficiaire_id || !data.lien_financier) {
      return NextResponse.json(
        { error: 'marque_id, beneficiaire_id et lien_financier sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier que la marque existe
    const { data: marque, error: marqueError } = await supabaseAdmin
      .from('Marque')
      .select('id, nom')
      .eq('id', data.marque_id)
      .single();
    
    if (marqueError || !marque) {
      return NextResponse.json(
        { error: 'Marque introuvable' },
        { status: 404 }
      );
    }
    
    // Vérifier que le bénéficiaire existe
    const { data: dirigeant, error: dirigeantError } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id, nom')
      .eq('id', data.beneficiaire_id)
      .single();
    
    if (dirigeantError || !dirigeant) {
      return NextResponse.json(
        { error: 'Dirigeant introuvable' },
        { status: 404 }
      );
    }
    
    // Vérifier qu'il n'y a pas déjà une liaison entre cette marque et ce dirigeant
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select('id')
      .eq('marque_id', data.marque_id)
      .eq('beneficiaire_id', data.beneficiaire_id)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: `${dirigeant.nom} est déjà lié à ${marque.nom}` },
        { status: 409 }
      );
    }
    
    const { data: liaison, error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .insert({
        marque_id: data.marque_id,
        beneficiaire_id: data.beneficiaire_id,
        lien_financier: data.lien_financier.trim(),
        impact_specifique: data.impact_specifique?.trim() || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(liaison, { status: 201 });
  } catch (error) {
    console.error('Erreur création liaison marque-dirigeant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la liaison' },
      { status: 500 }
    );
  }
}

// PUT /api/marque-dirigeant - Modifier liaison existante
export async function PUT(request: NextRequest) {
  try {
    const data: MarqueBeneficiaireUpdateRequest = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la liaison obligatoire' },
        { status: 400 }
      );
    }
    
    // Vérifier que la liaison existe
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Liaison introuvable' },
        { status: 404 }
      );
    }
    
    // Nettoyer les données
    const cleanedData = Object.keys(updateData).reduce((acc, key) => {
      const value = updateData[key as keyof typeof updateData];
      if (typeof value === 'string') {
        acc[key] = value.trim() || null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);
    
    const { data: liaison, error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .update(cleanedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(liaison);
  } catch (error) {
    console.error('Erreur mise à jour liaison:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE /api/marque-dirigeant?id=X - Supprimer liaison
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la liaison obligatoire' },
        { status: 400 }
      );
    }
    
    // Vérifier que la liaison existe
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Liaison introuvable' },
        { status: 404 }
      );
    }
    
    const { error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression liaison:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}