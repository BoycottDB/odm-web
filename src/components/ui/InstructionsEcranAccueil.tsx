"use client";
import type { MobileOS } from '@/hooks/useMobileDetection';

interface InstructionsEcranAccueilProps {
  os: MobileOS;
  onClose: () => void;
}

// Étapes manuelles quand le navigateur ne propose pas sa propre fenêtre d'installation (iOS, certains Android)
export function InstructionsEcranAccueil({ os, onClose }: InstructionsEcranAccueilProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
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
                      <div className="text-secondary-500 p-1 mr-8">
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
  );
}
