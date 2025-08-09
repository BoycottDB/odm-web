import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/lib/services/dataService';
import { validateEvenementCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    // Use dataService for hybrid approach (extension-api with fallback to Supabase)
    const evenements = await dataService.getEvenements(limit, offset);
    
    return NextResponse.json(evenements, {
      headers: {
        'X-Data-Source': 'hybrid-service'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validation = validateEvenementCreate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier que la marque existe (using read operation via dataService)
    const marques = await dataService.getMarques();
    const marque = marques.find(m => m.id === validation.data!.marque_id);

    if (!marque) {
      return NextResponse.json(
        { error: 'Marque introuvable' },
        { status: 404 }
      );
    }

    // Créer l'événement (using write operation - direct Supabase)
    const evenement = await dataService.createEvenement(validation.data!);

    return NextResponse.json(evenement, { 
      status: 201,
      headers: {
        'X-Data-Source': 'direct-supabase'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
