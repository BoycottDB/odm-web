'use client';

import { useEffect, useState } from 'react';
import { CONTACT_EMAIL_UTILISATEUR, CONTACT_EMAIL_DOMAINE } from '@/lib/contact';

// Adresse de contact masquée aux robots : assemblée seulement après le chargement de la page.
// Sans JavaScript, le visiteur voit une version lisible par un humain.
export default function AdresseContact() {
  const [adresse, setAdresse] = useState<string | null>(null);

  useEffect(() => {
    setAdresse(`${CONTACT_EMAIL_UTILISATEUR}@${CONTACT_EMAIL_DOMAINE}`);
  }, []);

  if (!adresse) {
    return <span>{CONTACT_EMAIL_UTILISATEUR} (arobase) {CONTACT_EMAIL_DOMAINE}</span>;
  }

  return (
    <a href={`mailto:${adresse}`} className="text-secondary-dark hover:text-secondary-dark-hover underline">{adresse}</a>
  );
}
