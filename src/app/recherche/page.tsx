import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { dataService } from '@/lib/services/dataService';
import { slugify } from '@/lib/slug';
import { Suggestion, construireSuggestions, suggestionExacte, suggestionsProches } from '@/lib/rechercheMarques';
import { SearchHero } from '@/components/search/SearchHero';
import { AppelContribution } from '@/components/marque/AppelContribution';

// Le texte vient de l'URL : on le borne et on ne laisse pas les moteurs l'indexer
const LONGUEUR_MAX = 80;

export const metadata: Metadata = {
  title: "Recherche | Qui j'enrichis ?",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// Marque → sa page ; bénéficiaire → liste des marques filtrée sur lui
const lienSuggestion = (suggestion: Suggestion) =>
  suggestion.type === 'marque'
    ? `/marques/${slugify(suggestion.nom)}`
    : `/marques?beneficiaire=${suggestion.id}`;

export default async function RecherchePage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const saisie = (q ?? '').trim().slice(0, LONGUEUR_MAX);
  if (!saisie) redirect('/marques');

  const [marques, beneficiaires] = await Promise.all([
    dataService.getMarquesNoms(),
    dataService.getBeneficiairesNoms(),
  ]);
  const suggestions = construireSuggestions(marques, beneficiaires);

  const exacte = suggestionExacte(suggestions, saisie);
  if (exacte) redirect(lienSuggestion(exacte));

  const proches = suggestionsProches(suggestions, saisie);

  return (
    <div className="bg-white">
      {/* En-tête identique à la page d'une marque : le texte saisi, puis la recherche */}
      <section className="en-tete-page bg-gradient-hero py-10 md:py-16 px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero text-neutral-900 tracking-tight">
            « {saisie} »
          </h1>
          <div className="max-w-2xl mx-auto mt-8">
            <SearchHero source="recherche" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-3xl mx-4 md:mx-auto space-y-12 md:space-y-16">
          {/* Le constat, puis la piste : les noms proches de la saisie */}
          <div className="text-center space-y-1">
            <p className="text-base font-medium text-neutral-800">
              Aucune marque, entreprise ni personne de ce nom dans notre base pour l&apos;instant.
            </p>
            {proches.length > 0 && (
              <p className="text-base text-neutral-600">
                Peut-être cherchiez-vous{' '}
                {proches.map((proche, index) => (
                  <span key={`${proche.type}-${proche.id}`}>
                    {index > 0 && ' ou '}
                    <Link href={lienSuggestion(proche)} className="font-semibold text-primary underline hover:text-primary-dark">
                      {proche.nom}
                    </Link>
                  </span>
                ))}{' '}?
              </p>
            )}
          </div>

          <AppelContribution />
        </div>
      </section>
    </div>
  );
}
