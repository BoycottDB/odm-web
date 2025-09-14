'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  stats: {
    brands: number;
    events: number;
    beneficiaires: number;
    propositions: number;
  };
  cache?: {
    odmApiStatus: string;
    lastCacheStats?: {
      firstRequest: { time: number; cache: string };
      secondRequest: { time: number; cache: string };
      cacheWorking: boolean;
    };
  };
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const router = useRouter();

  const fetchMetrics = async () => {
    try {
      setError(null);
      const adminToken = localStorage.getItem('admin_token');
      
      if (!adminToken) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
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
  }, [autoRefresh, fetchMetrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des métriques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Erreur</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMetrics}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Monitoring ODM</h1>
              <p className="text-gray-600 mt-2">Dashboard de surveillance système</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Auto-actualisation</span>
              </label>
              <button
                onClick={fetchMetrics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                🔄 Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.health.map((check) => (
            <div key={check.service} className={`p-6 rounded-lg border ${getStatusColor(check.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg capitalize">{check.service}</h3>
                <span className="text-2xl">{getStatusIcon(check.status)}</span>
              </div>
              <div className="space-y-2">
                <p className="font-medium">
                  {check.status === 'healthy' ? 'Opérationnel' :
                   check.status === 'degraded' ? 'Dégradé' :
                   'Indisponible'}
                </p>
                <p className="text-sm">
                  <strong>Temps de réponse:</strong> {formatResponseTime(check.responseTime)}
                </p>
                {check.details && (
                  <p className="text-sm">
                    <strong>Détails:</strong> {check.details}
                  </p>
                )}
                <p className="text-xs opacity-75">
                  Dernière vérification: {new Date(check.lastCheck).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">Marques</h3>
            <p className="text-3xl font-bold text-blue-600">{metrics.stats.brands.toLocaleString()}</p>
            <p className="text-sm text-blue-700 mt-1">Total référencé</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">Événements</h3>
            <p className="text-3xl font-bold text-purple-600">{metrics.stats.events.toLocaleString()}</p>
            <p className="text-sm text-purple-700 mt-1">Controverses documentées</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">Bénéficiaires</h3>
            <p className="text-3xl font-bold text-green-600">{metrics.stats.beneficiaires.toLocaleString()}</p>
            <p className="text-sm text-green-700 mt-1">Dirigeants/Entités</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2">Modération</h3>
            <p className="text-3xl font-bold text-orange-600">{metrics.stats.propositions.toLocaleString()}</p>
            <p className="text-sm text-orange-700 mt-1">Propositions en attente</p>
          </div>
        </div>

        {/* Cache Performance */}
        {metrics.cache && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Cache ODM-API</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Status Global</h3>
                <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  metrics.cache.odmApiStatus === 'functional' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {metrics.cache.odmApiStatus === 'functional' ? '✅ Fonctionnel' : '❌ Erreur'}
                </p>
              </div>
              
              {metrics.cache.lastCacheStats && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Test Cache Récent</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>1ère requête: {metrics.cache.lastCacheStats.firstRequest.time}ms ({metrics.cache.lastCacheStats.firstRequest.cache})</p>
                    <p>2ème requête: {metrics.cache.lastCacheStats.secondRequest.time}ms ({metrics.cache.lastCacheStats.secondRequest.cache})</p>
                    <p className={`font-medium ${metrics.cache.lastCacheStats.cacheWorking ? 'text-green-600' : 'text-orange-600'}`}>
                      Cache: {metrics.cache.lastCacheStats.cacheWorking ? '✅ Efficace' : '⚠️ À surveiller'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Dernière mise à jour: {new Date(metrics.timestamp).toLocaleString('fr-FR')}</p>
          <p className="mt-1">
            Monitoring 100% anonyme • 
            <a href="/admin" className="text-blue-600 hover:underline ml-1">Retour Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
}