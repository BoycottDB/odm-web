import { NextRequest } from 'next/server';

// Token admin simple (à définir dans les variables d'environnement)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-dev';

export function validateAdminToken(req: NextRequest): boolean {
  // Vérifier d'abord les cookies
  const cookieToken = req.cookies.get('admin_token')?.value;
  if (cookieToken && cookieToken === ADMIN_TOKEN) {
    return true;
  }
  
  // Fallback sur les headers Authorization
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    return token === ADMIN_TOKEN;
  }
  
  return false;
}

export function requireAdmin(req: NextRequest): Response | null {
  if (!validateAdminToken(req)) {
    return new Response(
      JSON.stringify({ error: 'Accès non autorisé' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  return null;
}

// Utilitaires pour le côté client
export const adminAuth = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },
  
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', token);
    // Définir aussi le cookie pour le middleware
    document.cookie = `admin_token=${token}; path=/; max-age=86400; secure; samesite=strict`;
  },
  
  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_token');
    // Effacer aussi le cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
  
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
  
  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};