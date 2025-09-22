'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rubik, Geist } from "next/font/google";
import { useState } from "react";
import "./globals.css";

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
    return `body-large font-medium px-4 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isActive
        ? 'text-primary bg-primary-light'
        : 'text-neutral-900 hover:bg-primary-light'
      }`;
  };
  return (
    <>
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-primary-medium bg-white shadow hover:bg-primary-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary relative z-50"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o: boolean) => !o)}
      >
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
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      {open && (
        <div
          id="mobile-menu"
          className="fixed top-0 right-0 z-50 w-64 md:hidden animate-in fade-in"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          {/* Header avec bouton de fermeture */}
          <div className="flex justify-end items-center p-3">
            <button
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Fermer le menu"
            >
              <svg
                className="w-5 h-5 text-primary-dark"
                fill="none"
                stroke="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4 p-4 bg-white border-b border-primary-light rounded-b-2xl" role="navigation" aria-label="Navigation mobile">
            {/* Contraste renforcé sur le menu mobile */}
            {/* <Link href="/" className={getLinkClass('/')} onClick={() => setOpen(false)}>
            Accueil
          </Link> */}
            <Link href="/recherche" className={getLinkClass('/recherche')} onClick={() => setOpen(false)}>
              Rechercher
            </Link>
            {/* <Link href="/about" className={getLinkClass('/about')} onClick={() => setOpen(false)}>
            À propos
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
    return `body-base font-medium px-3 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${isActive
        ? 'text-primary bg-primary-light'
        : 'text-neutral-900 hover:text-primary hover:bg-primary-light'
      }`;
  };
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#990F4B" />
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
      <body className={`${geistSans.variable} ${rubik.variable} antialiased bg-[#f8f6f7] text-[#14090f]`}>
        <header className="w-full border-b border-primary-medium bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="heading-main font-light text-primary hover:text-neutral-900 transition-colors flex items-center">
              <svg className="w-8 h-8 mt-1 md:w-10 md:h-10" viewBox="0 0 740 740">
                <path fill="#98105b" d="M509.019 168.859C513.121 168.37 519.606 167.977 523.429 167.987C569.206 168.108 617.526 200.37 644.846 249.054C649.866 257.998 651.37 261.775 656.718 278.86C662.178 296.301 662.988 299.858 664.18 311.638C667.738 346.793 662.954 373.97 648.237 402.203C638.011 421.82 627.666 434.317 612.453 445.43C584.996 465.487 545.708 472.597 512.767 463.47C494.694 458.463 476.173 448.689 460.645 435.967C435.479 415.347 415.557 384.004 406.813 351.276C395.114 307.486 399.532 265.829 419.745 229.335C430.037 210.751 442.794 196.887 459.144 186.516C466.218 182.029 469.958 180.405 484.501 175.501C496.39 171.492 503.821 169.479 509.019 168.859ZM489.288 209.799C479.979 215.145 466.313 228.684 459.859 238.954C447.048 259.341 441.026 288.72 443.796 317.322C445.259 332.431 453.426 358.136 460.96 371.349C471.579 389.971 484.417 405.006 497.758 414.445C525.514 434.082 549.325 438.937 576.357 430.471C594.42 424.814 606.12 416.768 618.255 401.658C633.658 382.48 640.983 360.099 641.359 331.065C641.596 312.749 639.619 301.217 633.092 282.836C625.356 261.053 617.117 247.553 601.898 231.724C578.951 207.857 551.305 196.481 522.741 199.152C513.853 199.983 497.092 205.318 489.288 209.799ZM517.427 219.267C541.512 215.835 570.677 231.043 589.873 257.042C599.017 269.427 602.753 277.142 608.591 295.693C614.367 314.048 615.755 322.471 615.446 337.288C614.66 375.045 595.883 405.152 567.51 414.148C540.778 422.624 509.324 410.148 486.439 381.992C484.502 379.609 480.394 373.703 477.31 368.867C472.099 360.697 471.277 358.727 465.682 341.003C459.092 320.124 458.186 313.985 458.977 295.55C460.716 255.045 484.541 223.952 517.427 219.267ZM531.794 246.87C531.924 247.261 534.518 251.143 537.558 255.496C540.598 259.849 545.098 267.037 547.557 271.471C550.017 275.904 552.27 279.455 552.565 279.362C552.86 279.268 555.115 275.272 557.576 270.481L562.05 261.771L557.05 257.797C550.965 252.961 542.981 248.606 537.271 247.007C532.768 245.746 531.408 245.712 531.794 246.87ZM575.418 309.225C569.051 320.833 568.961 321.12 570.33 325.436C572.574 332.514 574.286 350.578 574.112 365.351C574.024 372.891 574.162 379.184 574.418 379.334C575.515 379.976 583.237 368.994 585.65 363.362C593.304 345.495 593.704 326.602 586.888 304.934C584.979 298.866 583.94 296.699 583.081 296.997C582.432 297.223 578.983 302.725 575.418 309.225ZM394.469 245.657C382.895 269.316 378.081 298.809 380.909 328.738C382.5 345.577 389.356 370.143 396.634 385.088C413.407 419.526 437.31 444.29 469.861 460.95C474.918 463.538 477.994 465.608 476.832 465.641C467.021 465.915 446.529 468.107 408.343 472.965C395.864 474.553 369.973 477.763 350.808 480.098C331.642 482.434 310.194 485.064 303.146 485.944C296.097 486.824 287.983 487.181 285.114 486.737C263.667 483.422 246.147 462.138 232.145 422.392C222.647 395.427 220.196 379.984 222.795 363.462C224.981 349.562 230.851 338.15 239.172 331.624C241.567 329.746 254.613 321.593 268.164 313.507C281.715 305.42 301.097 293.799 311.235 287.682C321.373 281.566 340.043 270.472 352.724 263.03C387.34 242.715 395.016 238.178 397.402 236.628C399.062 235.55 398.368 237.687 394.469 245.657ZM207.952 367.021C208.009 367.202 207.745 370.175 207.366 373.629C205.773 388.141 206.99 395.361 215.588 422.396C222.742 444.887 223.916 447.895 228.312 455.006C230.976 459.314 234.604 464.479 236.374 466.483C240.283 470.909 240.714 472.027 238.46 471.893C237.511 471.836 229.04 473.034 219.634 474.555C210.229 476.076 197.11 478.081 190.482 479.012C183.853 479.943 172.703 481.632 165.705 482.767C151.212 485.115 147.192 484.856 140.88 481.166C131.311 475.571 125.969 467.343 121.608 451.481C119.178 442.641 118.985 440.625 119.892 433.546C121.032 424.643 123.855 419.037 128.766 415.926C130.574 414.781 135.191 411.83 139.027 409.368C142.862 406.907 159.442 396.663 175.87 386.604C192.298 376.545 206.214 367.95 206.793 367.504C207.373 367.058 207.894 366.841 207.952 367.021ZM123.549 405.219C125.605 405.336 129.289 405.787 131.735 406.222C136.659 407.098 136.859 406.776 127.495 413.025C124.115 415.28 120.233 418.543 118.869 420.275C108.703 433.187 113.333 463.855 127.673 478.595C136.388 487.552 143.211 489.821 156.209 488.086C159.482 487.65 162.244 487.569 162.348 487.907C162.691 489.032 157.534 494.917 153.183 498.365C150.106 500.803 146.504 502.522 140.451 504.442C132.692 506.902 131.38 507.018 124.192 505.881C106.782 503.128 93.3891 489.841 86.5627 468.55C81.4625 452.642 81.9772 438.662 88.0985 426.838C93.2177 416.95 98.6791 412.407 110.368 408.314C116.586 406.137 121.087 405.08 123.549 405.219Z" />
              </svg>
              <strong className="text-primary">ODM</strong>
            </Link>
            {/* Menu desktop */}
            <nav className="hidden md:flex gap-8 body-base font-medium" role="navigation" aria-label="Navigation principale">
              {/* <Link href="/" className={getDesktopLinkClass('/')}>
                Accueil
              </Link> */}
              <Link href="/recherche" className={getDesktopLinkClass('/recherche')}>
                Rechercher
              </Link>
              {/* <Link href="/about" className={getDesktopLinkClass('/about')}>
                À propos
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
              <h3 className="heading-main text-white font-bold">
                Ethik Pirates
              </h3>
            </div>
            <div className="border-t border-secondary pt-8">
              <p className="body-base text-white">
                &ldquo;Lancez l&apos;ère de la piraterie partout !&rdquo; - Pour une consommation qui favorise la vie plutôt que les profits
              </p>
              <div className="text-center mt-4">
                <a
                  href={"http://localhost:3000/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-small inline-flex items-center px-6 py-3 bg-gradient-to-r bg-black hover:bg-primary text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
        <p className="relative z-10 bg-foreground text-center text-xs md:text-sm text-gray-400 pb-3 md:-mt-10">
          Ce projet étant le fruit du travail d&apos;humains, il peut y avoir des erreurs ou des données non à jour. N&apos;hésitez pas à vérifier les sources et à nous signaler des éventuelles corrections.
        </p>
      </body>
    </html>
  );
}
