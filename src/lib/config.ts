/**
 * Configuration centralisée pour l'application ODM Web
 * Compatible avec la migration Netlify
 */

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  api: {
    extensionUrl: process.env.NEXT_PUBLIC_EXTENSION_API_URL || 'https://odm-api.netlify.app',
  },
  app: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  admin: {
    token: process.env.ADMIN_TOKEN || 'admin-token-dev',
  }
} as const;

// Helper pour valider les variables d'environnement critiques
export function validateConfig() {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ] as const;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Variable d'environnement manquante: ${envVar}`);
    }
  }

  return true;
}

// Configuration pour debugging
export function getConfigSummary() {
  return {
    supabaseUrl: config.supabase.url,
    extensionApiUrl: config.api.extensionUrl,
    appUrl: config.app.url,
    environment: process.env.NODE_ENV || 'development',
    hasAdminToken: !!config.admin.token
  };
}