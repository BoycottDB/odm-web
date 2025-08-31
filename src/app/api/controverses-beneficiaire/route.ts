import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateControverseBeneficiaireCreate, validateControverseBeneficiaireUpdate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

// GET - Récupérer les controverses d'un bénéficiaire
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const beneficiaire_id = searchParams.get('beneficiaire_id');
    
    if (!beneficiaire_id) {
      return NextResponse.json({ error: 'beneficiaire_id requis' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .select(`
        *,
        Categorie!controverse_beneficiaire_categorie_id_fkey(*)
      `)
      .eq('beneficiaire_id', beneficiaire_id)
      .order('date', { ascending: false, nullsFirst: false })
      .order('ordre', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || [], {
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des controverses' }, 
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle controverse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données avec le schéma
    const validation = validateControverseBeneficiaireCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier que le bénéficiaire existe
    const { data: beneficiaire, error: beneficiaireError } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id')
      .eq('id', validation.data!.beneficiaire_id)
      .single();

    if (beneficiaireError || !beneficiaire) {
      return NextResponse.json(
        { error: 'Bénéficiaire introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que la catégorie existe (si spécifiée)
    if (validation.data!.categorie_id) {
      const { data: categorie, error: categorieError } = await supabaseAdmin
        .from('Categorie')
        .select('id')
        .eq('id', validation.data!.categorie_id)
        .single();

      if (categorieError || !categorie) {
        return NextResponse.json(
          { error: 'Catégorie introuvable' },
          { status: 404 }
        );
      }
    }

    // Créer la controverse
    const { data, error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .insert([validation.data!])
      .select(`
        *,
        Categorie!controverse_beneficiaire_categorie_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { 
      status: 201,
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la controverse:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une controverse
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données avec le schéma
    const validation = validateControverseBeneficiaireUpdate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    const { id, ...updateData } = validation.data!;

    // Vérifier que la catégorie existe (si spécifiée)
    if (updateData.categorie_id) {
      const { data: categorie, error: categorieError } = await supabaseAdmin
        .from('Categorie')
        .select('id')
        .eq('id', updateData.categorie_id)
        .single();

      if (categorieError || !categorie) {
        return NextResponse.json(
          { error: 'Catégorie introuvable' },
          { status: 404 }
        );
      }
    }

    // Construire l'objet de mise à jour en filtrant les undefined
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates[key] = value;
      }
    });

    const { data, error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        Categorie!controverse_beneficiaire_categorie_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Controverse introuvable' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la controverse:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) }, 
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une controverse
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la controverse:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' }, 
      { status: 500 }
    );
  }
}