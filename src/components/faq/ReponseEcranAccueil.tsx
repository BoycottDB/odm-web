"use client";
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';

// Étapes affichées pour les deux téléphones : on peut lire la FAQ sur ordinateur
const ETAPES = [
  {
    titre: 'Sur iPhone (Safari)',
    etapes: [
      <>Appuie sur l&apos;icône <strong>Partager</strong> en bas de l&apos;écran.</>,
      <>Choisis <strong>Sur l&apos;écran d&apos;accueil</strong>.</>,
      <>Confirme avec <strong>Ajouter</strong>.</>,
    ],
  },
  {
    titre: 'Sur Android (Chrome)',
    etapes: [
      <>Appuie sur le <strong>menu</strong> (⋮) en haut à droite.</>,
      <>Choisis <strong>Ajouter à l&apos;écran d&apos;accueil</strong>.</>,
      <>Confirme avec <strong>Ajouter</strong>.</>,
    ],
  },
];

export default function ReponseEcranAccueil() {
  const { hasNativePrompt, installApp } = useAddToHomeScreen();

  return (
    <>
      <p className="body-large text-neutral-900 leading-snug">
        Pour l&apos;avoir sous la main pendant tes courses, sans passer par un store ni créer de compte.
      </p>

      {/* Fenêtre d'installation du navigateur, quand il en propose une (Android/Chrome) */}
      {hasNativePrompt && (
        <button type="button" onClick={installApp} className="bouton-primaire px-4 py-2 text-sm">
          Ajouter maintenant
        </button>
      )}

      {ETAPES.map(({ titre, etapes }) => (
        <div key={titre} className="border-l-2 border-neutral-200 pl-4">
          <h4 className="body-large font-semibold text-neutral-900 mb-3">{titre}</h4>
          <ol className="list-decimal pl-5 space-y-1 body-base text-neutral-700 leading-snug">
            {etapes.map((etape, index) => <li key={index}>{etape}</li>)}
          </ol>
        </div>
      ))}
    </>
  );
}
