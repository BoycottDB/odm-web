import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validateAdminToken } from '@/lib/auth/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Vérifier l'authentification admin
    if (!validateAdminToken(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Avec la nouvelle structure simplifiée, on met à jour les champs directs
    const allowedFields = [
      'marque_nom',
      'marque_id', 
      'description',
      'titre_controverse',
      'date',
      'categorie_id',
      'source_url'
    ];

    // Filtrer les champs autorisés
    const updateData: Record<string, string | number | undefined> = {
      updated_at: new Date().toISOString()
    };

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Validation basique
    if (Object.keys(updateData).length === 1) { // Seulement updated_at
      return NextResponse.json(
        { error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      );
    }

    // Mettre à jour les données de la proposition
    const { error } = await supabaseAdmin
      .from('Proposition')
      .update(updateData)
      .eq('id', parseInt(id));

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des données' },
      { status: 500 }
    );
  }
}