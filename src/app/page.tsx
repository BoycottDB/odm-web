import type { Metadata } from 'next';
import Accueil from '@/components/accueil/Accueil';

const description = "Découvrez qui s'enrichit quand vous achetez une marque vendue en France, ses controverses sourcées et des conseils pour acheter autrement.";

export const metadata: Metadata = {
  title: "Qui j'enrichis ?",
  description,
  openGraph: {
    title: "Qui j'enrichis ?",
    description,
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Qui j'enrichis ?",
    description,
  },
};

export default function Page() {
  return <Accueil />;
}
