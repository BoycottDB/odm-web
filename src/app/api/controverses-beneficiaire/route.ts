import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { ControverseBeneficiaireCreateRequest, ControverseBeneficiaireUpdateRequest } from '@/types';

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
      .select('*')
      .eq('beneficiaire_id', beneficiaire_id)
      .order('ordre', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des controverses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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
    const body: ControverseBeneficiaireCreateRequest = await request.json();
    const { beneficiaire_id, titre, source_url, ordre = 0 } = body;

    // Validation basique
    if (!beneficiaire_id || !titre || !source_url) {
      return NextResponse.json(
        { error: 'beneficiaire_id, titre et source_url sont requis' }, 
        { status: 400 }
      );
    }

    if (titre.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le titre doit faire au moins 10 caractères' }, 
        { status: 400 }
      );
    }

    // Validation URL basique
    try {
      new URL(source_url);
    } catch {
      return NextResponse.json(
        { error: 'URL source invalide' }, 
        { status: 400 }
      );
    }

    // Vérifier que le bénéficiaire existe
    const { data: beneficiaire, error: beneficiaireError } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id')
      .eq('id', beneficiaire_id)
      .single();

    if (beneficiaireError || !beneficiaire) {
      return NextResponse.json(
        { error: 'Bénéficiaire introuvable' }, 
        { status: 404 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .insert({ 
        beneficiaire_id, 
        titre: titre.trim(), 
        source_url: source_url.trim(), 
        ordre 
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de la controverse:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la controverse' }, 
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une controverse
export async function PUT(request: NextRequest) {
  try {
    const body: ControverseBeneficiaireUpdateRequest = await request.json();
    const { id, titre, source_url, ordre } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    // Construire l'objet de mise à jour
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    
    if (titre !== undefined) {
      if (titre.trim().length < 10) {
        return NextResponse.json(
          { error: 'Le titre doit faire au moins 10 caractères' }, 
          { status: 400 }
        );
      }
      updates.titre = titre.trim();
    }
    
    if (source_url !== undefined) {
      try {
        new URL(source_url);
      } catch {
        return NextResponse.json(
          { error: 'URL source invalide' }, 
          { status: 400 }
        );
      }
      updates.source_url = source_url.trim();
    }
    
    if (ordre !== undefined) {
      updates.ordre = ordre;
    }

    const { data, error } = await supabaseAdmin
      .from('controverse_beneficiaire')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de la controverse:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Controverse introuvable' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' }, 
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