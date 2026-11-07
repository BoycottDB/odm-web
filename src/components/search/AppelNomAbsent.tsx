import Link from 'next/link';
import LienQuestion from '@/components/ui/LienQuestion';

interface AppelNomAbsentProps {
  saisie: string;
}

// Recherche sans résultat : le constat et l'invitation à signaler dans un seul bloc,
// pour que le bouton reste visible sans défiler sur mobile
export function AppelNomAbsent({ saisie }: AppelNomAbsentProps) {
  return (
    <section className="border border-dashed border-primary/30 rounded-2xl px-6 py-5 text-center" aria-labelledby="nom-absent-titre">
      <h2 id="nom-absent-titre" className="text-base font-semibold text-neutral-900 mb-2">
        Aucune marque ni aucun bénéficiaire du nom de « {saisie} » n&apos;est répertorié pour le moment
      </h2>
      <p className="text-sm text-neutral-600 mb-4">
        Le site est collaboratif : une marque, son groupe ou une personne qu&apos;elle enrichit n&apos;y entre que quand quelqu&apos;un signale une controverse les concernant. Sans controverse, nous n&apos;affichons pas non plus à qui elle appartient. Si vous en connaissez une, n&apos;hésitez pas à la signaler :
      </p>
      <Link
        href={`/signaler?nom=${encodeURIComponent(saisie)}`}
        className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Signaler une controverse
      </Link>
      <p className="text-xs text-neutral-500 mt-3">
        <LienQuestion page="/faq" ancre="marque-absente" source="recherche_vide" className="underline hover:text-primary">
          Pourquoi ce nom n&apos;est pas sur le site ?
        </LienQuestion>
      </p>
    </section>
  );
}
