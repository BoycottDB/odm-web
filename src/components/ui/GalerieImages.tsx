'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GalerieImagesProps {
  images: string[];
  alt: string;
}

// Rangée de vignettes au format des conseils (classe image-group), agrandies au clic
export default function GalerieImages({ images, alt }: GalerieImagesProps) {
  const [indexOuvert, setIndexOuvert] = useState<number | null>(null);

  const fermer = () => setIndexOuvert(null);
  const naviguer = (sens: 1 | -1) =>
    setIndexOuvert((index) => (index === null ? null : (index + sens + images.length) % images.length));

  // Flèches pour passer d'une image à l'autre, Échap pour fermer
  useEffect(() => {
    if (indexOuvert === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') naviguer(-1);
      if (e.key === 'ArrowRight') naviguer(1);
      if (e.key === 'Escape') fermer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const plusieurs = images.length > 1;

  return (
    <>
      <div className="image-group">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={300}
            height={400}
            style={{ width: 'auto' }}
            role="button"
            tabIndex={0}
            aria-label={`Agrandir l'image ${index + 1}`}
            onClick={() => setIndexOuvert(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIndexOuvert(index); } }}
          />
        ))}
      </div>

      {indexOuvert !== null && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/50 flex items-center justify-center z-50 p-7"
          onClick={fermer}
          role="dialog"
          aria-modal="true"
          aria-label="Image agrandie"
        >
          <div className="relative max-w-md md:max-w-xl flex items-center">
            {plusieurs && (
              <button
                onClick={(e) => { e.stopPropagation(); naviguer(-1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/75 transition-all z-10"
                aria-label="Image précédente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="relative">
              <Image
                src={images[indexOuvert]}
                alt={alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
                unoptimized
              />

              <button
                onClick={fermer}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/75 transition-all"
                aria-label="Fermer"
              >
                ×
              </button>

              {plusieurs && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {indexOuvert + 1} / {images.length}
                </div>
              )}
            </div>

            {plusieurs && (
              <button
                onClick={(e) => { e.stopPropagation(); naviguer(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/75 transition-all z-10"
                aria-label="Image suivante"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
