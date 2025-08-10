import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { MarqueBeneficiaireCreateRequest, MarqueBeneficiaireUpdateRequest } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marqueId = searchParams.get('marqueId');
  const beneficiaireId = searchParams.get('beneficiaireId');

  try {
    let query = supabase
      .from('Marque_beneficiaire')
      .select(`
        id,
        marque_id,
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        created_at,
        updated_at,
        beneficiaire:beneficiaire_id (
          id,
          nom,
          controverses,
          sources,
          impact_generique,
          type_beneficiaire
        ),
        marque:marque_id (
          id,
          nom
        )
      `);

    if (marqueId) {
      query = query.eq('marque_id', parseInt(marqueId));
    }

    if (beneficiaireId) {
      query = query.eq('beneficiaire_id', parseInt(beneficiaireId));
    }

    const { data: liaisons, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération liaisons marque-bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json(liaisons);
  } catch (error) {
    console.error('Erreur API GET marque-bénéficiaire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MarqueBeneficiaireCreateRequest = await request.json();

    // Vérifier que la liaison n'existe pas déjà
    const { data: existing } = await supabase
      .from('Marque_beneficiaire')
      .select('id')
      .eq('marque_id', body.marque_id)
      .eq('beneficiaire_id', body.beneficiaire_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Cette liaison entre la marque et le bénéficiaire existe déjà' },
        { status: 400 }
      );
    }

    const { data: liaison, error } = await supabase
      .from('Marque_beneficiaire')
      .insert([{
        marque_id: body.marque_id,
        beneficiaire_id: body.beneficiaire_id,
        lien_financier: body.lien_financier,
        impact_specifique: body.impact_specifique
      }])
      .select(`
        id,
        marque_id,
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        created_at,
        updated_at,
        beneficiaire:beneficiaire_id (
          id,
          nom,
          controverses,
          sources,
          impact_generique,
          type_beneficiaire
        ),
        marque:marque_id (
          id,
          nom
        )
      `)
      .single();

    if (error) {
      console.error('Erreur création liaison marque-bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la création de la liaison' }, { status: 500 });
    }

    return NextResponse.json(liaison, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST marque-bénéficiaire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: MarqueBeneficiaireUpdateRequest = await request.json();

    const updateData: any = {};
    if (body.lien_financier !== undefined) updateData.lien_financier = body.lien_financier;
    if (body.impact_specifique !== undefined) updateData.impact_specifique = body.impact_specifique;
    
    updateData.updated_at = new Date().toISOString();

    const { data: liaison, error } = await supabase
      .from('Marque_beneficiaire')
      .update(updateData)
      .eq('id', body.id)
      .select(`
        id,
        marque_id,
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        created_at,
        updated_at,
        beneficiaire:beneficiaire_id (
          id,
          nom,
          controverses,
          sources,
          impact_generique,
          type_beneficiaire
        ),
        marque:marque_id (
          id,
          nom
        )
      `)
      .single();

    if (error) {
      console.error('Erreur mise à jour liaison marque-bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la liaison' }, { status: 500 });
    }

    return NextResponse.json(liaison);
  } catch (error) {
    console.error('Erreur API PUT marque-bénéficiaire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID liaison requis' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('Marque_beneficiaire')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Erreur suppression liaison marque-bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression de la liaison' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API DELETE marque-bénéficiaire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}