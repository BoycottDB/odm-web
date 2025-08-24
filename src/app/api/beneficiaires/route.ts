import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { BeneficiaireCreateRequest, BeneficiaireUpdateRequest, BeneficiaireWithMarques, ControverseBeneficiaire } from '@/types';

interface BeneficiaireDatabase {
  id: number;
  nom: string;
  impact_generique?: string;
  type_beneficiaire: string;
  created_at: string;
  updated_at: string;
  controverses?: ControverseBeneficiaire[];
}

interface _LiaisonDatabase {
  id: number;
  marque_id: number;
  beneficiaire_id: number;
  lien_financier: string;
  impact_specifique?: string;
  created_at: string;
  updated_at: string;
  beneficiaire?: BeneficiaireDatabase;
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marqueId = searchParams.get('marqueId');
  const beneficiaireId = searchParams.get('id');

  try {
    if (beneficiaireId) {
      // Récupérer un bénéficiaire spécifique avec ses marques liées
      const { data: beneficiaire, error: beneficiaireError } = await supabaseAdmin
        .from('Beneficiaires')
        .select(`
          id,
          nom,
          impact_generique,
          type_beneficiaire,
          created_at,
          updated_at,
          controverses:controverse_beneficiaire(*)
        `)
        .eq('id', parseInt(beneficiaireId))
        .single();

      if (beneficiaireError || !beneficiaire) {
        console.error('Bénéficiaire non trouvé:', beneficiaireError);
        return NextResponse.json({ error: 'Bénéficiaire non trouvé' }, { status: 404 });
      }

      // Récupérer les marques liées à ce bénéficiaire
      const { data: marques, error: marqueError } = await supabaseAdmin
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
        .eq('beneficiaire_id', parseInt(beneficiaireId));

      if (marqueError) {
        console.error(`Erreur récupération marques pour bénéficiaire ${beneficiaireId}:`, marqueError);
      }

      const beneficiaireWithMarques: BeneficiaireWithMarques = {
        id: beneficiaire.id as number,
        nom: beneficiaire.nom as string,
        controverses: (beneficiaire as BeneficiaireDatabase).controverses || [],
        impact_generique: beneficiaire.impact_generique as string || undefined,
        type_beneficiaire: ((beneficiaire.type_beneficiaire as string) || 'individu') as 'individu' | 'groupe',
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

      return NextResponse.json(beneficiaireWithMarques);
    } else if (marqueId) {
      // Récupérer les bénéficiaires d'une marque spécifique via les liaisons
      const query = supabaseAdmin
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
            impact_generique,
            type_beneficiaire,
            created_at,
            updated_at,
            controverses:controverse_beneficiaire(*)
          )
        `)
        .eq('marque_id', parseInt(marqueId))
        .order('created_at', { ascending: false });

      const { data: liaisons, error } = await query;

      if (error) {
        console.error('Erreur récupération bénéficiaires par marque:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
      }

      // Transformer pour compatibilité avec frontend existant (format BeneficiaireResult)
      const beneficiairesTransformes = (liaisons || []).map((liaison: unknown) => {
        const l = liaison as Record<string, unknown>;
        const beneficiaire = l.beneficiaire as Record<string, unknown> | undefined;
        return {
          id: l.id as number,
          dirigeant_id: beneficiaire?.id as number, // Alias pour compatibilité
          dirigeant_nom: (beneficiaire?.nom as string) || 'Nom inconnu',
          // ✅ Transformer controverses pour compatibilité legacy
          controverses: ((beneficiaire as unknown as BeneficiaireDatabase)?.controverses || [])
            .map((c: ControverseBeneficiaire) => c.titre)
            .join(' | ') || '',
          sources: ((beneficiaire as unknown as BeneficiaireDatabase)?.controverses || [])
            .map((c: ControverseBeneficiaire) => c.source_url) || [],
          lien_financier: l.lien_financier as string,
          impact_description: (l.impact_specifique as string) || (beneficiaire?.impact_generique as string) || 'Impact à définir',
          type_beneficiaire: (beneficiaire?.type_beneficiaire as string) || 'individu',
          marque_id: l.marque_id as number
        };
      });

      return NextResponse.json(beneficiairesTransformes);
    } else {
      // Récupérer tous les bénéficiaires avec leurs marques liées
      const { data: beneficiaires, error } = await supabaseAdmin
        .from('Beneficiaires')
        .select(`
          id,
          nom,
          impact_generique,
          type_beneficiaire,
          created_at,
          updated_at,
          controverses:controverse_beneficiaire(*)
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
          const { data: marques, error: marqueError } = await supabaseAdmin
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
            controverses: (b as unknown as BeneficiaireDatabase).controverses || [],
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

    const { data: beneficiaire, error } = await supabaseAdmin
      .from('Beneficiaires')
      .insert([{
        nom: body.nom,
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
    // ❌ SUPPRIMER : controverses et sources (gérés via API séparée)
    if (body.impact_generique !== undefined) updateData.impact_generique = body.impact_generique;
    if (body.type_beneficiaire !== undefined) updateData.type_beneficiaire = body.type_beneficiaire;
    
    updateData.updated_at = new Date().toISOString();

    const { data: beneficiaire, error } = await supabaseAdmin
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
    const { error } = await supabaseAdmin
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