import { ShoppingBag } from 'lucide-react';
import { Marque } from '@/types';
import { MarquesBadges } from '@/components/ui/MarquesBadges';
import { BlocActeur } from './BlocActeur';
import { ControversesDocumentees } from './ControversesDocumentees';
import { calculerEtiquettes } from './etiquettes';

interface BlocMarqueProps {
  marque: Marque;
  // Autre nom par lequel on arrive (ex. « Knacki ») : déjà en tête du trajet, pas répété dans la liste
  autreNom?: string;
  ouvert: boolean;
  onToggle: () => void;
}

// Affiché si la marque a ses propres controverses ou d'autres noms
export function BlocMarque({ marque, autreNom, ouvert, onToggle }: BlocMarqueProps) {
  const evenements = marque.evenements || [];
  const produits = (marque.autres_noms || [])
    .filter((nom) => nom !== autreNom)
    .map((nom) => ({ id: marque.id, nom }));

  return (
    <BlocActeur
      id="marque"
      icone={<ShoppingBag className="w-8 h-8" />}
      nom={marque.nom}
      sousTitre="La marque"
      etiquettes={calculerEtiquettes(evenements)}
      ouvert={ouvert}
      onToggle={onToggle}
    >
      {evenements.length > 0 && (
        <ControversesDocumentees controverses={evenements} sourceType="evenement" marqueNom={marque.nom} blocNom={marque.nom} />
      )}

      {/* Produits vendus sous la marque (ses autres noms), comme les autres marques d'un bénéficiaire */}
      {produits.length > 0 && (
        <div className={evenements.length > 0 ? 'mt-6 pt-4 border-t border-primary' : ''}>
          <div className="font-semibold text-black text-xs mb-3">
            {autreNom ? 'Autres produits' : 'Produits'} vendus sous la marque {marque.nom} ({produits.length}) :
          </div>
          <MarquesBadges marques={produits} />
        </div>
      )}
    </BlocActeur>
  );
}
