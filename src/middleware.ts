import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAdminToken } from '@/lib/auth/admin';

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Seules écritures autorisées sans token admin : toute autre écriture sur /api/* est refusée par défaut
const PUBLIC_WRITES = [
  { method: 'POST', path: '/api/propositions' },
  { method: 'POST', path: '/api/sondage-ecommerce' },
];

function unauthorized() {
  return NextResponse.json(
    { error: 'Accès non autorisé' },
    { status: 401 }
  );
}

function isPublicWrite(method: string, pathname: string): boolean {
  return PUBLIC_WRITES.some((route) => route.method === method && route.path === pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  // Protection des routes admin (exclure /admin/login pour éviter la boucle)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!validateAdminToken(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Lecture des propositions réservée aux admins (signalements non modérés)
  if (pathname.startsWith('/api/propositions') && method === 'GET') {
    if (!validateAdminToken(request)) {
      return unauthorized();
    }
  }

  // Écritures sur l'API réservées aux admins, sauf liste blanche
  if (pathname.startsWith('/api/') && WRITE_METHODS.includes(method) && !isPublicWrite(method, pathname)) {
    if (!validateAdminToken(request)) {
      return unauthorized();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
};
