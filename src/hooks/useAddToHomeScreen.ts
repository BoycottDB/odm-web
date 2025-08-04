"use client";
import { useState, useEffect } from 'react';
import { useMobileDetection } from './useMobileDetection';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface AddToHomeScreenState {
  canInstall: boolean;
  hasBeenDismissed: boolean;
  isInstalling: boolean;
  showIOSInstructions: boolean;
}

interface AddToHomeScreenActions {
  installApp: () => Promise<void>;
  dismissPrompt: () => void;
  openIOSInstructions: () => void;
  hideIOSInstructions: () => void;
}

export function useAddToHomeScreen(): AddToHomeScreenState & AddToHomeScreenActions {
  const { isMobile, os, isStandalone } = useMobileDetection();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé le prompt
    const dismissed = localStorage.getItem('addToHomeScreenDismissed');
    if (dismissed === 'true') {
      setHasBeenDismissed(true);
    }

    // Écouter l'événement beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      localStorage.setItem('addToHomeScreenInstalled', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const canInstall = isMobile && !isStandalone && !hasBeenDismissed && 
    (deferredPrompt !== null || os === 'ios' || os === 'android');

  const installApp = async () => {
    if (!deferredPrompt) {
      // Cas Android sans deferredPrompt : ouvrir les instructions manuelles
      if (os === 'android') {
        setShowIOSInstructions(true); // Réutiliser le modal d'instructions
      }
      return;
    }

    setIsInstalling(true);
    
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('addToHomeScreenInstalled', 'true');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const dismissPrompt = () => {
    setHasBeenDismissed(true);
    localStorage.setItem('addToHomeScreenDismissed', 'true');
  };

  const showIOSInstructionsModal = () => {
    setShowIOSInstructions(true);
  };

  const hideIOSInstructions = () => {
    setShowIOSInstructions(false);
  };

  return {
    canInstall,
    hasBeenDismissed,
    isInstalling,
    showIOSInstructions,
    installApp,
    dismissPrompt,
    openIOSInstructions: showIOSInstructionsModal,
    hideIOSInstructions
  };
}