'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rubik, Geist } from "next/font/google";
import { useState } from "react";
import "./globals.css";
import { APP_CONFIG } from "@/lib/utils/constants";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});



function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `body-large font-medium px-4 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
      isActive 
        ? 'text-primary bg-primary-light' 
        : 'text-neutral-900 hover:bg-primary-light'
    }`;
  };
  return (
    <>
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-white shadow hover:bg-primary-light transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o: boolean) => !o)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 text-primary"
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
    className="fixed top-0 right-0 z-50 w-64 h-full bg-white/95 shadow-2xl border-l border-primary backdrop-blur-lg md:hidden animate-in fade-in"
    tabIndex={-1}
    aria-modal="true"
    role="dialog"
  >
    <nav className="flex flex-col gap-4 p-8 mt-16 bg-white/95 rounded-2xl shadow-lg">
  {/* Contraste renforcé sur le menu mobile */}
          <Link href="/" className={getLinkClass('/')} onClick={() => setOpen(false)}>
            Accueil
          </Link>
          <Link href="/recherche" className={getLinkClass('/recherche')} onClick={() => setOpen(false)}>
            Recherche
          </Link>
          {/* <Link href="/about" className={getLinkClass('/about')} onClick={() => setOpen(false)}>
            À propos
          </Link> */}
          {/* <Link href="/moderation" className={getLinkClass('/moderation')} onClick={() => setOpen(false)}>
            Modération
          </Link> */}
          <Link href="/signaler" className={getLinkClass('/signaler')} onClick={() => setOpen(false)}>
            Signaler
          </Link>
          <Link href="/faq" className={getLinkClass('/faq')} onClick={() => setOpen(false)}>
            FAQ
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
    return `body-base font-medium px-3 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
      isActive 
        ? 'text-primary bg-primary-light' 
        : 'text-neutral-700 hover:text-primary hover:bg-primary-light'
    }`;
  };
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${rubik.variable} antialiased bg-neutral-50 text-neutral-900`}>
        <header className="w-full border-b border-primary bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="heading-main font-light text-neutral-900 hover:text-primary transition-colors">
              <strong>ODM</strong>
            </Link>
            {/* Menu desktop */}
            <nav className="hidden md:flex gap-8 body-base font-medium">
              <Link href="/" className={getDesktopLinkClass('/')}>
                Accueil
              </Link>
              <Link href="/recherche" className={getDesktopLinkClass('/recherche')}>
                Recherche
              </Link>
              {/* <Link href="/about" className={getDesktopLinkClass('/about')}>
                À propos
              </Link> */}
              {/* <Link href="/moderation" className={getDesktopLinkClass('/moderation')}>
                Modération
              </Link> */}
              <Link href="/signaler" className={getDesktopLinkClass('/signaler')}>
                Signaler
              </Link>
              <Link href="/faq" className={getDesktopLinkClass('/faq')}>
                FAQ
              </Link>
            </nav>
            {/* Menu mobile */}
            <MobileNav />
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)] w-full">
          {children}
        </main>
        {/* Footer */}
        <footer className="bg-neutral-900 text-white section-padding">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-6">
              <p className="body-large text-neutral-300 mb-2">
                Développé avec ❤️ par le collectif
              </p>
              <h3 className="heading-main text-white font-bold">
                Ethik Pirates
              </h3>
              <div className="text-center mt-4">
                <a
                  href={APP_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-small inline-flex items-center px-6 py-3 bg-gradient-to-r bg-white text-black font-medium rounded-full hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Contribuer sur GitHub
                </a>
              </div>
            </div>
            <div className="border-t border-neutral-700 pt-6">
              <p className="body-base text-neutral-400">
                &ldquo;Lancez l&apos;ère de la piraterie partout !&rdquo; - Pour une consommation qui favorise la vie plutôt que les profits
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
