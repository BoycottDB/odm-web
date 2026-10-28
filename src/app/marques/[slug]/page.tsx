import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { dataService } from '@/lib/services/dataService';
import { slugify } from '@/lib/slug';
import { Marque } from '@/types';
import MarquePageClient from './MarquePageClient';
import { nomsDesActeursControverses } from '@/components/marque/chaine';

export const revalidate = 600; // ISR 10 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Produit de la marque cherché par l'adresse (ex. « Knacki » pour /marques/knacki, page d'Herta)
const autreNomDeLAdresse = (marque: Marque, slug: string) =>
  marque.autres_noms?.find((nom) => slugify(nom) === slug);

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marque = await dataService.getMarqueBySlug(slug);

  if (!marque) {
    return {
      title: 'Marque non trouvée'
    };
  }

  const nom = autreNomDeLAdresse(marque, slug) ?? marque.nom;
  const acteurs = nomsDesActeursControverses(marque);
  const title = `Qui j'enrichis en consommant ${nom} ?`;
  const description = acteurs.length > 0
    ? `En consommant ${nom}, j'enrichis ${new Intl.ListFormat('fr', { type: 'conjunction' }).format(acteurs)}. Découvrez pourquoi ça peut poser problème et comment consommer autrement.`
    : `Découvrez qui s'enrichit quand vous consommez ${nom} et comment consommer autrement.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      // Une page d'autre nom reprend celle de sa marque : les moteurs n'indexent que la marque
      canonical: `/marques/${slugify(marque.nom)}`
    }
  };
}

// Generate static params for top brands (partial ISR)
export async function generateStaticParams() {
  try {
    const slugs = await dataService.getMarquesSlugs();
    // Générer les top N marques en statique (fallback: blocking pour les autres)
    return slugs.slice(0, 50).map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Erreur génération slugs:', error);
    return [];
  }
}

export default async function MarquePage({ params }: PageProps) {
  const { slug } = await params;
  const marque = await dataService.getMarqueBySlug(slug);

  if (!marque) {
    notFound();
  }

  // Variante du nom (ex. /marques/total) : même page que la marque, à sa propre adresse
  if (marque.variantes?.some((nom) => slugify(nom) === slug)) {
    permanentRedirect(`/marques/${slugify(marque.nom)}`);
  }

  return <MarquePageClient marque={marque} slug={slug} autreNom={autreNomDeLAdresse(marque, slug)} />;
}
