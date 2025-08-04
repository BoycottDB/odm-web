'use client';

import { useState, useEffect, useMemo } from 'react';
import { apiService } from '@/lib/services/api';
import { validateHoneypot, validateSubmissionTime } from '@/lib/security/honeypot';
import Captcha from '@/components/ui/Captcha';
import HoneypotField from '@/components/ui/HoneypotField';
import SimilarItems from './SimilarItems';
import { Marque, Evenement, Proposition, SimilarityScore } from '@/types';

interface SimilarResults {
  marques: Array<Marque & { score: SimilarityScore }>;
  evenements: Array<Evenement & { score: SimilarityScore }>;
  propositions: Array<Proposition & { score: SimilarityScore }>;
}


export default function SignalementForm() {
  // Plus de choix de type - seules les controverses sont autorisées
  const type = 'evenement' as const;
  const [formData, setFormData] = useState({
    // Evenement fields seulement
    marque_nom: '',
    marque_id: undefined as number | undefined,
    description: '',
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    source_url: ''
  });

  // State management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  
  // Security
  const [honeypotValue, setHoneypotValue] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  // Duplicate detection
  const [similarResults, setSimilarResults] = useState<SimilarResults | null>(null);
  const [showSimilar, setShowSimilar] = useState(false);
  const [marquesSuggestions, setMarquesSuggestions] = useState<Marque[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);



  // Recherche de marques pour auto-complétion
  useEffect(() => {
    if (type === 'evenement' && formData.marque_nom.length > 1) {
      const searchMarques = async () => {
        try {
          const suggestions = await apiService.searchMarques(formData.marque_nom);
          setMarquesSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        } catch (error) {
          console.error('Erreur lors de la recherche de marques:', error);
        }
      };

      const timeoutId = setTimeout(searchMarques, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.marque_nom, type]);

  // Recherche de doublons  
  useEffect(() => {
    if (formData.marque_nom.length > 2) {
      checkForSimilar();
    } else {
      setShowSimilar(false);
    }
  }, [formData.marque_nom, formData.description, formData.date, formData.source_url]);

  const checkForSimilar = async () => {
    try {
      const query = {
        type,
        marque_nom: formData.marque_nom,
        description: formData.description.length > 0 ? formData.description : undefined,
        date: formData.date ? formData.date : undefined,
        source_url: formData.source_url.length > 0 ? formData.source_url : undefined
      };

      const results = await apiService.searchSimilaire(query);
      if (results.marques.length > 0 || results.evenements.length > 0 || results.propositions.length > 0) {
        setSimilarResults(results);
        setShowSimilar(true);
      } else {
        setShowSimilar(false);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de doublons:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors([]);
    
    // Validations de sécurité
    if (!validateHoneypot(honeypotValue)) {
      setErrors(['Détection de bot. Veuillez réessayer.']);
      return;
    }
    
    if (!validateSubmissionTime(startTime)) {
      setErrors(['Soumission trop rapide. Veuillez attendre quelques secondes.']);
      return;
    }
    
    if (!captchaVerified) {
      setErrors(['Veuillez compléter la vérification anti-robot.']);
      return;
    }

    setIsSubmitting(true);

    try {
      const propositionData = {
        marque_nom: formData.marque_nom,
        description: formData.description,
        date: formData.date,
        source_url: formData.source_url
      };

      await apiService.createProposition(propositionData);
      setIsSuccess(true);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { details?: string[] } } };
        if (responseError.response?.data?.details) {
          setErrors(responseError.response.data.details);
        } else {
          setErrors(['Une erreur est survenue lors de la soumission.']);
        }
      } else {
        setErrors(['Une erreur est survenue lors de la soumission.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pool de messages de remerciement rotatifs
  const successMessages = useMemo(() => [
    {
      title: "Merci pour votre engagement !",
      message: "Votre signalement contribue à une consommation plus éthique et transparente."
    },
    {
      title: "Votre contribution compte !",
      message: "Grâce à votre engagement, nous construisons ensemble un répertoire plus complet."
    },
    {
      title: "Merci de faire la différence !",
      message: "Votre contribution renforce la transparence sur les pratiques des entreprises."
    },
    {
      title: "🏴‍☠️ Bienvenue dans l&apos;équipage !",
      message: "Avec ce geste, vous venez de rejoindre la flotte de la consommation éthique. Ensemble, naviguons vers des mers plus propres !"
    }
  ], []);

  // Sélection aléatoire d'un message à chaque soumission
  const randomMessage = useMemo(() => {
    return successMessages[Math.floor(Math.random() * successMessages.length)];
  }, [isSuccess, successMessages]);

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral p-8 text-center">
        <div className="relative">
          {/* Animation confettis */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Confettis animés */}
            <div className="absolute w-2 h-2 bg-yellow-400 rounded animate-bounce" style={{top: '10%', left: '20%', animationDelay: '0s', animationDuration: '2s'}}></div>
            <div className="absolute w-2 h-2 bg-blue-400 rounded animate-bounce" style={{top: '30%', left: '80%', animationDelay: '0.2s', animationDuration: '2.5s'}}></div>
            <div className="absolute w-2 h-2 bg-red-400 rounded animate-bounce" style={{top: '50%', left: '10%', animationDelay: '0.4s', animationDuration: '1.8s'}}></div>
            <div className="absolute w-2 h-2 bg-green-400 rounded animate-bounce" style={{top: '20%', left: '70%', animationDelay: '0.6s', animationDuration: '2.2s'}}></div>
            <div className="absolute w-2 h-2 bg-purple-400 rounded animate-bounce" style={{top: '40%', left: '90%', animationDelay: '0.8s', animationDuration: '1.9s'}}></div>
            <div className="absolute w-2 h-2 bg-pink-400 rounded animate-bounce" style={{top: '60%', left: '30%', animationDelay: '1s', animationDuration: '2.1s'}}></div>
            <div className="absolute w-2 h-2 bg-orange-400 rounded animate-bounce" style={{top: '80%', left: '60%', animationDelay: '1.2s', animationDuration: '2.3s'}}></div>
            <div className="absolute w-2 h-2 bg-teal-400 rounded animate-bounce" style={{top: '70%', left: '15%', animationDelay: '1.4s', animationDuration: '2s'}}></div>
          </div>
          
          {/* Animation de célébration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-ping absolute w-20 h-20 bg-success-light rounded-full opacity-75"></div>
            <div className="animate-pulse absolute w-24 h-24 bg-success-light rounded-full opacity-50"></div>
          </div>
          
          <div className="relative bg-success-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-8 h-8 text-success animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="heading-main font-bold text-neutral-900 mb-4">
          {randomMessage.title}
        </h2>
        
        <p className="body-large text-neutral-700 mb-8">
          {randomMessage.message}
        </p>
        
        <div className="bg-info-light border border-info rounded-lg p-4 mb-6">
          <p className="text-info body-small">
            <strong>Rappel :</strong> Toutes les décisions de modération sont rendues publiques 
            de manière transparente sur notre page dédiée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Signaler une autre marque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral p-8">
      <h2 className="heading-main font-bold text-neutral-900 mb-6">Nouvelle proposition</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <HoneypotField onChange={setHoneypotValue} />
        
        {/* Information sur le type */}
        <div className="bg-info-light border border-info rounded-lg p-4">
          <h3 className="body-small font-medium text-info mb-2">
            📢 Signaler une controverse
          </h3>
          <p className="body-small text-info">
            Vous pouvez signaler une controverse liée à une marque pour informer les consommateurs.
          </p>
        </div>

        {/* Champs pour la controverse */}
            {/* Marque pour controverse */}
            <div className="relative">
              <label className="block body-small font-medium text-neutral-700 mb-2">
                Marque concernée *
              </label>
              <input
                type="text"
                value={formData.marque_nom}
                onChange={(e) => setFormData({ ...formData, marque_nom: e.target.value, marque_id: undefined })}
                className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tapez le nom de la marque..."
                required
              />
              
              {/* Suggestions */}
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-neutral rounded-lg shadow-lg">
                  {marquesSuggestions.map((marque) => (
                    <button
                      key={marque.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, marque_nom: marque.nom, marque_id: marque.id });
                        setShowSuggestions(false);
                        setMarquesSuggestions([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral first:rounded-t-lg last:rounded-b-lg"
                    >
                      {marque.nom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block body-small font-medium text-neutral-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                max={new Date().toISOString().split('T')[0]} // Empêche les dates futures
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <p className="body-small text-neutral-500 mt-1">
                Date de la controverse (ne peut pas être dans le futur)
              </p>
            </div>


            {/* URL source (obligatoire) */}
            <div>
              <label className="block body-small font-medium text-neutral-700 mb-2">
                URL de la source *
              </label>
              <input
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.mediapart.fr/article-exemple"
                required
              />
              <p className="mt-1 body-small text-neutral-500">
                URL d&apos;un article ou d&apos;une source fiable documentant la controverse
              </p>
            </div>

        {/* Message aux modérateurs */}
        <div>
          <label className="block body-small font-medium text-neutral-700 mb-2">
            Message aux modérateurs *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Expliquez pourquoi vous signalez cette marque, les pratiques concernées, les sources d'information..."
            required
            maxLength={1000}
            minLength={10}
          />
          <p className="body-small text-neutral-500 mt-1">
            Minimum 10 caractères, maximum 1000 caractères
          </p>
        </div>

        {/* Éléments similaires */}
        {showSimilar && similarResults && (
          <SimilarItems results={similarResults} />
        )}

        {/* Captcha */}
        <Captcha onVerify={setCaptchaVerified} />

        {/* Erreurs */}
        {errors.length > 0 && (
          <div className="bg-error-light border border-error rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-error mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-error font-medium">Erreurs détectées :</span>
            </div>
            <ul className="list-disc list-inside text-error body-small">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Boutons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !captchaVerified}
            className="bg-gradient-to-r from-primary to-primary text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-hover hover:to-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Proposer'}
          </button>
          
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-neutral-100 text-neutral-700 px-6 py-3 rounded-lg font-semibold hover:bg-neutral transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}