'use client';
import { Rubik, Geist } from "next/font/google";
import "./globals.css";
import { APP_CONFIG } from "@/lib/utils/constants";
import { HeaderSearchProvider } from "@/contexts/HeaderSearchContext";
import { Header } from "@/components/layout/Header";

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
  return (
    <HeaderSearchProvider>
      <html lang="fr">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#DB2777" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="ODM" />
          
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
        <body className={`${geistSans.variable} ${rubik.variable} antialiased bg-neutral-50 text-neutral-900`}>
          <Header />
          <main className="min-h-[calc(100vh-80px)] w-full" role="main">
            {children}
          </main>
        {/* Footer */}
        <footer className="bg-neutral-900 text-white section-padding" role="contentinfo">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-6">
              <p className="body-large text-neutral-300 mb-2">
                Développé avec ❤️ par le collectif
              </p>
              <h3 className="heading-main text-white font-bold">
                Ethik Pirates
              </h3>
            </div>
            <div className="border-t border-neutral-700 pt-8">
              <p className="body-base text-neutral-400">
                &ldquo;Lancez l&apos;ère de la piraterie partout !&rdquo; - Pour une consommation qui favorise la vie plutôt que les profits
              </p>
              <div className="text-center mt-4">
                <a
                  href={APP_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-small inline-flex items-center px-6 py-3 bg-gradient-to-r bg-black hover:bg-white text-white font-medium rounded-full hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
        </body>
      </html>
    </HeaderSearchProvider>
  );
}
