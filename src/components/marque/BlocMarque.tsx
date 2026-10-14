import { ShoppingBag } from 'lucide-react';
import { Marque } from '@/types';
import { BlocActeur } from './BlocActeur';
import { ControversesDocumentees } from './ControversesDocumentees';
import { calculerEtiquettes } from './etiquettes';

interface BlocMarqueProps {
  marque: Marque;
  ouvert: boolean;
  onToggle: () => void;
}

// Affiché seulement si la marque a ses propres controverses
export function BlocMarque({ marque, ouvert, onToggle }: BlocMarqueProps) {
  const evenements = marque.evenements || [];

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
      <ControversesDocumentees controverses={evenements} sourceType="evenement" marqueId={marque.id} />
    </BlocActeur>
  );
}
