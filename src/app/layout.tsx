'use client';
import Link from "next/link";
import Image from 'next/image';
import Script from 'next/script';
import { usePathname } from "next/navigation";
import { Rubik, Geist } from "next/font/google";
import { BarreMobile, barreMobileVisible } from "@/components/ui/BarreMobile";
import { BoutonRetour } from "@/components/ui/BoutonRetour";
import { BarreProgression } from "@/components/ui/BarreProgression";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? (process.env.NODE_ENV === 'development' ? 'local' : 'prod');
  const websiteId = appEnv === 'local'
    ? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID_LOCAL
    : process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  // misEnAvant : texte en gras pour distinguer l'onglet sans le confondre avec l'onglet actif (fond plein)
  const getDesktopLinkClass = (href: string, misEnAvant = false) => {
    const isActive = pathname === href;
    return `body-base ${misEnAvant ? 'font-semibold' : 'font-medium'} px-3 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isActive
        ? 'text-primary bg-primary-light'
        : 'text-neutral-900 hover:text-primary-dark hover:bg-primary-light'
      }`;
  };
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#98105b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Qui j'enrichis ?" />
        {/* Umami Analytics : seulement sur le vrai domaine (pas les deploy previews), jamais sur /admin */}
        <script
          dangerouslySetInnerHTML={{
            __html: "window.umamiBeforeSend=function(t,p){return p&&p.url&&p.url.indexOf('/admin')===0?false:p}",
          }}
        />
        <Script
          async
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id={websiteId}
          data-domains={appEnv === 'prod' ? 'quijenrichis.fr,www.quijenrichis.fr' : undefined}
          data-before-send="umamiBeforeSend"
        />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />

        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      </head>
      <body className={`${geistSans.variable} ${rubik.variable} antialiased bg-background text-foreground`}>
        <BarreProgression />
        <header className="w-full border-b border-primary-medium bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="relative max-w-6xl mx-auto px-4 py-3 flex justify-center md:justify-between items-center">
            <BoutonRetour />
            <Link href="/" aria-label="Qui j'enrichis ? – Accueil" className="heading-main text-primary hover:text-neutral-900 transition-colors flex items-center">
              <Image src="/logo.png" alt="" width={28} height={28} priority className="hidden md:block md:w-7 md:h-7 mr-2" />
              <strong className="text-[1.4rem]">Qui j&apos;enrichis ?</strong>
            </Link>
            {/* Menu desktop */}
            <nav className="hidden md:flex gap-8 body-base font-medium" role="navigation" aria-label="Navigation principale">
              {/* <Link href="/" className={getDesktopLinkClass('/')}>
                Accueil
              </Link> */}
              <Link href="/marques" className={getDesktopLinkClass('/marques', true)}>
                Rechercher
              </Link>
              <Link href="/boycotter" className={getDesktopLinkClass('/boycotter', true)}>
                Boycotter ?
              </Link>
              <Link href="/signaler" className={getDesktopLinkClass('/signaler')}>
                Signaler
              </Link>
              <Link href="/faq" className={getDesktopLinkClass('/faq')}>
                FAQ
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-64px)] w-full" role="main">
          {children}
        </main>
        {/* Footer */}
        <footer className="relative z-10 bg-foreground text-white section-padding" role="contentinfo">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-6">
              <p className="body-large text-white mb-2">
                Développé avec ❤️ par le collectif
              </p>
              <h3 className="heading-main text-white">
                Ethik Pirates
              </h3>
            </div>
            <div className="border-t border-secondary pt-8">
              <p className="body-base text-white">
                &ldquo;Lancez l&apos;ère de la piraterie partout !&rdquo; - Pour une consommation qui favorise la vie plutôt que les profits
              </p>
              <div className="text-center mt-4">
                <a
                  href="https://github.com/BoycottDB/odm-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-small inline-flex items-center px-6 py-3 bg-black hover:bg-primary-dark text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Contribuer sur GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
        <p className={`relative z-10 bg-foreground text-center text-xs md:text-sm text-white/60 md:-mt-10 ${barreMobileVisible(pathname) ? 'pb-24 md:pb-3' : 'pb-3'}`}>
          Ce projet étant le fruit du travail d&apos;humains, il peut y avoir des erreurs ou des données non à jour. N&apos;hésitez pas à vérifier les sources et à nous signaler des éventuelles corrections.
          {' · '}
          <Link href="/droit-de-reponse" className="underline hover:text-white">
            Droit de réponse et corrections
          </Link>
          {' · '}
          <Link href="/confidentialite" className="underline hover:text-white">
            Confidentialité
          </Link>
          {' · '}
          <Link href="/mentions-legales" className="underline hover:text-white">
            Mentions légales
          </Link>
        </p>
        <BarreMobile />
      </body>
    </html>
  );
}
