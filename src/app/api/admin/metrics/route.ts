/**
 * API Route - Admin Metrics Dashboard
 * Collecte et présente les métriques de monitoring pour l'admin
 */

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  details?: string;
}

interface MetricsResponse {
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

export async function GET(request: NextRequest) {
  try {
    // Vérification token admin
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const metrics = await collectMetrics();
    
    return Response.json(metrics);

  } catch (error) {
    console.error('Metrics API error:', error);
    return Response.json(
      { error: 'Erreur lors de la collecte des métriques' }, 
      { status: 500 }
    );
  }
}

async function collectMetrics(): Promise<MetricsResponse> {
  const checks: HealthCheck[] = [];
  
  // 1. Check odm-api health
  try {
    const apiUrl = process.env.NEXT_PUBLIC_EXTENSION_API_URL;
    if (!apiUrl) {
      checks.push({
        service: 'odm-api',
        status: 'down',
        responseTime: -1,
        lastCheck: new Date().toISOString(),
        details: 'URL API non configurée'
      });
    } else {
      const start = Date.now();
      const response = await fetch(`${apiUrl}/.netlify/functions/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const responseTime = Date.now() - start;
      
      if (response.ok) {
        const healthData = await response.json();
        checks.push({
          service: 'odm-api',
          status: healthData.status === 'OK' ? 'healthy' : 'degraded',
          responseTime,
          lastCheck: new Date().toISOString(),
          details: `Version: ${healthData.version || 'N/A'}, DB: ${healthData.services?.database?.status || 'unknown'}`
        });
      } else {
        checks.push({
          service: 'odm-api',
          status: 'down',
          responseTime,
          lastCheck: new Date().toISOString(),
          details: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    }
  } catch (error) {
    checks.push({
      service: 'odm-api',
      status: 'down',
      responseTime: -1,
      lastCheck: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Erreur réseau'
    });
  }

  // 2. Check Supabase health (direct)
  try {
    const start = Date.now();
    const { count } = await supabaseAdmin
      .from('Marque')
      .select('id', { count: 'exact' })
      .limit(1);
      
    const responseTime = Date.now() - start;
    
    checks.push({
      service: 'supabase',
      status: 'healthy',
      responseTime,
      lastCheck: new Date().toISOString(),
      details: count !== null ? `Test OK, ${count} marques` : 'Test réussi'
    });
  } catch (error) {
    checks.push({
      service: 'supabase',
      status: 'down',
      responseTime: -1,
      lastCheck: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Erreur de connexion BDD'
    });
  }

  // 3. Collecter les statistiques générales (anonymes)
  const stats = {
    brands: 0,
    events: 0,
    beneficiaires: 0,
    propositions: 0
  };

  try {
    // Compter les marques
    const { count: brandsCount } = await supabaseAdmin
      .from('Marque')
      .select('id', { count: 'exact' });
    stats.brands = brandsCount || 0;

    // Compter les événements
    const { count: eventsCount } = await supabaseAdmin
      .from('Evenement')
      .select('id', { count: 'exact' });
    stats.events = eventsCount || 0;

    // Compter les bénéficiaires
    const { count: beneficiairesCount } = await supabaseAdmin
      .from('Beneficiaires')
      .select('id', { count: 'exact' });
    stats.beneficiaires = beneficiairesCount || 0;

    // Compter les propositions en attente (modération)
    const { count: propositionsCount } = await supabaseAdmin
      .from('Proposition')
      .select('id', { count: 'exact' })
      .is('decision_id', null); // Propositions sans décision = en attente
    stats.propositions = propositionsCount || 0;

  } catch (error) {
    console.error('Error collecting stats:', error);
  }

  // 4. Test cache odm-api (optionnel)
  let cacheInfo: {
    odmApiStatus: string;
    lastCacheStats?: {
      firstRequest: { time: number; cache: string };
      secondRequest: { time: number; cache: string };
      cacheWorking: boolean;
    };
  } = {
    odmApiStatus: 'unknown'
  };

  try {
    const apiUrl = process.env.NEXT_PUBLIC_EXTENSION_API_URL;
    if (apiUrl) {
      // Faire 2 requêtes rapprochées pour tester le cache
      const start1 = Date.now();
      const response1 = await fetch(`${apiUrl}/.netlify/functions/marques?limit=1`);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      const response2 = await fetch(`${apiUrl}/.netlify/functions/marques?limit=1`);
      const time2 = Date.now() - start2;

      if (response1.ok && response2.ok) {
        const cache1 = response1.headers.get('X-Cache') || 'UNKNOWN';
        const cache2 = response2.headers.get('X-Cache') || 'UNKNOWN';
        
        cacheInfo = {
          odmApiStatus: 'functional',
          lastCacheStats: {
            firstRequest: { time: time1, cache: cache1 },
            secondRequest: { time: time2, cache: cache2 },
            cacheWorking: cache2 === 'HIT' && time2 < time1
          }
        };
      }
    }
  } catch {
    cacheInfo.odmApiStatus = 'error';
  }

  return {
    timestamp: new Date().toISOString(),
    health: checks,
    stats,
    cache: cacheInfo
  };
}