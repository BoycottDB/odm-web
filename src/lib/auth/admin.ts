import { NextRequest } from 'next/server';

// Token admin simple (à définir dans les variables d'environnement). Sans token configuré, tout accès admin est refusé.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export const ADMIN_COOKIE = 'admin_token';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24;

// Comparaison à temps constant : la durée ne révèle pas combien de caractères sont justes.
// Écrite à la main car le middleware tourne en Edge, sans crypto.timingSafeEqual.
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isValidAdminToken(token: string | undefined | null): boolean {
  if (!ADMIN_TOKEN || !token) {
    return false;
  }
  return safeEqual(token, ADMIN_TOKEN);
}

export function validateAdminToken(req: NextRequest): boolean {
  // Cookie httpOnly posé par /api/admin/session (navigateur)
  if (isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return true;
  }

  // En-tête Authorization (scripts, curl)
  const authHeader = req.headers.get('authorization');
  return isValidAdminToken(authHeader?.replace('Bearer ', ''));
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
