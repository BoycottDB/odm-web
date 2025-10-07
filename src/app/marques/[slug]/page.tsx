import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/services/dataService';
import MarquePageClient from './MarquePageClient';

export const revalidate = 600; // ISR 10 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marque = await dataService.getMarqueBySlug(slug);

  if (!marque) {
    return {
      title: 'Marque non trouvée'
    };
  }

  const nbControverses = marque.evenements?.length || 0;
  const nbBeneficiaires = marque.total_beneficiaires_chaine || 0;

  const description = `Découvrez les controverses et bénéficiaires de ${marque.nom}. ${nbControverses} controverse${nbControverses > 1 ? 's' : ''} documentée${nbControverses > 1 ? 's' : ''}, ${nbBeneficiaires} bénéficiaire${nbBeneficiaires > 1 ? 's' : ''} controversé${nbBeneficiaires > 1 ? 's' : ''}.`;

  return {
    title: `${marque.nom} — Controverses & bénéficiaires | Répertoire`,
    description,
    openGraph: {
      title: `${marque.nom} — Controverses & bénéficiaires`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${marque.nom} — Controverses & bénéficiaires`,
      description,
    },
    alternates: {
      canonical: `/marques/${slug}`
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

  return <MarquePageClient marque={marque} slug={slug} />;
}
