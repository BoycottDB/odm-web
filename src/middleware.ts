import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAdminToken } from '@/lib/auth/admin';

export function middleware(request: NextRequest) {
  // Protection des routes admin (exclure /admin/login pour éviter la boucle)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!validateAdminToken(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protection des API admin (GET sur propositions, PATCH sur propositions)
  if (request.nextUrl.pathname.startsWith('/api/propositions')) {
    if (request.method === 'GET' || request.method === 'PATCH') {
      if (!validateAdminToken(request)) {
        return NextResponse.json(
          { error: 'Accès non autorisé' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/propositions/:path*']
};