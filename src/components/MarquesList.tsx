import Link from 'next/link';
import { dataService } from '@/lib/services/dataService';
import MarqueCard from '@/components/MarqueCard';

// Server Component pour le chargement des données
export default async function MarquesList() {
  let marques, error;

  try {
    const data = await dataService.getMarquesStats();
    // Déjà trié côté API par ordre alphabétique
    marques = data;
  } catch (err) {
    console.error('Erreur lors du chargement des marques:', err);
    error = 'Erreur lors du chargement des marques';
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="body-base text-error">{error}</p>
      </div>
    );
  }

  if (!marques || marques.length === 0) {
    return (
      <div className="text-center">
        <p className="body-large text-neutral-600">Aucune marque trouvée.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {/* Utilisation du composant MarqueCard memoized */}
      {marques.map((marque) => (
        <MarqueCard key={marque.id} marque={marque} />
      ))}

      {/* Fausse carte d'incitation au signalement */}
      <div className="bg-primary-50/20 border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-800 mb-3">
          Une marque manque ?
        </h3>
        <p className="text-neutral-600 mb-4">
          <strong>Ce répertoire est collaboratif</strong> : si une marque n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
        </p>
        <Link
          href="/signaler"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Signaler une controverse
        </Link>
      </div>
    </div>
  );
}