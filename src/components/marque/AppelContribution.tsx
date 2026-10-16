import Link from 'next/link';

// Appel à contribuer, volontairement discret
export function AppelContribution() {
  return (
    <section className="border border-dashed border-primary/30 rounded-2xl px-6 py-5 text-center" aria-labelledby="contribute-title">
      <h3 id="contribute-title" className="text-base font-medium text-neutral-800 mb-1">
        Une controverse manque ?
      </h3>
      <p className="text-sm text-neutral-600 mb-4">
        Ce site est collaboratif : si une controverse n&apos;apparaît pas, c&apos;est que personne ne l&apos;a encore signalée.
      </p>
      <Link
        href="/signaler"
        className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark hover:text-white transition-colors"
        aria-label="Signaler une nouvelle controverse"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Signaler une controverse
      </Link>
      <p className="text-xs text-neutral-500 mt-3">
        N&apos;hésitez pas à contribuer pour enrichir cette base de données et aider d&apos;autres consommateurs à faire des choix éclairés !
      </p>
    </section>
  );
}
