/**
 * API Configuration - Centralized configuration for all API endpoints
 */

// Extension API Configuration
export const EXTENSION_API_CONFIG = {
  // Base URL for extension API
  url: process.env.NEXT_PUBLIC_EXTENSION_API_URL || 'http://localhost:8888/',
  
  // Enable/disable hybrid mode for reads
  useForReads: process.env.NEXT_PUBLIC_USE_EXTENSION_API_FOR_READS === 'true',
  
  // Timeout for extension API calls (ms)
  timeout: 10000,
  
  // Cache TTL for different endpoints (ms)
  cache: {
    marques: 20 * 60 * 1000,      // 20 minutes
    evenements: 15 * 60 * 1000,   // 15 minutes  
    categories: 60 * 60 * 1000,   // 1 hour
    dirigeants: 30 * 60 * 1000,   // 30 minutes
    secteurs: 60 * 60 * 1000,     // 1 hour
  }
} as const;

// Helper functions
export function getExtensionApiUrl(endpoint?: string): string {
  const baseUrl = EXTENSION_API_CONFIG.url.endsWith('/') 
    ? EXTENSION_API_CONFIG.url.slice(0, -1) 
    : EXTENSION_API_CONFIG.url;
  
  if (endpoint) {
    return `${baseUrl}/.netlify/functions/${endpoint}`;
  }
  
  return baseUrl;
}

export function isHybridModeEnabled(): boolean {
  return EXTENSION_API_CONFIG.useForReads;
}

// Environment info for debugging
export function getApiConfig() {
  return {
    extensionApiUrl: EXTENSION_API_CONFIG.url,
    hybridMode: EXTENSION_API_CONFIG.useForReads,
    environment: process.env.NODE_ENV || 'development',
    timeout: EXTENSION_API_CONFIG.timeout
  };
}