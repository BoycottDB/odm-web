'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/auth/admin';
import AdminNavigation from '@/components/admin/AdminNavigation';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  details?: string;
}

interface MetricsData {
  timestamp: string;
  health: HealthCheck[];
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const router = useRouter();

  const fetchMetrics = async () => {
    try {
      setError(null);
      
      if (!adminAuth.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/metrics', {
        headers: {
          'Content-Type': 'application/json',
          ...adminAuth.getAuthHeaders()
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setError(error instanceof Error ? error.message : 'Erreur de réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success bg-success-light border-success';
      case 'degraded': return 'text-warning bg-warning-light border-warning';
      case 'down': return 'text-error bg-error-light border-error';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'down': return '❌';
      default: return '❓';
    }
  };

  const formatResponseTime = (time: number) => {
    if (time < 0) return 'N/A';
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Chargement des métriques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-error-light border border-error text-error px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={fetchMetrics}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminNavigation />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="heading-main font-bold text-neutral-900">
              Monitoring système
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <span className="body-small text-neutral-700">Auto-actualisation</span>
            </label>
            <button
              onClick={fetchMetrics}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover body-small"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {metrics.health.map((check) => (
            <div key={check.service} className={`p-6 rounded-lg border ${getStatusColor(check.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="body-large font-bold capitalize">{check.service}</h3>
                <span className="text-2xl">{getStatusIcon(check.status)}</span>
              </div>
              <div className="space-y-2">
                <p className="body-medium font-medium">
                  {check.status === 'healthy' ? 'Opérationnel' :
                   check.status === 'degraded' ? 'Dégradé' :
                   'Indisponible'}
                </p>
                <p className="body-small">
                  <strong>Temps de réponse:</strong> {formatResponseTime(check.responseTime)}
                </p>
                {check.details && (
                  <p className="body-small">
                    <strong>Détails:</strong> {check.details}
                  </p>
                )}
                <p className="body-xsmall text-neutral-500">
                  Dernière vérification: {new Date(check.lastCheck).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>



        {/* Footer */}
        <div className="text-center body-small text-neutral-500 py-4">
          <p>Dernière mise à jour: {new Date(metrics.timestamp).toLocaleString('fr-FR')}</p>
          <p className="mt-1">Monitoring 100% anonyme</p>
        </div>
      </div>
    </div>
  );
}