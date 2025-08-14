import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { DirigeantCreateRequest, DirigeantUpdateRequest, DirigeantWithMarques, BeneficiaireCreateRequest } from '@/types';

export async function GET() {
  try {
    // Récupérer tous les bénéficiaires avec leurs liaisons marque
    const { data: dirigeants, error: dirigeantError } = await supabaseAdmin
      .from('Beneficiaires')
      .select(`
        id,
        nom,
        controverses,
        sources,
        impact_generique,
        type_beneficiaire,
        created_at,
        updated_at
      `);
      
    if (dirigeantError) throw dirigeantError;
    
    // Récupérer toutes les liaisons marque-bénéficiaire
    const { data: liaisons, error: liaisonError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select(`
        id,
        marque_id,
        beneficiaire_id,
        lien_financier,
        impact_specifique,
        marque:Marque!marque_id (id, nom)
      `);
      
    if (liaisonError) throw liaisonError;
    
    // Construire la vue dirigeant-centrique
    type LiaisonRow = {
      id: number;
      marque_id: number;
      beneficiaire_id: number;
      lien_financier: string;
      impact_specifique?: string | null;
      marque: { id: number; nom: string } | Array<{ id: number; nom: string }>;
    };

    const liaisonsTyped = (liaisons || []) as unknown as LiaisonRow[];

    const dirigeantsWithMarques: DirigeantWithMarques[] = dirigeants.map(dirigeant => ({
      id: dirigeant.id,
      nom: dirigeant.nom,
      controverses: dirigeant.controverses,
      sources: dirigeant.sources,
      impact_generique: dirigeant.impact_generique,
      type_beneficiaire: dirigeant.type_beneficiaire || 'individu',
      marques: liaisonsTyped
        .filter(liaison => liaison.beneficiaire_id === dirigeant.id)
        .map(liaison => {
          const marqueObj = Array.isArray(liaison.marque) ? liaison.marque[0] : liaison.marque;
          return {
            id: marqueObj?.id ?? liaison.marque_id,
            nom: marqueObj?.nom ?? 'Marque inconnue',
            lien_financier: liaison.lien_financier,
            impact_specifique: liaison.impact_specifique || undefined,
            liaison_id: liaison.id
          };
        })
    }));
    
    return NextResponse.json(dirigeantsWithMarques);
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
    const data: DirigeantCreateRequest = await request.json();
    
    // Validation des champs obligatoires
    const requiredFields = ['nom', 'controverses', 'sources'];
    for (const field of requiredFields) {
      if (!data[field as keyof DirigeantCreateRequest]) {
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
    
    // Vérifier qu'un bénéficiaire avec ce nom n'existe pas déjà
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id')
      .eq('nom', data.nom.trim())
      .single();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Un dirigeant avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    const { data: dirigeant, error } = await supabaseAdmin
      .from('Beneficiaires')
      .insert({
        nom: data.nom.trim(),
        controverses: data.controverses.trim(),
        sources: data.sources,
        impact_generique: data.impact_generique?.trim(),
        type_beneficiaire: (data as BeneficiaireCreateRequest).type_beneficiaire || 'individu'
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
    const data: DirigeantUpdateRequest = await request.json();
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
    
    // Vérifier unicité du nom si modifié
    if (updateData.nom) {
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('Beneficiaires')
        .select('id')
        .eq('nom', updateData.nom.trim())
        .neq('id', id)
        .single();
      
      if (existing) {
        return NextResponse.json(
          { error: 'Un dirigeant avec ce nom existe déjà' },
          { status: 409 }
        );
      }
    }
    
    // Nettoyer les données avant mise à jour
    const cleanedData = Object.keys(updateData).reduce((acc, key) => {
      if (typeof updateData[key as keyof typeof updateData] === 'string') {
        acc[key] = (updateData[key as keyof typeof updateData] as string).trim();
      } else {
        acc[key] = updateData[key as keyof typeof updateData];
      }
      return acc;
    }, {} as Record<string, unknown>);
    
    const { data: dirigeant, error } = await supabaseAdmin
      .from('Beneficiaires')
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
    
    // Vérifier s'il existe des liaisons avec ce bénéficiaire
    const { data: liaisons, error: checkError } = await supabaseAdmin
      .from('Marque_beneficiaire')
      .select('id')
      .eq('beneficiaire_id', id);
    
    if (checkError) throw checkError;
    
    if (liaisons && liaisons.length > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer ce dirigeant : il est lié à ${liaisons.length} marque(s)` },
        { status: 409 }
      );
    }
    
    const { error } = await supabaseAdmin
      .from('Beneficiaires')
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