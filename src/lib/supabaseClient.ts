import { createClient } from '@supabase/supabase-js';

// Variables côté serveur (pour les API routes)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client admin unique (plus de permissions = plus de flexibilité)
// Utilisé dans toutes les API routes avec permissions élevées
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});
