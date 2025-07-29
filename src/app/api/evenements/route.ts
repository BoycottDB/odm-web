import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEvenementCreate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';

export async function GET() {
  try {
    const evenements = await prisma.evenement.findMany({
      include: { marque: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(evenements);
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

    // Vérifier que la marque existe
    const marque = await prisma.marque.findUnique({
      where: { id: validation.data!.marqueId }
    });

    if (!marque) {
      return NextResponse.json(
        { error: 'Marque introuvable' },
        { status: 404 }
      );
    }

    // Créer l'événement
    const evenement = await prisma.evenement.create({
      data: {
        ...validation.data!,
        date: new Date(validation.data!.date)
      },
      include: { marque: true }
    });
    
    return NextResponse.json(evenement, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
