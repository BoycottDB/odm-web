'use client';
import type { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `body-large font-medium px-4 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-berry-400 ${
      isActive 
        ? 'text-berry-600 bg-berry-100' 
        : 'text-gray-900 hover:bg-berry-50'
    }`;
  };
  return (
    <>
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-berry-200 bg-white shadow hover:bg-berry-50 transition-all focus:outline-none focus:ring-2 focus:ring-berry-400"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o: boolean) => !o)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 text-berry-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      {open && (
  <div
    id="mobile-menu"
    className="fixed top-0 right-0 z-50 w-64 h-full bg-white/95 shadow-2xl border-l border-berry-100 backdrop-blur-lg md:hidden animate-in fade-in"
    tabIndex={-1}
    aria-modal="true"
    role="dialog"
  >
    <nav className="flex flex-col gap-4 p-8 mt-16 bg-white/95 rounded-2xl shadow-lg">
  {/* Contraste renforcé sur le menu mobile */}
          <Link href="/" className={getLinkClass('/')} onClick={() => setOpen(false)}>
            Accueil
          </Link>
          <Link href="/about" className={getLinkClass('/about')} onClick={() => setOpen(false)}>
            À propos
          </Link>
          <Link href="/moderation" className={getLinkClass('/moderation')} onClick={() => setOpen(false)}>
            Modération
          </Link>
          <Link href="/signaler" className={getLinkClass('/signaler')} onClick={() => setOpen(false)}>
            Signaler!
          </Link>
        </nav>
      </div>
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  const getDesktopLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `body-base font-medium px-3 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-berry-400 ${
      isActive 
        ? 'text-berry-600 bg-berry-100' 
        : 'text-gray-700 hover:text-berry-600 hover:bg-berry-50'
    }`;
  };
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <header className="w-full border-b border-berry-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="heading-main font-light text-gray-900 hover:text-berry-600 transition-colors">
              Observatoire Marques
            </Link>
            {/* Menu desktop */}
            <nav className="hidden md:flex gap-8 body-base font-medium">
              <Link href="/" className={getDesktopLinkClass('/')}>
                Accueil
              </Link>
              <Link href="/about" className={getDesktopLinkClass('/about')}>
                À propos
              </Link>
              <Link href="/moderation" className={getDesktopLinkClass('/moderation')}>
                Modération
              </Link>
              <Link href="/signaler" className={getDesktopLinkClass('/signaler')}>
                Signaler!
              </Link>
            </nav>
            {/* Menu mobile */}
            <MobileNav />
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)] w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
