import MarquesListClient from '@/components/MarquesListClient';
import { dataService } from '@/lib/services/dataService';

// Utilisation d'ISR pour le cache et performance (aligné API)
export const revalidate = 600; // 10 minutes

async function getMarques() {
  try {
    // Appel direct dataService (évite hop inutile + pas de dépendance NEXT_PUBLIC_BASE_URL)
    const marquesStats = await dataService.getMarquesStats();

    // Transformation au format attendu par les filtres
    return marquesStats.map(marque => ({
      id: marque.id,
      nom: marque.nom,
      secteur: marque.secteur,
      updated_at: undefined,
      nbControverses: marque.nbControverses,
      nbCondamnations: marque.nbCondamnations,
      categories: marque.categories,
      beneficiairesControverses: marque.beneficiairesControverses,
      nbBeneficiairesControverses: marque.nbBeneficiairesControverses || marque.beneficiairesControverses.length
    }));
  } catch (error) {
    console.error('Erreur chargement marques:', error);
    return [];
  }
}

export default async function MarquesPage() {
  const marques = await getMarques();

  return (
    <div className="min-h-screen bg-white">
      {/* Section Hero */}
      <section className="bg-gradient-hero py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Toutes les marques référencées
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-snug">
            Découvrez l&apos;ensemble des marques documentées dans notre base de données collaborative.
          </p>
        </div>
      </section>

      {/* Section Liste des marques avec filtres */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <MarquesListClient initialMarques={marques} />
        </div>
      </section>
    </div>
  );
}