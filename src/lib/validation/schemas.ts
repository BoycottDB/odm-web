// Schémas de validation pour les API
import type { PropositionCreateRequest, MarqueProposition, EvenementProposition, PropositionUpdateRequest } from '@/types';
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateMarqueCreate(data: unknown): ValidationResult<{ nom: string }> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null || !('nom' in data)) {
    errors.push('Le nom de la marque est requis');
    return { success: false, errors };
  }

  const nom = (data as { nom: unknown }).nom;

  if (typeof nom !== 'string') {
    errors.push('Le nom de la marque doit être une chaîne de caractères');
  } else {
    if (nom.trim().length < 2) {
      errors.push('Le nom de la marque doit contenir au moins 2 caractères');
    }
    if (nom.trim().length > 100) {
      errors.push('Le nom de la marque ne peut pas dépasser 100 caractères');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { nom: (nom as string).trim() }
  };
}

export function validateEvenementCreate(data: unknown): ValidationResult<{
  marqueId: number;
  description: string;
  date: string;
  categorieId: number;
  source: string;
}> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de l\'événement sont invalides');
    return { success: false, errors };
  }

  const {
    marqueId,
    description,
    date,
    categorieId,
    source
  } = data as {
    marqueId?: unknown;
    description?: unknown;
    date?: unknown;
    categorieId?: unknown;
    source?: unknown;
  };

  // Validation marqueId
  if (marqueId === undefined || marqueId === null) {
    errors.push('L\'ID de la marque est requis');
  } else if (typeof marqueId !== 'number' || !Number.isInteger(marqueId)) {
    errors.push('L\'ID de la marque doit être un nombre entier');
  }

  // Validation description
  if (typeof description !== 'string' || !description.trim()) {
    errors.push('La description est requise');
  } else {
    if (description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }
    if (description.trim().length > 1000) {
      errors.push('La description ne peut pas dépasser 1000 caractères');
    }
  }

  // Validation date
  if (typeof date !== 'string' || !date.trim()) {
    errors.push('La date est requise');
  }

  // Validation categorieId
  if (typeof categorieId !== 'number' || categorieId <= 0) {
    errors.push('La catégorie est requise');
  }

  // Validation source
  if (typeof source !== 'string' || !source.trim()) {
    errors.push('La source est requise');
  }

  // Validation date (format)
  if (typeof date === 'string' && date.trim() && isNaN(Date.parse(date))) {
    errors.push('La date doit être au format valide');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      marqueId: Number(marqueId),
      description: typeof description === 'string' ? description.trim() : '',
      date: typeof date === 'string' ? date : '',
      categorieId: typeof categorieId === 'number' ? categorieId : 0,
      source: typeof source === 'string' ? source.trim() : ''
    }
  };
}

// Règles de sécurité pour la modération
const SECURITY_RULES = {
  description: {
    minLength: 10,
    maxLength: 1000,
    forbiddenPatterns: [
      /\b(viagra|casino|crypto)\b/i,
      /<script|javascript:/i,
      /\b\d{4}-\d{4}-\d{4}-\d{4}\b/
    ]
  },
  source: {
    requireHttps: false // Plus de liste blanche, juste validation URL
  }
};

function validateSecureText(text: string, field: 'description' | 'source'): string[] {
  const errors: string[] = [];

  if (field === 'description') {
    const rules = SECURITY_RULES.description;
    
    if (text.length < rules.minLength) {
      errors.push(`La ${field} doit contenir au moins ${rules.minLength} caractères`);
    }
    if (text.length > rules.maxLength) {
      errors.push(`La ${field} ne peut pas dépasser ${rules.maxLength} caractères`);
    }

    // Vérification des motifs interdits
    for (const pattern of rules.forbiddenPatterns) {
      if (pattern.test(text)) {
        errors.push(`Le contenu de la ${field} contient des éléments non autorisés`);
        break;
      }
    }
  }

  if (field === 'source') {
    // Validation basique de l'URL seulement
    try {
      new URL(text);
    } catch {
      errors.push('L\'URL de la source n\'est pas valide');
    }
  }

  return errors;
}

export function validateMarqueProposition(data: unknown): ValidationResult<MarqueProposition> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null || !('nom' in data)) {
    errors.push('Le nom de la marque est requis');
    return { success: false, errors };
  }

  const nom = (data as { nom: unknown }).nom;

  if (typeof nom !== 'string') {
    errors.push('Le nom de la marque doit être une chaîne de caractères');
  } else {
    if (nom.trim().length < 2) {
      errors.push('Le nom de la marque doit contenir au moins 2 caractères');
    }
    if (nom.trim().length > 100) {
      errors.push('Le nom de la marque ne peut pas dépasser 100 caractères');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { nom: (nom as string).trim() }
  };
}

export function validateEvenementProposition(data: unknown): ValidationResult<EvenementProposition> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de l\'événement sont invalides');
    return { success: false, errors };
  }

  const {
    marque_nom,
    marque_id,
    description,
    date,
    categorieId,
    source,
    source_url
  } = data as {
    marque_nom?: unknown;
    marque_id?: unknown;
    description?: unknown;
    date?: unknown;
    categorieId?: unknown;
    source?: unknown;
    source_url?: unknown;
  };

  // Validation marque_nom
  if (typeof marque_nom !== 'string' || !marque_nom.trim()) {
    errors.push('Le nom de la marque est requis');
  } else {
    if (marque_nom.trim().length < 2) {
      errors.push('Le nom de la marque doit contenir au moins 2 caractères');
    }
    if (marque_nom.trim().length > 100) {
      errors.push('Le nom de la marque ne peut pas dépasser 100 caractères');
    }
  }

  // Validation marque_id (optionnel)
  if (marque_id !== undefined && marque_id !== null) {
    if (typeof marque_id !== 'number' || !Number.isInteger(marque_id)) {
      errors.push('L\'ID de la marque doit être un nombre entier');
    }
  }

  // Validation description avec sécurité
  if (typeof description !== 'string' || !description.trim()) {
    errors.push('La description est requise');
  } else {
    const securityErrors = validateSecureText(description.trim(), 'description');
    errors.push(...securityErrors);
  }

  // Validation date
  if (typeof date !== 'string' || !date.trim()) {
    errors.push('La date est requise');
  } else if (isNaN(Date.parse(date))) {
    errors.push('La date doit être au format valide');
  }

  // categorieId sera assigné par l'admin plus tard
  // Pas de validation côté utilisateur

  // Validation source
  if (typeof source !== 'string' || !source.trim()) {
    errors.push('La source est requise');
  }

  // Validation source_url avec sécurité
  if (source_url && typeof source_url === 'string' && source_url.trim()) {
    const securityErrors = validateSecureText(source_url.trim(), 'source');
    errors.push(...securityErrors);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      marque_nom: typeof marque_nom === 'string' ? marque_nom.trim() : '',
      marque_id: typeof marque_id === 'number' ? marque_id : undefined,
      description: typeof description === 'string' ? description.trim() : '',
      date: typeof date === 'string' ? date : '',
      source: typeof source === 'string' ? source.trim() : '',
      source_url: typeof source_url === 'string' && source_url.trim() ? source_url.trim() : undefined
    }
  };
}

export function validatePropositionCreate(data: unknown): ValidationResult<PropositionCreateRequest> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de la proposition sont invalides');
    return { success: false, errors };
  }

  const { type, data: propositionData } = data as {
    type?: unknown;
    data?: unknown;
  };

  // Validation type
  if (type !== 'marque' && type !== 'evenement') {
    errors.push('Le type de proposition doit être "marque" ou "evenement"');
    return { success: false, errors };
  }

  // Validation des données selon le type
  let validatedData: MarqueProposition | EvenementProposition;

  if (type === 'marque') {
    const validation = validateMarqueProposition(propositionData);
    if (!validation.success) {
      errors.push(...(validation.errors || []));
      return { success: false, errors };
    }
    validatedData = validation.data!;
  } else {
    const validation = validateEvenementProposition(propositionData);
    if (!validation.success) {
      errors.push(...(validation.errors || []));
      return { success: false, errors };
    }
    validatedData = validation.data!;
  }

  return {
    success: true,
    data: {
      type,
      data: validatedData
    }
  };
}

export function validatePropositionUpdate(data: unknown): ValidationResult<PropositionUpdateRequest> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de mise à jour sont invalides');
    return { success: false, errors };
  }

  const { statut, commentaire_admin, decision_publique } = data as {
    statut?: unknown;
    commentaire_admin?: unknown;
    decision_publique?: unknown;
  };

  // Validation statut
  if (statut !== 'approuve' && statut !== 'rejete') {
    errors.push('Le statut doit être "approuve" ou "rejete"');
  }

  // Validation commentaire_admin (optionnel)
  if (commentaire_admin !== undefined) {
    if (typeof commentaire_admin !== 'string') {
      errors.push('Le commentaire admin doit être une chaîne de caractères');
    } else if (commentaire_admin.trim().length > 500) {
      errors.push('Le commentaire admin ne peut pas dépasser 500 caractères');
    }
  }

  // Validation decision_publique
  if (typeof decision_publique !== 'boolean') {
    errors.push('La décision publique doit être un booléen');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      statut: statut as 'approuve' | 'rejete',
      commentaire_admin: typeof commentaire_admin === 'string' ? commentaire_admin.trim() : undefined,
      decision_publique: Boolean(decision_publique)
    }
  };
}

