import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { MarqueDirigeantCreateRequest, MarqueDirigeantUpdateRequest, DirigeantComplet } from '@/types';

// GET /api/marque-dirigeant - Récupérer toutes les liaisons avec données complètes
// Optionnel: ?marque_id=X pour filtrer par marque
// Optionnel: ?dirigeant_id=X pour filtrer par dirigeant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marqueId = searchParams.get('marque_id');
    const dirigeantId = searchParams.get('dirigeant_id');
    
    let query = supabase
      .from('marque_dirigeant')
      .select(`
        id,
        marque_id,
        dirigeant_id,
        lien_financier,
        impact_specifique,
        created_at,
        updated_at,
        dirigeant:dirigeant_id (
          id,
          nom,
          controverses,
          sources,
          impact_generique
        ),
        marque:marque_id (
          id,
          nom
        )
      `);
    
    if (marqueId) {
      query = query.eq('marque_id', marqueId);
    }
    
    if (dirigeantId) {
      query = query.eq('dirigeant_id', dirigeantId);
    }
    
    const { data: liaisons, error } = await query;
    
    if (error) throw error;
    
    // Transformer en format DirigeantComplet pour l'affichage
    const dirigeantsComplets: DirigeantComplet[] = liaisons.map(liaison => ({
      id: liaison.dirigeant.id,
      nom: liaison.dirigeant.nom,
      controverses: liaison.dirigeant.controverses,
      sources: liaison.dirigeant.sources,
      lien_financier: liaison.lien_financier,
      // Priorité à l'impact spécifique, sinon impact générique
      impact_description: liaison.impact_specifique || liaison.dirigeant.impact_generique || '',
      marque_id: liaison.marque.id,
      marque_nom: liaison.marque.nom,
      liaison_id: liaison.id
    }));
    
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
    const data: MarqueDirigeantCreateRequest = await request.json();
    
    // Validation des champs obligatoires
    if (!data.marque_id || !data.dirigeant_id || !data.lien_financier) {
      return NextResponse.json(
        { error: 'marque_id, dirigeant_id et lien_financier sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier que la marque existe
    const { data: marque, error: marqueError } = await supabase
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
    
    // Vérifier que le dirigeant existe
    const { data: dirigeant, error: dirigeantError } = await supabase
      .from('dirigeants')
      .select('id, nom')
      .eq('id', data.dirigeant_id)
      .single();
    
    if (dirigeantError || !dirigeant) {
      return NextResponse.json(
        { error: 'Dirigeant introuvable' },
        { status: 404 }
      );
    }
    
    // Vérifier qu'il n'y a pas déjà une liaison entre cette marque et ce dirigeant
    const { data: existing, error: checkError } = await supabase
      .from('marque_dirigeant')
      .select('id')
      .eq('marque_id', data.marque_id)
      .eq('dirigeant_id', data.dirigeant_id)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: `${dirigeant.nom} est déjà lié à ${marque.nom}` },
        { status: 409 }
      );
    }
    
    const { data: liaison, error } = await supabaseAdmin
      .from('marque_dirigeant')
      .insert({
        marque_id: data.marque_id,
        dirigeant_id: data.dirigeant_id,
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
    const data: MarqueDirigeantUpdateRequest = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la liaison obligatoire' },
        { status: 400 }
      );
    }
    
    // Vérifier que la liaison existe
    const { data: existing, error: checkError } = await supabase
      .from('marque_dirigeant')
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
      .from('marque_dirigeant')
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
    const { data: existing, error: checkError } = await supabase
      .from('marque_dirigeant')
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
      .from('marque_dirigeant')
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