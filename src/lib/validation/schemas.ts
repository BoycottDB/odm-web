// Schémas de validation pour les API
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
  categorie: string;
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
    categorie,
    source
  } = data as {
    marqueId?: unknown;
    description?: unknown;
    date?: unknown;
    categorie?: unknown;
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

  // Validation categorie
  if (typeof categorie !== 'string' || !categorie.trim()) {
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
      categorie: typeof categorie === 'string' ? categorie.trim() : '',
      source: typeof source === 'string' ? source.trim() : ''
    }
  };
}
