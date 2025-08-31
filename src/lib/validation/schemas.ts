// Schémas de validation pour les API
import type { PropositionCreateRequest, PropositionUpdateRequest } from '@/types';
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
  marque_id: number;
  description: string;
  date: string;
  categorie_id: number;
  source_url: string;
  condamnation_judiciaire?: boolean;
}> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de l\'événement sont invalides');
    return { success: false, errors };
  }

  const {
    marque_id,
    description,
    date,
    categorie_id,
    source_url,
    condamnation_judiciaire
  } = data as {
    marque_id?: unknown;
    description?: unknown;
    date?: unknown;
    categorie_id?: unknown;
    source_url?: unknown;
    condamnation_judiciaire?: unknown;
  };

  // Validation marque_id
  if (marque_id === undefined || marque_id === null) {
    errors.push('L\'ID de la marque est requis');
  } else if (typeof marque_id !== 'number' || !Number.isInteger(marque_id)) {
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

  // Validation categorie_id
  if (typeof categorie_id !== 'number' || categorie_id <= 0) {
    errors.push('La catégorie est requise');
  }

  // Validation source_url
  if (typeof source_url !== 'string' || !source_url.trim()) {
    errors.push('L\'URL de la source est requise');
  }

  // Validation date (format)
  if (typeof date === 'string' && date.trim() && isNaN(Date.parse(date))) {
    errors.push('La date doit être au format valide');
  }

  // Validation condamnation_judiciaire (optionnel)
  if (condamnation_judiciaire !== undefined && typeof condamnation_judiciaire !== 'boolean') {
    errors.push('Le champ condamnation judiciaire doit être un booléen');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      marque_id: Number(marque_id),
      description: typeof description === 'string' ? description.trim() : '',
      date: typeof date === 'string' ? date : '',
      categorie_id: typeof categorie_id === 'number' ? categorie_id : 0,
      source_url: typeof source_url === 'string' ? source_url.trim() : '',
      condamnation_judiciaire: typeof condamnation_judiciaire === 'boolean' ? condamnation_judiciaire : undefined
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

// Function removed - no longer needed with simplified architecture

// Function removed - no longer needed with simplified architecture

export function validatePropositionCreate(data: unknown): ValidationResult<PropositionCreateRequest> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de la proposition sont invalides');
    return { success: false, errors };
  }

  const { marque_nom, description, date, source_url } = data as {
    marque_nom?: unknown;
    description?: unknown;
    date?: unknown;
    source_url?: unknown;
  };

  // Validation des champs obligatoires
  if (typeof marque_nom !== 'string' || !marque_nom.trim()) {
    errors.push('Le nom de la marque est obligatoire');
  }

  if (typeof description !== 'string' || !description.trim()) {
    errors.push('La description est obligatoire');
  }

  if (typeof date !== 'string' || !date.trim()) {
    errors.push('La date est obligatoire');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      errors.push('La date doit être au format YYYY-MM-DD');
    }
  }

  if (typeof source_url !== 'string' || !source_url.trim()) {
    errors.push('La source (URL) est obligatoire');
  } else {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(source_url.trim())) {
      errors.push('La source doit être une URL valide (http:// ou https://)');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      marque_nom: (marque_nom as string).trim(),
      description: (description as string).trim(),
      date: (date as string).trim(),
      source_url: (source_url as string).trim()
    }
  };
}

export function validatePropositionUpdate(data: unknown): ValidationResult<PropositionUpdateRequest> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de mise à jour sont invalides');
    return { success: false, errors };
  }

  const { statut, commentaire_admin, condamnation_judiciaire, reponse } = data as {
    statut?: unknown;
    commentaire_admin?: unknown;
    condamnation_judiciaire?: unknown;
    reponse?: unknown;
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


  // Validation condamnation_judiciaire (optionnel)
  if (condamnation_judiciaire !== undefined && typeof condamnation_judiciaire !== 'boolean') {
    errors.push('La condamnation judiciaire doit être un booléen');
  }

  // Validation reponse (optionnel)
  if (reponse !== undefined) {
    if (typeof reponse !== 'string') {
      errors.push('La réponse doit être une chaîne de caractères');
    } else if (reponse.trim() && !/^https?:\/\/.+/.test(reponse.trim())) {
      errors.push('La réponse de la marque doit être une URL valide (http:// ou https://)');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      statut: statut as 'approuve' | 'rejete',
      commentaire_admin: typeof commentaire_admin === 'string' ? commentaire_admin.trim() : undefined,
      condamnation_judiciaire: typeof condamnation_judiciaire === 'boolean' ? condamnation_judiciaire : undefined,
      reponse: typeof reponse === 'string' && reponse.trim() ? reponse.trim() : undefined
    }
  };
}

// Validation pour créer une controverse de bénéficiaire
export function validateControverseBeneficiaireCreate(data: unknown): ValidationResult<{
  beneficiaire_id: number;
  titre: string;
  source_url: string;
  ordre?: number;
  date?: string;
  categorie_id?: number;
  condamnation_judiciaire?: boolean;
  reponse?: string;
}> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de la controverse sont invalides');
    return { success: false, errors };
  }

  const {
    beneficiaire_id,
    titre,
    source_url,
    ordre,
    date,
    categorie_id,
    condamnation_judiciaire,
    reponse
  } = data as {
    beneficiaire_id?: unknown;
    titre?: unknown;
    source_url?: unknown;
    ordre?: unknown;
    date?: unknown;
    categorie_id?: unknown;
    condamnation_judiciaire?: unknown;
    reponse?: unknown;
  };

  // Validation beneficiaire_id
  if (beneficiaire_id === undefined || beneficiaire_id === null) {
    errors.push('L\'ID du bénéficiaire est requis');
  } else if (typeof beneficiaire_id !== 'number' || !Number.isInteger(beneficiaire_id)) {
    errors.push('L\'ID du bénéficiaire doit être un nombre entier');
  }

  // Validation titre
  if (typeof titre !== 'string' || !titre.trim()) {
    errors.push('Le titre est requis');
  } else {
    if (titre.trim().length < 10) {
      errors.push('Le titre doit contenir au moins 10 caractères');
    }
    if (titre.trim().length > 500) {
      errors.push('Le titre ne peut pas dépasser 500 caractères');
    }
  }

  // Validation source_url
  if (typeof source_url !== 'string' || !source_url.trim()) {
    errors.push('L\'URL de la source est requise');
  } else {
    try {
      new URL(source_url.trim());
    } catch {
      errors.push('L\'URL de la source n\'est pas valide');
    }
  }

  // Validation ordre (optionnel)
  if (ordre !== undefined && (typeof ordre !== 'number' || !Number.isInteger(ordre))) {
    errors.push('L\'ordre doit être un nombre entier');
  }

  // Validation date (optionnelle)
  if (date !== undefined && typeof date === 'string' && date.trim() && isNaN(Date.parse(date))) {
    errors.push('La date doit être au format valide');
  }

  // Validation categorie_id (optionnelle)
  if (categorie_id !== undefined && (typeof categorie_id !== 'number' || !Number.isInteger(categorie_id))) {
    errors.push('L\'ID de catégorie doit être un nombre entier');
  }

  // Validation condamnation_judiciaire (optionnelle)
  if (condamnation_judiciaire !== undefined && typeof condamnation_judiciaire !== 'boolean') {
    errors.push('Le champ condamnation judiciaire doit être un booléen');
  }

  // Validation reponse (optionnelle)
  if (reponse !== undefined && typeof reponse === 'string' && reponse.trim()) {
    try {
      new URL(reponse.trim());
    } catch {
      errors.push('L\'URL de réponse n\'est pas valide');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      beneficiaire_id: Number(beneficiaire_id),
      titre: (titre as string).trim(),
      source_url: (source_url as string).trim(),
      ordre: typeof ordre === 'number' ? ordre : undefined,
      date: typeof date === 'string' && date.trim() ? date.trim() : undefined,
      categorie_id: typeof categorie_id === 'number' ? categorie_id : undefined,
      condamnation_judiciaire: typeof condamnation_judiciaire === 'boolean' ? condamnation_judiciaire : undefined,
      reponse: typeof reponse === 'string' && reponse.trim() ? reponse.trim() : undefined
    }
  };
}

// Validation pour mettre à jour une controverse de bénéficiaire
export function validateControverseBeneficiaireUpdate(data: unknown): ValidationResult<{
  id: number;
  titre?: string;
  source_url?: string;
  ordre?: number;
  date?: string;
  categorie_id?: number;
  condamnation_judiciaire?: boolean;
  reponse?: string;
}> {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push('Les données de la controverse sont invalides');
    return { success: false, errors };
  }

  const {
    id,
    titre,
    source_url,
    ordre,
    date,
    categorie_id,
    condamnation_judiciaire,
    reponse
  } = data as {
    id?: unknown;
    titre?: unknown;
    source_url?: unknown;
    ordre?: unknown;
    date?: unknown;
    categorie_id?: unknown;
    condamnation_judiciaire?: unknown;
    reponse?: unknown;
  };

  // Validation id (requis)
  if (id === undefined || id === null) {
    errors.push('L\'ID est requis');
  } else if (typeof id !== 'number' || !Number.isInteger(id)) {
    errors.push('L\'ID doit être un nombre entier');
  }

  // Validation titre (optionnel)
  if (titre !== undefined) {
    if (typeof titre !== 'string' || !titre.trim()) {
      errors.push('Le titre ne peut pas être vide');
    } else {
      if (titre.trim().length < 10) {
        errors.push('Le titre doit contenir au moins 10 caractères');
      }
      if (titre.trim().length > 500) {
        errors.push('Le titre ne peut pas dépasser 500 caractères');
      }
    }
  }

  // Validation source_url (optionnel)
  if (source_url !== undefined) {
    if (typeof source_url !== 'string' || !source_url.trim()) {
      errors.push('L\'URL de la source ne peut pas être vide');
    } else {
      try {
        new URL(source_url.trim());
      } catch {
        errors.push('L\'URL de la source n\'est pas valide');
      }
    }
  }

  // Validation ordre (optionnel)
  if (ordre !== undefined && (typeof ordre !== 'number' || !Number.isInteger(ordre))) {
    errors.push('L\'ordre doit être un nombre entier');
  }

  // Validation date (optionnelle)
  if (date !== undefined && typeof date === 'string' && date.trim() && isNaN(Date.parse(date))) {
    errors.push('La date doit être au format valide');
  }

  // Validation categorie_id (optionnelle)
  if (categorie_id !== undefined && (typeof categorie_id !== 'number' || !Number.isInteger(categorie_id))) {
    errors.push('L\'ID de catégorie doit être un nombre entier');
  }

  // Validation condamnation_judiciaire (optionnelle)
  if (condamnation_judiciaire !== undefined && typeof condamnation_judiciaire !== 'boolean') {
    errors.push('Le champ condamnation judiciaire doit être un booléen');
  }

  // Validation reponse (optionnelle)
  if (reponse !== undefined && typeof reponse === 'string' && reponse.trim()) {
    try {
      new URL(reponse.trim());
    } catch {
      errors.push('L\'URL de réponse n\'est pas valide');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      id: Number(id),
      titre: typeof titre === 'string' && titre.trim() ? titre.trim() : undefined,
      source_url: typeof source_url === 'string' && source_url.trim() ? source_url.trim() : undefined,
      ordre: typeof ordre === 'number' ? ordre : undefined,
      date: typeof date === 'string' && date.trim() ? date.trim() : undefined,
      categorie_id: typeof categorie_id === 'number' ? categorie_id : undefined,
      condamnation_judiciaire: typeof condamnation_judiciaire === 'boolean' ? condamnation_judiciaire : undefined,
      reponse: typeof reponse === 'string' && reponse.trim() ? reponse.trim() : undefined
    }
  };
}

