'use client';

import { useState, useEffect } from 'react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

export default function Captcha({ onVerify, className = '' }: CaptchaProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Générer une question mathématique simple
  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let result: number;
    let questionText: string;
    
    if (operation === '+') {
      result = num1 + num2;
      questionText = `${num1} + ${num2}`;
    } else {
      // Pour la soustraction, s'assurer que le résultat est positif
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      result = larger - smaller;
      questionText = `${larger} - ${smaller}`;
    }
    
    setQuestion(questionText);
    setAnswer(result.toString());
    setUserAnswer('');
    setIsVerified(false);
    setError('');
  };

  const handleVerification = (value: string) => {
    setUserAnswer(value);
    
    if (value === answer) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else if (value !== '') {
      setIsVerified(false);
      setError('Réponse incorrecte');
      onVerify(false);
    } else {
      setIsVerified(false);
      setError('');
      onVerify(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Vérification anti-robot
      </label>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
          <span className="text-lg font-mono">{question} =</span>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => handleVerification(e.target.value)}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-berry-500"
            placeholder="?"
            aria-label="Réponse au calcul"
          />
        </div>
        
        <button
          type="button"
          onClick={generateQuestion}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
          aria-label="Générer une nouvelle question"
        >
          🔄
        </button>
        
        {isVerified && (
          <span className="text-green-600 text-sm flex items-center">
            ✅ Vérifié
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}