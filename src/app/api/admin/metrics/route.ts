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

  return {
    timestamp: new Date().toISOString(),
    health: checks
  };
}