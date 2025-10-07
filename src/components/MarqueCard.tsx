import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { slugify } from '@/lib/slug';

interface MarqueCardProps {
  marque: {
    id: number;
    nom: string;
    nbControverses: number;
    nbCondamnations: number;
    categories: Array<{ id: number; nom: string; emoji?: string; couleur?: string }>;
    beneficiairesControverses: Array<{id: number, nom: string}>;
    nbBeneficiairesControverses?: number;
  };
}

export default function MarqueCard({ marque }: MarqueCardProps) {
  const match = marque.nom.match(/^([^(]+)(\(.+\))$/);
  const mainName = match ? match[1].trim() : marque.nom;
  const parentheses = match ? match[2].trim() : null;

  const hasStats = marque.nbControverses > 0 || marque.nbCondamnations > 0;
  const hasBeneficiaires = (marque.beneficiairesControverses?.length || 0) > 0;
  const hasCategories = marque.categories.length > 0;
  const beneficiairesToShow = (marque.beneficiairesControverses || []);
  const totalBeneficiaires = typeof marque.nbBeneficiairesControverses === 'number' ? marque.nbBeneficiairesControverses : beneficiairesToShow.length;
  const overflowBeneficiaires = Math.max(0, totalBeneficiaires - beneficiairesToShow.length);

  const slug = slugify(marque.nom);

  const handleClick = () => {
    // Scroll immédiat vers le haut avant navigation
    window.scrollTo(0, 0);
    // Poser flag pour scroll automatique après navigation
    sessionStorage.setItem('scrollToResults', 'true');
  };

  return (
    <Link href={`/marques/${slug}`} onClick={handleClick} className="block">
      <div className="bg-white border border-primary-medium rounded-3xl p-4 md:p-6 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 md:relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Nom de la marque */}
        <div className="flex-1">
          <h3 className="heading-main font-semibold text-primary md:min-w-100 mb-2 md:mb-0">
            {mainName}
            {parentheses && (
              <span className="heading-sub-brackets font-normal ml-1">{parentheses}</span>
            )}
          </h3>

          {/* Stats - Affichées sous le titre sur mobile uniquement */}
          {hasStats && (
            <div className="flex flex-wrap gap-3 hidden mt-1 min-h-[1.5rem]">
              {/* Controverses - uniquement si > 0 */}
              {marque.nbControverses > 0 && (
                <span className="text-xs font-medium text-neutral-700">
                  {marque.nbControverses} Controverse{marque.nbControverses > 1 ? 's' : ''}
                </span>
              )}

              {/* Condamnations - uniquement si > 0 */}
              {marque.nbCondamnations > 0 && (
                <span className="text-xs font-medium text-neutral-700">
                  {marque.nbCondamnations} Condamnation{marque.nbCondamnations > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats - Affichées à droite sur desktop uniquement */}
        {hasStats && (
          <div className="hidden md:flex md:flex-row justify-end space-x-4">
            {/* Controverses - uniquement si > 0 */}
            {marque.nbControverses > 0 && (
              <div className="body-large font-semibold text-neutral-600 items-center flex">
                {marque.nbControverses} <span className="body-small ml-1">Controverse{marque.nbControverses > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Condamnations - uniquement si > 0 */}
            {marque.nbCondamnations > 0 && (
              <div className="body-large font-semibold text-neutral-600 items-center flex">
                {marque.nbCondamnations} <span className="body-small ml-1">Condamnation{marque.nbCondamnations > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Affichage séparé des bénéficiaires et catégories */}
      {(hasBeneficiaires || hasCategories) && (
        <div className="mb-4 space-y-2">
          {/* Ligne 1: Bénéficiaires controversés */}
          {hasBeneficiaires && (
            <div className="flex flex-wrap md:gap-2 gap-1">
              <span className="text-xs font-medium text-neutral-700 self-center">Derrière cette marque :</span>
              {beneficiairesToShow.map((beneficiaire) => (
                <Badge
                  key={beneficiaire.id}
                  variant="beneficiaire"
                >
                  {beneficiaire.nom}
                </Badge>
              ))}
              {overflowBeneficiaires > 0 && (
                <span className="text-xs font-medium text-neutral-600 self-center">+{overflowBeneficiaires}</span>
              )}
            </div>
          )}

          {/* Ligne 2: Catégories */}
          {hasCategories && (
            <div className="flex flex-wrap md:gap-2 gap-1">
              <span className="text-xs font-medium text-neutral-700 self-center">Types de controverses :</span>
              {marque.categories.map((categorie) => (
                <Badge
                  key={categorie.id}
                  variant="category"
                  category={categorie}
                >
                  {categorie.nom}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-neutral">
        <span className="inline-flex items-center body-base font-medium text-primary hover:text-primary transition-colors duration-200">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          Observer
        </span>
      </div>
    </div>
  </Link>
);
}