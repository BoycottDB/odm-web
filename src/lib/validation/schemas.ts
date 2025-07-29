// Schémas de validation pour les API
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function validateMarqueCreate(data: unknown): ValidationResult<{ nom: string }> {
  const errors: string[] = [];

  if (!data.nom) {
    errors.push('Le nom de la marque est requis');
  }

  if (typeof data.nom !== 'string') {
    errors.push('Le nom de la marque doit être une chaîne de caractères');
  }

  if (data.nom && data.nom.trim().length < 2) {
    errors.push('Le nom de la marque doit contenir au moins 2 caractères');
  }

  if (data.nom && data.nom.trim().length > 100) {
    errors.push('Le nom de la marque ne peut pas dépasser 100 caractères');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { nom: data.nom.trim() }
  };
}

export function validateEvenementCreate(data: unknown): ValidationResult<{
  marqueId: number;
  description: string;
  date: string;
  categorie: string;
  source: string;
}> {
  const errors: string[] = [];

  // Validation marqueId
  if (!data.marqueId) {
    errors.push('L\'ID de la marque est requis');
  }
  if (typeof data.marqueId !== 'number' && !Number.isInteger(Number(data.marqueId))) {
    errors.push('L\'ID de la marque doit être un nombre entier');
  }

  // Validation description
  if (!data.description) {
    errors.push('La description est requise');
  }
  if (typeof data.description !== 'string') {
    errors.push('La description doit être une chaîne de caractères');
  }
  if (data.description && data.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }
  if (data.description && data.description.trim().length > 1000) {
    errors.push('La description ne peut pas dépasser 1000 caractères');
  }

  // Validation date
  if (!data.date) {
    errors.push('La date est requise');
  }
  if (data.date && isNaN(Date.parse(data.date))) {
    errors.push('La date doit être au format valide');
  }

  // Validation catégorie
  if (!data.categorie) {
    errors.push('La catégorie est requise');
  }
  if (typeof data.categorie !== 'string') {
    errors.push('La catégorie doit être une chaîne de caractères');
  }

  // Validation source
  if (!data.source) {
    errors.push('La source est requise');
  }
  if (typeof data.source !== 'string') {
    errors.push('La source doit être une chaîne de caractères');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      marqueId: Number(data.marqueId),
      description: data.description.trim(),
      date: data.date,
      categorie: data.categorie.trim(),
      source: data.source.trim()
    }
  };
}
