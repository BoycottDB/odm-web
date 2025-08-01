'use client';

import { useState } from 'react';
import Link from 'next/link';
import PropositionForm from '@/components/forms/PropositionForm';

export default function Proposer() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full">
      {/* Section Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
            🤝 Proposer une nouvelle entrée
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
            Contribuez à l&apos;enrichissement collaboratif de notre base de données
          </p>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Types d'événements à dénoncer</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">⚖️</span>
                    <span className="text-gray-700">Violations des droits humains</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2">🌱</span>
                    <span className="text-gray-700">Dommages environnementaux</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">👥</span>
                    <span className="text-gray-700">Conditions de travail inacceptables</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-600 mr-2">🔬</span>
                    <span className="text-gray-700">Tests sur animaux non nécessaires</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-orange-600 mr-2">💰</span>
                    <span className="text-gray-700">Évasion fiscale et corruption</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 mr-2">📊</span>
                    <span className="text-gray-700">Autres controverses documentées</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  
                <Link href="/about">
                  👉 <strong className="text-blue-600 mb-2hover:text-blue-800 font-medium underline">En savoir plus sur notre mission</strong>
                </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire ou bouton */}
          {showForm ? (
            <PropositionForm />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Prêt à contribuer ?
                </h2>
                
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Signalez un événement controversé lié à une marque pour informer les consommateurs. 
                  Toutes les propositions sont vérifiées et font l&apos;objet d&apos;une 
                  modération transparente avec sources documentées.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-amber-800 font-medium">Important</span>
                  </div>
                  <p className="text-amber-800 text-sm">
                    Vos contributions restent entièrement anonymes. Aucune donnée personnelle n&apos;est stockée.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Commencer ma proposition
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}