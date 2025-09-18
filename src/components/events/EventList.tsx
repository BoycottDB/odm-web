import { Evenement, Marque } from '@/types';
import { EventCard } from './EventCard';
import ChaineBeneficiaires from './ChaineBeneficiaires';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import BoycottTipsSection from '@/components/ui/BoycottTipsSection';
import { ShareButton } from '@/components/ui/ShareButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAddToHomeScreen } from '@/hooks/useAddToHomeScreen';

interface EventListProps {
  events: Evenement[];
  marque: Marque | null;
  loading: boolean;
  searching: boolean;
  notFound: boolean;
  hasSearched: boolean;
}

export function EventList({ events, marque, loading, searching, notFound, hasSearched }: EventListProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  // Récupérer la valeur brute encodée depuis l'URL
  const rawSearchQuery = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('q') || '' : 
    searchQuery;
  const { canInstall } = useAddToHomeScreen();
  // État de chargement initial
  if (loading && !hasSearched) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="body-large font-light text-neutral-600">Chargement des données...</p>
      </div>
    );
  }

  // État de recherche en cours
  if (searching) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="body-large font-light text-neutral-600">Recherche en cours...</p>
      </div>
    );
  }

  // Aucun résultat trouvé
  if (notFound && hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center" aria-hidden="true">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="heading-sub font-medium text-neutral-900 mb-2">Une marque controversée manque ?</h3>
        <p className="body-large font-light text-neutral-600 mb-6">
          <strong>Ce répertoire est collaboratif</strong> : si une marque n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
        </p>
        <Link
          href="/signaler"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
          aria-label="Signaler une nouvelle controverse"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Signaler une controverse
        </Link>
      </div>
    );
  }

  // Pas encore de recherche effectuée ET pas de données à afficher
  if (!hasSearched && events.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center" aria-hidden="true">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="heading-sub font-medium text-neutral-900 mb-2">Commencez votre recherche</h3>
        <p className="body-large font-light text-neutral-600">
          Tapez le nom d&apos;une marque pour découvrir les controverses associées.
        </p>
      </div>
    );
  }

  // Affichage des résultats
  const hasEvents = events.length > 0;
  // Considérer comme résultats de recherche si une recherche a été effectuée (même sans résultats)
  const isSearchResults = hasSearched;

  // Vérifier s'il y a des bénéficiaires dans la chaîne
  const hasBeneficiaires = (marque?.total_beneficiaires_chaine ?? 0) > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-16">

      {/* Statistiques */}
      {isSearchResults && (
        <section aria-label="Statistiques des résultats de recherche">
          <p className="body-base text-center">
            {hasBeneficiaires && <strong>{marque?.total_beneficiaires_chaine} bénéficiaire{(marque?.total_beneficiaires_chaine ?? 0) > 1 ? 's' : ''} controversé{(marque?.total_beneficiaires_chaine ?? 0) > 1 ? 's' : ''}</strong>}{hasBeneficiaires && hasEvents && ' et '}{hasEvents && <strong>{events.length} controverse{events.length > 1 ? 's' : ''}</strong>} ont été signalés pour <strong>{searchQuery}</strong>.
          </p>
        </section>
      )}

      {/* Section Boycott Tips - seulement pour les résultats de recherche avec marque spécifique */}
      {isSearchResults && marque && (
        <div className="max-w-4xl mx-auto">
          <BoycottTipsSection marque={marque} />
        </div>
      )}

      {isSearchResults || (
        <>
          <h2 className="heading-main font-light text-neutral-900 mb-2 text-center">
            Derniers signalements
          </h2>
          <p className="body-small text-neutral-600 text-center mb-12">
            Consultez les controverses récemment ajoutées à notre base de données collaborative.
          </p>
        </>
      )}

      {/* Bouton flottant desktop & mobile avec adaptation selon le banner PWA */}
      {isSearchResults && searchQuery && (
        <div className={`fixed right-6 z-50 md:bottom-24 md:right-24 ${canInstall ? 'bottom-16' : 'bottom-6'}`}>
          <ShareButton
            url={`/recherche?q=${encodeURIComponent(rawSearchQuery)}`}
            title={`Controverses de ${searchQuery} - Répertoire des marques`}
            text={`Découvrez les controverses documentées de ${searchQuery} sur notre répertoire collaboratif.`}
            variant="primary"
            size="lg"
            className="shadow-xl rounded-full px-4 py-4 hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Chaîne de bénéficiaires (seulement lors de recherche avec marque ET si il y a des bénéficiaires) */}
      {isSearchResults && marque && hasBeneficiaires && (
        <section aria-labelledby="beneficiaires-title">
          <h3 id="beneficiaires-title" className="heading-main font-medium text-neutral-900 mb-6 text-center">
            À qui profitent vos achats ?
          </h3>
          {/* <p className="body-small text-neutral-600 text-center mb-6">
            Découvrez les dirigeants et entités controversés qui bénéficient de vos achats
          </p> */}
          <ChaineBeneficiaires
            marqueId={marque.id}
            marqueNom={marque.nom}
            chaine={marque.chaine_beneficiaires || []}
          />
        </section>
      )}

      {/* Événements */}
      {hasEvents && (
        <section aria-labelledby="controverses-title">
          {isSearchResults && (
            <>
              <h3 id="controverses-title" className="heading-main font-medium text-neutral-900 mb-6 text-center">
                Controverses signalées
              </h3>
              {/* <p className="body-small text-neutral-600 text-center mb-6">
                Liste des controverses documentées et sourcées
              </p> */}
            </>
          )}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
            {events.map((event) => (
              <EventCard key={event.id} event={event} marque={marque} />
            ))}
          </div>
        </section>
      )}
            
      {/* Fausse controverse d'incitation */}
      <section className="bg-white border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center" aria-labelledby="contribute-title">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center" aria-hidden="true">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 id="contribute-title" className="text-lg font-medium text-neutral-800 mb-3">
          Une controverse manque ?
        </h3>
        <p className="text-neutral-600 mb-4">
          <strong>Ce répertoire est collaboratif</strong> : si une controverse n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée. <br />N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
        </p>
        <Link
          href="/signaler"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
          aria-label="Signaler une nouvelle controverse"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Signaler une controverse
        </Link>
      </section>
    </div>
  );
}
