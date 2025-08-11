import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { BeneficiaireCreateRequest, BeneficiaireUpdateRequest, BeneficiaireWithMarques } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marqueId = searchParams.get('marqueId');

  try {
    if (marqueId) {
      // Récupérer les bénéficiaires d'une marque spécifique via les liaisons
      const query = supabase
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
            type_beneficiaire,
            created_at,
            updated_at
          )
        `)
        .eq('marque_id', parseInt(marqueId))
        .order('created_at', { ascending: false });

      const { data: liaisons, error } = await query;

      if (error) {
        console.error('Erreur récupération bénéficiaires par marque:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
      }

      // Transformer pour compatibilité avec frontend existant (format DirigeantResult)
      const beneficiairesTransformes = (liaisons || []).map((liaison: unknown) => {
        const l = liaison as Record<string, unknown>;
        const beneficiaire = l.beneficiaire as Record<string, unknown> | undefined;
        return {
          id: l.id as number,
          dirigeant_id: beneficiaire?.id as number, // Alias pour compatibilité
          dirigeant_nom: (beneficiaire?.nom as string) || 'Nom inconnu',
          controverses: (beneficiaire?.controverses as string) || '',
          sources: (beneficiaire?.sources as string[]) || [],
          lien_financier: l.lien_financier as string,
          impact_description: (l.impact_specifique as string) || (beneficiaire?.impact_generique as string) || 'Impact à définir',
          type_beneficiaire: (beneficiaire?.type_beneficiaire as string) || 'individu',
          marque_id: l.marque_id as number
        };
      });

      return NextResponse.json(beneficiairesTransformes);
    } else {
      // Récupérer tous les bénéficiaires avec leurs marques liées
      const { data: beneficiaires, error } = await supabase
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
        `)
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur récupération bénéficiaires:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
      }

      // Pour chaque bénéficiaire, récupérer ses marques liées
      const beneficiairesWithMarques: BeneficiaireWithMarques[] = await Promise.all(
        (beneficiaires || []).map(async (beneficiaire: unknown) => {
          const b = beneficiaire as Record<string, unknown>;
          const { data: marques, error: marqueError } = await supabase
            .from('Marque_beneficiaire')
            .select(`
              id,
              lien_financier,
              impact_specifique,
              marque:marque_id (
                id,
                nom
              )
            `)
            .eq('beneficiaire_id', b.id as number);

          if (marqueError) {
            console.error(`Erreur récupération marques pour bénéficiaire ${b.id}:`, marqueError);
          }
          return {
            id: b.id as number,
            nom: b.nom as string,
            controverses: b.controverses as string,
            sources: b.sources as string[],
            impact_generique: b.impact_generique as string || undefined,
            type_beneficiaire: ((b.type_beneficiaire as string) || 'individu') as 'individu' | 'groupe',
            marques: (marques || []).map((m: unknown) => {
              const marque = m as Record<string, unknown>;
              const marqueData = marque.marque as Record<string, unknown> | undefined;
              return {
                id: (marqueData?.id as number) || 0,
                nom: (marqueData?.nom as string) || 'Marque inconnue',
                lien_financier: marque.lien_financier as string,
                impact_specifique: marque.impact_specifique as string || undefined,
                liaison_id: marque.id as number
              };
            })
          };
        })
      );

      return NextResponse.json(beneficiairesWithMarques);
    }
  } catch (error) {
    console.error('Erreur API bénéficiaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BeneficiaireCreateRequest = await request.json();

    const { data: beneficiaire, error } = await supabase
      .from('Beneficiaires')
      .insert([{
        nom: body.nom,
        controverses: body.controverses,
        sources: body.sources,
        impact_generique: body.impact_generique,
        type_beneficiaire: body.type_beneficiaire
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur création bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la création du bénéficiaire' }, { status: 500 });
    }

    return NextResponse.json(beneficiaire, { status: 201 });
  } catch (error) {
    console.error('Erreur API POST bénéficiaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: BeneficiaireUpdateRequest = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.nom !== undefined) updateData.nom = body.nom;
    if (body.controverses !== undefined) updateData.controverses = body.controverses;
    if (body.sources !== undefined) updateData.sources = body.sources;
    if (body.impact_generique !== undefined) updateData.impact_generique = body.impact_generique;
    if (body.type_beneficiaire !== undefined) updateData.type_beneficiaire = body.type_beneficiaire;
    
    updateData.updated_at = new Date().toISOString();

    const { data: beneficiaire, error } = await supabase
      .from('Beneficiaires')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du bénéficiaire' }, { status: 500 });
    }

    return NextResponse.json(beneficiaire);
  } catch (error) {
    console.error('Erreur API PUT bénéficiaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID bénéficiaire requis' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('Beneficiaires')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Erreur suppression bénéficiaire:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression du bénéficiaire' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API DELETE bénéficiaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}