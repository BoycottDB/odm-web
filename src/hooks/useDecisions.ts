import { useState, useEffect } from 'react';
import { DecisionPublique } from '@/types';

export function useDecisions(limit: number = 5, offset: number = 0) {
  const [decisions, setDecisions] = useState<DecisionPublique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/decisions?limit=${limit}&offset=${offset}`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setDecisions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement des décisions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, [limit, offset]);

  return { decisions, loading, error };
}