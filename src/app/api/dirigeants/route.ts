import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { MarqueDirigeantCreateRequest, DirigeantWithMarques } from '@/types';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('marque_dirigeant')
      .select(`
        *,
        marques:marque_id (id, nom)
      `);
    
    if (error) throw error;
    
    // Grouper par dirigeant pour la vue dirigeant-centrique
    const grouped: { [key: string]: DirigeantWithMarques } = {};
    
    data.forEach(item => {
      if (!grouped[item.dirigeant_nom]) {
        grouped[item.dirigeant_nom] = {
          nom: item.dirigeant_nom,
          controverses: item.controverses,
          sources: item.sources,
          marques: []
        };
      }
      
      grouped[item.dirigeant_nom].marques.push({
        id: item.marques.id,
        nom: item.marques.nom,
        lien_financier: item.lien_financier,
        impact_description: item.impact_description,
        liaison_id: item.id // ID de la liaison marque_dirigeant
      } as any);
    });
    
    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.error('Erreur lors de la récupération des dirigeants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dirigeants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: MarqueDirigeantCreateRequest = await request.json();
    
    // Validation des champs obligatoires
    const requiredFields = ['marque_id', 'dirigeant_nom', 'controverses', 'lien_financier', 'impact_description', 'sources'];
    for (const field of requiredFields) {
      if (!data[field as keyof MarqueDirigeantCreateRequest]) {
        return NextResponse.json(
          { error: `Le champ ${field} est obligatoire` },
          { status: 400 }
        );
      }
    }
    
    // Validation des sources
    if (!Array.isArray(data.sources) || data.sources.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une source est obligatoire' },
        { status: 400 }
      );
    }
    
    // Validation des URLs
    for (const source of data.sources) {
      try {
        new URL(source);
      } catch {
        return NextResponse.json(
          { error: `URL invalide : ${source}` },
          { status: 400 }
        );
      }
    }
    
    // Validation de la longueur des controverses
    if (data.controverses.length < 20) {
      return NextResponse.json(
        { error: 'La description des controverses doit faire au moins 20 caractères' },
        { status: 400 }
      );
    }
    
    // Vérifier qu'il n'y a pas déjà un dirigeant pour cette marque
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('marque_dirigeant')
      .select('id')
      .eq('marque_id', data.marque_id)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Cette marque a déjà un dirigeant controversé associé' },
        { status: 409 }
      );
    }
    
    const { data: dirigeant, error } = await supabaseAdmin
      .from('marque_dirigeant')
      .insert({
        marque_id: data.marque_id,
        dirigeant_nom: data.dirigeant_nom.trim(),
        controverses: data.controverses.trim(),
        lien_financier: data.lien_financier.trim(),
        impact_description: data.impact_description.trim(),
        sources: data.sources
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(dirigeant, { status: 201 });
  } catch (error) {
    console.error('Erreur création dirigeant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID obligatoire pour la mise à jour' },
        { status: 400 }
      );
    }
    
    // Validation des URLs si sources modifiées
    if (updateData.sources && Array.isArray(updateData.sources)) {
      for (const source of updateData.sources) {
        try {
          new URL(source);
        } catch {
          return NextResponse.json(
            { error: `URL invalide : ${source}` },
            { status: 400 }
          );
        }
      }
    }
    
    // Validation longueur controverses si modifiées
    if (updateData.controverses && updateData.controverses.length < 20) {
      return NextResponse.json(
        { error: 'La description des controverses doit faire au moins 20 caractères' },
        { status: 400 }
      );
    }
    
    // Nettoyer les données avant mise à jour
    const cleanedData = Object.keys(updateData).reduce((acc, key) => {
      if (typeof updateData[key] === 'string') {
        acc[key] = updateData[key].trim();
      } else {
        acc[key] = updateData[key];
      }
      return acc;
    }, {} as any);
    
    const { data: dirigeant, error } = await supabaseAdmin
      .from('marque_dirigeant')
      .update(cleanedData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(dirigeant);
  } catch (error) {
    console.error('Erreur mise à jour dirigeant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID obligatoire' },
        { status: 400 }
      );
    }
    
    const { error } = await supabaseAdmin
      .from('marque_dirigeant')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression dirigeant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}