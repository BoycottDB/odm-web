"use client";
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useState, useEffect } from 'react';

export function AddToHomeScreenBanner() {
  const { os } = useMobileDetection();
  const {
    canInstall,
    isInstalling,
    installApp,
    dismissPrompt
  } = useAddToHomeScreen();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showLocalModal, setShowLocalModal] = useState(false);

  useEffect(() => {
    if (canInstall) {
      // Délai pour l'animation d'entrée
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const handleInstall = async () => {
    if (os === 'ios' || os === 'android') {
      // Pour iOS et Android : utiliser le modal local avec instructions spécifiques
      setShowLocalModal(true);
    } else {
      await installApp();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(dismissPrompt, 300); // Attendre la fin de l'animation
  };

  if (!canInstall || !isVisible) {
    return null;
  }

  const getMessage = () => {
    if (os === 'ios') {
      return "Créer un raccourci vers cette page";
    }
    return "Installez l'app pour un accès rapide à vos recherches !";
  };

  const getButtonText = () => {
    if (isInstalling) return "Installation...";
    if (os === 'ios') return "Ajouter";
    return "Installer";
  };

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-primary-light shadow-lg z-50 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="bg-primary-light rounded-full p-1.5 flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs text-neutral-700 leading-tight truncate">
                {getMessage()}
              </p>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {getButtonText()}
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-neutral-500 hover:text-neutral-700 p-1.5 rounded transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espaceur pour éviter que le contenu soit caché */}
      {isVisible && <div className="h-12" />}
      
      {/* Modal iOS Instructions */}
      {showLocalModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLocalModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowLocalModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Ajouter à l&apos;écran d&apos;accueil
              </h3>

              <div className="space-y-4 text-left">
                {os === 'ios' ? (
                  // Instructions iOS
                  <>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Appuyez sur l&apos;icône <strong>Partager</strong> dans la barre de navigation
                        </p>
                        <div className="mt-2 flex items-center justify-center">
                          <div className="text-blue-500 p-1 mr-8">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 50 50">
                              <path d="M30 13L25 8l-5 5-1-1L25 5l6 6z"/>
                              <path d="M24 7h2v21h-2z"/>
                              <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Sélectionnez <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong>
                        </p>
                        <div className="mt-2 bg-neutral-100 rounded p-2 text-xs text-neutral-600">
                          📱 Ajouter à l&apos;écran d&apos;accueil
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Confirmez en appuyant sur <strong>&quot;Ajouter&quot;</strong>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Instructions Android
                  <>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Appuyez sur le <strong>menu</strong> (⋮) en haut à droite
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Sélectionnez <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong>
                        </p>
                        <div className="mt-2 bg-neutral-100 rounded p-2 text-xs text-neutral-600">
                          📱 Ajouter à l&apos;écran d&apos;accueil
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700">
                          Confirmez en appuyant sur <strong>&quot;Ajouter&quot;</strong>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 text-center">
                  Une fois ajoutée, l&apos;application apparaîtra sur votre écran d&apos;accueil pour un accès rapide.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}