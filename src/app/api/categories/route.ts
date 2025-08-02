import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { validateAdminToken } from '@/lib/auth/admin';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('Categorie')
      .select('*')
      .eq('actif', true)
      .order('ordre');
    
    if (error) throw error;
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
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

    const body = await request.json();
    const { nom, description, emoji, couleur } = body;

    if (!nom || !nom.trim()) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    // Récupérer le prochain ordre
    const { data: maxOrdre } = await supabaseAdmin
      .from('Categorie')
      .select('ordre')
      .order('ordre', { ascending: false })
      .limit(1);

    const nouvelOrdre = maxOrdre?.[0]?.ordre ? maxOrdre[0].ordre + 1 : 1;

    const { data: newCategory, error } = await supabaseAdmin
      .from('Categorie')
      .insert({
        nom: nom.trim(),
        description: description?.trim() || null,
        emoji: emoji?.trim() || null,
        couleur: couleur?.trim() || null,
        actif: true,
        ordre: nouvelOrdre
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}