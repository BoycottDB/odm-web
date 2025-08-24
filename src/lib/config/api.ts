/**
 * API Configuration - Configuration simplifiée pour odm-api
 */

// Extension API Configuration
export const EXTENSION_API_CONFIG = {
  url: process.env.NEXT_PUBLIC_EXTENSION_API_URL || 'https://odm-api.netlify.app',
  timeout: 10000, // 10 secondes
} as const;

// Helper function pour construire les URLs
export function getExtensionApiUrl(endpoint?: string): string {
  const baseUrl = EXTENSION_API_CONFIG.url.endsWith('/') 
    ? EXTENSION_API_CONFIG.url.slice(0, -1) 
    : EXTENSION_API_CONFIG.url;
  
  if (endpoint) {
    return `${baseUrl}/.netlify/functions/${endpoint}`;
  }
  
  return baseUrl;
}

// Configuration pour debugging
export function getApiConfig() {
  return {
    odmApiUrl: EXTENSION_API_CONFIG.url,
    mode: 'simplified',
    environment: process.env.NODE_ENV || 'development',
    timeout: EXTENSION_API_CONFIG.timeout
  };
}