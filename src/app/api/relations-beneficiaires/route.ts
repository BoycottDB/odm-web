import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: relations, error } = await supabaseAdmin
      .from('beneficiaire_relation')
      .select(`
        *,
        beneficiaire_source:Beneficiaires!beneficiaire_relation_beneficiaire_source_id_fkey (
          id,
          nom,
          type_beneficiaire
        ),
        beneficiaire_cible:Beneficiaires!beneficiaire_relation_beneficiaire_cible_id_fkey (
          id,
          nom,
          type_beneficiaire
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des relations:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des relations' }, { status: 500 });
    }

    return NextResponse.json(relations || []);
  } catch (error) {
    console.error('Erreur API relations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      beneficiaire_source_id, 
      beneficiaire_cible_id, 
      description_relation
    } = body;

    // Validation
    if (!beneficiaire_source_id || !beneficiaire_cible_id || !description_relation) {
      return NextResponse.json({ 
        error: 'Tous les champs sont obligatoires' 
      }, { status: 400 });
    }

    // Vérifier que les bénéficiaires existent
    const { data: sourceExists } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id')
      .eq('id', beneficiaire_source_id)
      .single();

    const { data: cibleExists } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id')
      .eq('id', beneficiaire_cible_id)
      .single();

    if (!sourceExists || !cibleExists) {
      return NextResponse.json({ 
        error: 'Un ou plusieurs bénéficiaires spécifiés n\'existent pas' 
      }, { status: 400 });
    }

    // Créer la relation
    const { data: relation, error } = await supabaseAdmin
      .from('beneficiaire_relation')
      .insert([{
        beneficiaire_source_id,
        beneficiaire_cible_id,
        description_relation
      }])
      .select(`
        *,
        beneficiaire_source:Beneficiaires!beneficiaire_relation_beneficiaire_source_id_fkey (
          id,
          nom,
          type_beneficiaire
        ),
        beneficiaire_cible:Beneficiaires!beneficiaire_relation_beneficiaire_cible_id_fkey (
          id,
          nom,
          type_beneficiaire
        )
      `)
      .single();

    if (error) {
      console.error('Erreur lors de la création de la relation:', error);
      return NextResponse.json({ error: 'Erreur lors de la création de la relation' }, { status: 500 });
    }

    return NextResponse.json(relation, { status: 201 });
  } catch (error) {
    console.error('Erreur API création relation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de la relation manquant' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('beneficiaire_relation')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de la relation:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression de la relation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API suppression relation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}