'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname.startsWith(path);
  
  const navItems = [
    { path: '/admin/moderation', label: 'Modération', icon: '📋' },
    { path: '/admin/marques', label: 'Marques', icon: '🏢' },
    { path: '/admin/beneficiaires', label: 'Bénéficiaires', icon: '💰' },
    { path: '/admin/secteurs-marque', label: 'Secteurs', icon: '🏷️' },
  ];
  
  return (
    <nav className="bg-white border-b border-neutral mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium body-small ${
                isActive(item.path)
                  ? 'border-violet-magenta-500 text-violet-magenta-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral'
              }`}
            >
              <span className="body-large">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="body-small text-neutral-500 hover:text-neutral-700 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour au site</span>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  import('@/lib/auth/admin').then(({ adminAuth }) => {
                    adminAuth.removeToken();
                    router.push('/admin/login');
                  });
                }
              }}
              className="body-small text-error hover:text-error flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}