'use client';

import { useEffect, useState } from 'react';

const MORCEAUX_NUMERO = ['06', '72', '43', '58', '15'];

// Clin d'œil à un album : le numéro est masqué aux robots, assemblé seulement après le chargement de la page.
// Sans JavaScript, la phrase n'est pas affichée.
export default function NumeroAlbum() {
  const [numero, setNumero] = useState<string | null>(null);

  useEffect(() => {
    setNumero(MORCEAUX_NUMERO.join(' '));
  }, []);

  if (!numero) return null;

  return (
    <p className="body-base text-neutral-700 leading-snug mt-4">
      Inutile d&apos;essayer de me contacter au {numero} car ce n&apos;est pas mon numéro (mais je vous le recommande).
    </p>
  );
}
