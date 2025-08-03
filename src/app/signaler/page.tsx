'use client';

import { useState } from 'react';
import Link from 'next/link';
import SignalementForm from '@/components/forms/SignalementForm';

export default function Signaler() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading-hero md:heading-hero font-light text-neutral-900 mb-8 tracking-tight">
            Signaler une controverse
          </h1>
          <p className="heading-sub text-neutral-700 max-w-4xl mx-auto font-light leading-relaxed">
            Contribuez à l&apos;enrichissement collaboratif de notre base de données
          </p>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-info-light rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="heading-main font-bold text-neutral-900 mb-4">🎯 Types de controverses à signaler</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-error mr-2">⚖️</span>
                    <span className="text-neutral-700">Violations des droits humains</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-success mr-2">🌱</span>
                    <span className="text-neutral-700">Dommages environnementaux</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-info mr-2">👥</span>
                    <span className="text-neutral-700">Conditions de travail inacceptables</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2">🔬</span>
                    <span className="text-neutral-700">Tests sur animaux non nécessaires</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2">💰</span>
                    <span className="text-neutral-700">Évasion fiscale et corruption</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-error mr-2">🚫</span>
                    <span className="text-neutral-700">Dirigeants ou actionnaires d&apos;extrême droite</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-neutral-600 mr-2">📊</span>
                    <span className="text-neutral-700">Autres controverses documentées</span>
                  </div>
                </div>
                
                <div className="bg-info-light border border-info rounded-lg p-4">
                  
                <Link href="/about">
                  👉 <strong className="text-info mb-2hover:text-info font-medium underline">En savoir plus sur notre mission</strong>
                </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire ou bouton */}
          {showForm ? (
            <SignalementForm />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="bg-primary-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h2 className="heading-main font-bold text-neutral-900 mb-4">
                  Prêt à contribuer ?
                </h2>
                
                <p className="body-large text-neutral-700 mb-8 leading-relaxed">
                  Signalez une controverse liée à une marque pour informer les consommateurs. 
                  Tous les signalements sont vérifiés et font l&apos;objet d&apos;une 
                  modération transparente avec sources documentées.
                </p>
                
                <div className="bg-primary-light border border-primary rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-primary font-medium">Important</span>
                  </div>
                  <p className="text-primary body-small">
                    Vos contributions restent entièrement anonymes. Aucune donnée personnelle n&apos;est stockée.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary to-primary text-white px-8 py-4 rounded-lg font-semibold body-large hover:from-primary-hover hover:to-primary-hover transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Commencer mon signalement
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}