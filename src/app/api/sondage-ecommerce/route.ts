import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interesse_acheter, interesse_vendre } = body;

    // Validation simple
    if (typeof interesse_acheter !== 'boolean' || typeof interesse_vendre !== 'boolean') {
      return Response.json(
        { error: 'Données invalides' }, 
        { status: 400 }
      );
    }

    // Insertion en base
    const { error } = await supabaseAdmin
      .from('sondage_ecommerce')
      .insert({
        interesse_acheter,
        interesse_vendre
      });

    if (error) {
      console.error('Erreur Supabase:', error);
      return Response.json(
        { error: 'Erreur de sauvegarde' }, 
        { status: 500 }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Erreur API sondage:', error);
    return Response.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    );
  }
}