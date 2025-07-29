// Configuration de l'application
export const APP_CONFIG = {
  name: 'Répertoire des Marques à Boycotter',
  description: 'Plateforme collaborative pour documenter les controverses des marques',
  version: '1.0.0',
  github: 'https://github.com/votre-repo',
} as const;

// Catégories d'événements
export const EVENT_CATEGORIES = [
  'Racisme',
  'Travail des enfants',
  'Environnement',
  'Communication',
  'Éthique',
  'Droits humains',
  'Corruption',
  'Sécurité',
  'Autre'
] as const;

// Couleurs pour les badges
export const BADGE_COLORS = {
  category: 'bg-orange-50 text-gray-800 border-orange-100',
  date: 'bg-amber-50 text-gray-800 border-amber-100',
  brand: 'bg-yellow-50 text-gray-800 border-yellow-100'
} as const;

// Tailles des composants
export const COMPONENT_SIZES = {
  spinner: {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
} as const;

// Messages d'interface
export const UI_MESSAGES = {
  loading: 'Chargement des données...',
  searching: 'Recherche en cours...',
  noResults: 'Aucun résultat trouvé',
  noResultsDescription: 'Essayez avec un autre terme de recherche ou vérifiez l\'orthographe.',
  startSearch: 'Commencez votre recherche',
  startSearchDescription: 'Tapez le nom d\'une marque pour découvrir les événements associés.',
  searchPlaceholder: 'Rechercher une marque...'
} as const;
