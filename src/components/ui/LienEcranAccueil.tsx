"use client";
import { useState } from 'react';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';
import { InstructionsEcranAccueil } from './InstructionsEcranAccueil';

// Invitation discrète à installer le site, en fin de conseils : seulement sur mobile et si le site n'est pas déjà installé
export function LienEcranAccueil({ className = '' }: { className?: string }) {
  const { os, canInstall, hasNativePrompt, installApp } = useAddToHomeScreen();
  const [showInstructions, setShowInstructions] = useState(false);

  if (!canInstall) return null;

  // Sans fenêtre d'installation du navigateur (iOS, certains Android) : étapes manuelles
  const handleClick = () => {
    if (hasNativePrompt) {
      installApp();
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <p className={className}>
        Même les bonnes intentions peuvent vite s&apos;oublier.{' '}
        <button type="button" onClick={handleClick} className="font-semibold underline hover:text-primary">
          Ajoutez le site à votre écran d&apos;accueil
        </button>{' '}
        pour garder le cap.
      </p>

      {showInstructions && (
        <InstructionsEcranAccueil os={os} onClose={() => setShowInstructions(false)} />
      )}
    </>
  );
}
