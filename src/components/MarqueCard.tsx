import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MarqueStats, OrigineEtiquettes } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ListeEtiquettes } from '@/components/marque/ListeEtiquettes';
import { slugify } from '@/lib/slug';

interface MarqueCardProps {
  marque: MarqueStats;
}

// Le libellé dit d'où viennent les étiquettes : celles des bénéficiaires ne sont pas attribuées à la marque
const libelleEtiquettes: Record<OrigineEtiquettes, string> = {
  marque: 'Controverses de la marque :',
  beneficiaires: 'Controverses de ses bénéficiaires :',
  marque_ou_beneficiaires: 'Controverses de la marque ou de ses bénéficiaires :',
};

// Carte d'une marque : habillage des anciennes cartes (ombre, survol), contenu compact
// comme les blocs de la page de marque : bénéficiaires controversés, puis étiquettes
export default function MarqueCard({ marque }: MarqueCardProps) {
  const match = marque.nom.match(/^([^(]+)(\(.+\))$/);
  const mainName = match ? match[1].trim() : marque.nom;
  const parentheses = match ? match[2].trim() : null;

  const beneficiaires = marque.beneficiairesControverses || [];
  const totalBeneficiaires = marque.nbBeneficiairesControverses ?? beneficiaires.length;
  const overflowBeneficiaires = Math.max(0, totalBeneficiaires - beneficiaires.length);

  return (
    <Link
      href={`/marques/${slugify(marque.nom)}`}
      className="block bg-white border border-primary-medium rounded-3xl px-4 py-3 md:px-6 md:py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="heading-main text-primary">
            {mainName}
            {parentheses && <span className="heading-sub-brackets font-normal ml-1">{parentheses}</span>}
          </h3>

          {beneficiaires.length > 0 && (
            <div className="flex flex-wrap md:gap-2 gap-1 mt-2">
              <span className="text-xs font-medium text-neutral-700 self-center">Derrière cette marque :</span>
              {beneficiaires.map((beneficiaire) => (
                <Badge key={beneficiaire.id} variant="beneficiaire">
                  {beneficiaire.nom}
                </Badge>
              ))}
              {overflowBeneficiaires > 0 && (
                <span className="text-xs font-medium text-neutral-600 self-center">+{overflowBeneficiaires}</span>
              )}
            </div>
          )}

          {marque.origineEtiquettes && (
            <ListeEtiquettes
              etiquettes={marque.etiquettes}
              libelle={libelleEtiquettes[marque.origineEtiquettes]}
              className="mt-2"
            />
          )}
        </div>
        <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 ml-2" aria-hidden="true" />
      </div>
    </Link>
  );
}
