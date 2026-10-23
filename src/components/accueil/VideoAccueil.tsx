'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2 } from 'lucide-react';
import { VideoSkeleton } from '@/components/ui/VideoSkeleton';

interface VideoAccueilProps {
  nom: string;
}

const togglePlayback = (e: React.MouseEvent<HTMLVideoElement>) => {
  const video = e.currentTarget;
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

// Vidéo compressée en boucle, agrandie au clic sur le bouton avec la version HD (chargée seulement à l'ouverture)
export default function VideoAccueil({ nom }: VideoAccueilProps) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [agrandie, setAgrandie] = useState(false);

  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 95));
    }, 200);
    return () => clearInterval(id);
  }, [ready]);

  const handleLoaded = () => {
    setReady(true);
    setProgress(100);
  };

  const fermer = () => setAgrandie(false);

  // Échap pour fermer
  useEffect(() => {
    if (!agrandie) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [agrandie]);

  return (
    <div className="relative liquid-glass rounded-xl md:rounded-2xl p-0 md:p-3 text-center">
      <video
        src={`/videos/${nom}.mp4`}
        autoPlay
        muted
        loop
        playsInline
        onCanPlayThrough={handleLoaded}
        onLoadedData={handleLoaded}
        onClick={togglePlayback}
        className={`w-full aspect-[3/2] object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      {ready && (
        <button
          onClick={() => setAgrandie(true)}
          className="absolute bottom-2 right-2 md:bottom-5 md:right-5 w-9 h-9 bg-black/10 text-white rounded-full flex items-center justify-center hover:bg-black/25 transition-all"
          aria-label="Agrandir la vidéo"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
      {!ready && (
        <div className="absolute inset-0 p-0 md:p-3">
          <VideoSkeleton progress={progress} shouldLoad={!ready} />
        </div>
      )}

      {/* Portail vers body : le backdrop-filter de liquid-glass enfermerait le fixed dans la section */}
      {agrandie && createPortal(
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/50 flex items-center justify-center z-50 p-4 md:p-10"
          onClick={fermer}
          role="dialog"
          aria-modal="true"
          aria-label="Vidéo agrandie"
        >
          <div className="relative w-full max-w-[960px] liquid-glass rounded-xl md:rounded-2xl p-0 md:p-3" onClick={(e) => e.stopPropagation()}>
            <video
              src={`/videos/hd/${nom}.mp4`}
              autoPlay
              muted
              loop
              playsInline
              onClick={togglePlayback}
              className="w-full max-h-[90vh] rounded-lg block cursor-pointer"
            />
            <button
              onClick={fermer}
              className="absolute top-2 right-2 md:top-5 md:right-5 w-8 h-8 bg-black/10 text-white rounded-full flex items-center justify-center hover:bg-black/25 transition-all"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
