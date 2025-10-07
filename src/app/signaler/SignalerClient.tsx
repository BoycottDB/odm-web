'use client';

import { useState } from 'react';
import SignalementForm from '@/components/forms/SignalementForm';

export default function SignalerClient() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm ? (
        <SignalementForm />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            <h2 className="heading-main font-bold text-neutral-900 mb-4">
              Prêt à contribuer ?
            </h2>

            <p className="body-large text-neutral-700 mb-8 leading-snug">
              Signalez une controverse liée à une marque pour informer les consommateurs.
              Tous les signalements sont vérifiés et font l&apos;objet d&apos;une
              modération transparente avec sources documentées.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold body-large hover:from-primary-hover hover:to-primary-hover transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Commencer mon signalement
            </button>

            <p className="text-primary body-small mt-4 leading-snug">
              Vos contributions restent entièrement anonymes. Aucune donnée personnelle n&apos;est stockée.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
