import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/services/dataService';
import { validateMarqueCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Use dataService for hybrid approach (extension-api with fallback to Supabase)
    const marques = await dataService.getMarques(search || undefined, limit, offset);
    
    return NextResponse.json(marques, {
      headers: {
        'X-Data-Source': 'hybrid-service'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des marques' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, secteur_marque_id, message_boycott_tips } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la marque est requis' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (secteur_marque_id !== undefined) updateData.secteur_marque_id = secteur_marque_id;
    if (message_boycott_tips !== undefined) updateData.message_boycott_tips = message_boycott_tips;

    // Update using dataService (direct Supabase for writes)
    const updatedMarque = await dataService.updateMarque(id, updateData);

    return NextResponse.json(updatedMarque, {
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la marque:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la marque' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = validateMarqueCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier si la marque existe déjà (using read operation via dataService)
    const existingMarques = await dataService.getMarques(validation.data!.nom);
    const existingMarque = existingMarques.find(m => m.nom.toLowerCase() === validation.data!.nom.toLowerCase());

    if (existingMarque) {
      return NextResponse.json(
        { error: 'Cette marque existe déjà' },
        { status: 409 }
      );
    }

    // Créer la marque (using write operation - direct Supabase)
    const marque = await dataService.createMarque(validation.data!);
    return NextResponse.json(marque, { 
      status: 201,
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la marque:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
