"use client";
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';

export function IOSInstallInstructions() {
  const { showIOSInstructions, hideIOSInstructions } = useAddToHomeScreen();

  if (!showIOSInstructions) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hideIOSInstructions();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={hideIOSInstructions}
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
            <div className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm text-neutral-700">
                  Appuyez sur l&apos;icône <strong>Partager</strong> dans la barre de navigation
                </p>
                <div className="mt-2 flex justify-center">
                  <div className="bg-secondary-500 text-white rounded p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z"/>
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