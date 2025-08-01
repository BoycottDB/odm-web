/**
 * Système de couleurs centralisé pour l'application
 * Utilise la palette "berry" (violet bordeaux) comme couleur principale
 */

export const colors = {
  // Palette principale Berry
  berry: {
    50: 'berry-50',
    100: 'berry-100',
    200: 'berry-200',
    300: 'berry-300',
    400: 'berry-400',
    500: 'berry-500',
    600: 'berry-600',
    700: 'berry-700',
    800: 'berry-800',
    900: 'berry-900',
    950: 'berry-950',
  },
  
  // Couleurs sémantiques
  primary: {
    DEFAULT: 'primary',
    hover: 'primary-hover',
    light: 'primary-light',
    dark: 'primary-dark',
  },
  
  // Couleurs d'accent
  accent: {
    category: 'accent-category',
    date: 'accent-date',
  }
} as const;

/**
 * Classes Tailwind pré-construites pour les éléments courants
 */
export const colorClasses = {
  // Boutons
  button: {
    primary: `bg-${colors.primary.DEFAULT} hover:bg-${colors.primary.hover} text-white`,
    secondary: `bg-${colors.primary.light} hover:bg-${colors.berry[200]} text-${colors.primary.dark}`,
  },
  
  // Badges/Tags
  badge: {
    category: `bg-${colors.accent.category} text-gray-800 border border-yellow-200`,
    date: `bg-${colors.accent.date} text-gray-800 border border-indigo-200`,
    brand: `bg-${colors.berry[50]} text-gray-800 border border-${colors.berry[100]}`,
  },
  
  // États interactifs
  interactive: {
    focus: `focus:outline-none focus:ring-2 focus:ring-${colors.berry[400]}`,
    hover: `hover:bg-${colors.berry[50]}`,
    active: `text-${colors.berry[600]} bg-${colors.berry[100]}`,
    inactive: `text-gray-900 hover:bg-${colors.berry[50]}`,
  },
  
  // Bordures et divisions
  border: {
    light: `border-${colors.berry[100]}`,
    medium: `border-${colors.berry[200]}`,
    strong: `border-${colors.berry[600]}`,
  },
  
  // Backgrounds
  background: {
    gradient: `bg-gradient-to-br from-white to-${colors.berry[50]}`,
    section: `bg-gradient-to-br from-${colors.berry[50]} via-purple-50 to-indigo-50`,
    card: `bg-white border border-${colors.berry[100]} shadow-lg`,
  },
  
  // Texte
  text: {
    primary: `text-${colors.berry[600]}`,
    primaryHover: `hover:text-${colors.berry[700]}`,
    muted: 'text-gray-600',
    strong: 'text-gray-900',
  },
  
  // Icônes et éléments visuels
  icon: {
    primary: `text-${colors.berry[600]}`,
    background: `bg-${colors.berry[100]}`,
    muted: `text-${colors.berry[400]}`,
  },
  
  // Loading spinner
  spinner: {
    border: `border-${colors.berry[200]}`,
    active: `border-t-${colors.berry[600]}`,
  },
} as const;

/**
 * Fonction utilitaire pour construire des classes dynamiquement
 */
export function getBerryClass(shade: keyof typeof colors.berry, prefix: 'bg' | 'text' | 'border' = 'bg') {
  return `${prefix}-${colors.berry[shade]}`;
}