import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateMarqueBeneficiaireCreate } from '@/lib/validation/schemas';

// POST /api/marque-beneficiaire - Créer un lien marque → bénéficiaire, toujours avec sa source
export async function POST(request: NextRequest) {
  try {
    const validation = validateMarqueBeneficiaireCreate(await request.json());
    if (!validation.success || !validation.data) {
      return NextResponse.json({ error: validation.errors?.join(', ') }, { status: 400 });
    }
    const data = validation.data;

    const { data: marque } = await supabaseAdmin
      .from('Marque')
      .select('id, nom')
      .eq('id', data.marque_id)
      .single();

    if (!marque) {
      return NextResponse.json({ error: 'Marque introuvable' }, { status: 404 });
    }

    const { data: beneficiaire } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id, nom')
      .eq('id', data.beneficiaire_id)
      .single();

    if (!beneficiaire) {
      return NextResponse.json({ error: 'Bénéficiaire introuvable' }, { status: 404 });
    }

    const { data: existing } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select('id')
      .eq('marque_id', data.marque_id)
      .eq('beneficiaire_id', data.beneficiaire_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: `${beneficiaire.nom} est déjà lié à ${marque.nom}` },
        { status: 409 }
      );
    }

    const { data: liaison, error } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .insert({
        ...data,
        // La source vient d'être vérifiée par l'admin qui crée le lien
        verifie_le: new Date().toISOString().slice(0, 10)
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(liaison, { status: 201 });
  } catch (error) {
    console.error('Erreur création liaison marque-bénéficiaire:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la liaison' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID liaison requis' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
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
