import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateAdminToken } from '@/lib/auth/admin';
import { SecteurMarqueCreateRequest, SecteurMarqueUpdateRequest } from '@/types';

export async function GET() {
  try {
    const { data: secteurs, error } = await supabaseAdmin
      .from('SecteurMarque')
      .select('*')
      .order('nom');
    
    if (error) throw error;
    
    return NextResponse.json(secteurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des secteurs marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des secteurs marque' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json() as SecteurMarqueCreateRequest;
    const { nom, description, message_boycott_tips } = body;

    if (!nom || !nom.trim()) {
      return NextResponse.json(
        { error: 'Le nom du secteur marque est requis' },
        { status: 400 }
      );
    }

    const { data: newSecteur, error } = await supabaseAdmin
      .from('SecteurMarque')
      .insert({
        nom: nom.trim(),
        description: description?.trim() || null,
        message_boycott_tips: message_boycott_tips?.trim() || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newSecteur);
  } catch (error) {
    console.error('Erreur lors de la création du secteur marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du secteur marque' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json() as SecteurMarqueUpdateRequest;
    const { id, nom, description, message_boycott_tips } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID du secteur marque est requis' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (nom !== undefined) updateData.nom = nom.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (message_boycott_tips !== undefined) updateData.message_boycott_tips = message_boycott_tips?.trim() || null;

    const { data: updatedSecteur, error } = await supabaseAdmin
      .from('SecteurMarque')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedSecteur);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du secteur marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du secteur marque' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID du secteur marque est requis' },
        { status: 400 }
      );
    }

    // Vérifier s'il y a des marques associées à ce secteur
    const { data: marques, error: checkError } = await supabaseAdmin
      .from('Marque')
      .select('id')
      .eq('secteur_marque_id', id);

    if (checkError) throw checkError;

    if (marques && marques.length > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer ce secteur car ${marques.length} marque(s) y sont associées` },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('SecteurMarque')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du secteur marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du secteur marque' },
      { status: 500 }
    );
  }
}