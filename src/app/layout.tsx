import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Répertoire de Marques à Boycotter",
  description:
    "Base de données collaborative et transparente pour informer sur les pratiques des marques et incidents historiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
        <header className="w-full border-b border-orange-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-light text-gray-900 hover:text-orange-600 transition-colors">
              Répertoire Marques
            </Link>
            <nav className="flex gap-8 text-base font-medium">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-full hover:bg-orange-50">
                Accueil
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-full hover:bg-orange-50">
                À propos
              </Link>
              <Link href="/moderation" className="text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-full hover:bg-orange-50">
                Modération
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)] w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
