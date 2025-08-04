import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { validatePropositionUpdate } from '@/lib/validation/schemas';
import { getErrorMessage } from '@/lib/utils/helpers';
import { requireAdmin } from '@/lib/auth/admin';
import { convertApprovedProposition } from '@/lib/services/moderation';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Vérification admin pour PATCH (mise à jour des propositions)
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de proposition invalide' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validation des données
    const validation = validatePropositionUpdate(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.errors },
        { status: 400 }
      );
    }

    // Vérifier que la proposition existe
    const { data: existingProposition, error: findError } = await supabaseAdmin
      .from('Proposition')
      .select('*')
      .eq('id', id)
      .single();
    
    if (findError || !existingProposition) {
      return NextResponse.json(
        { error: 'Proposition non trouvée' },
        { status: 404 }
      );
    }

    // Extraire condamnation_judiciaire avant la mise à jour de la Proposition
    const { condamnation_judiciaire, ...propositionUpdateData } = validation.data!;
    
    // Mettre à jour la proposition (sans condamnation_judiciaire)
    const updateData = {
      ...propositionUpdateData,
      updated_at: new Date().toISOString()
    };

    const { data: proposition, error: updateError } = await supabaseAdmin
      .from('Proposition')
      .update(updateData)
      .eq('id', id)
      .select() 
      .single();
    
    if (updateError) throw updateError;

    // Si la proposition vient d'être approuvée, la convertir automatiquement
    const wasApproved = existingProposition.statut !== 'approuve' && proposition.statut === 'approuve';
    
    if (wasApproved) {
      try {
        const conversionResult = await convertApprovedProposition(proposition, condamnation_judiciaire || false);
        console.log(`✅ Proposition ${id} convertie automatiquement:`, conversionResult.type);
        
        // Retourner les infos de la proposition + le résultat de la conversion
        return NextResponse.json({
          proposition,
          conversion: conversionResult
        });
      } catch (conversionError) {
        console.error('❌ Erreur lors de la conversion automatique:', conversionError);
        // Ne pas faire échouer la mise à jour si la conversion échoue
        // La proposition reste approuvée mais pourra être convertie manuellement plus tard
        return NextResponse.json({
          proposition,
          conversion_error: getErrorMessage(conversionError)
        });
      }
    }
    
    return NextResponse.json(proposition);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la proposition:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}