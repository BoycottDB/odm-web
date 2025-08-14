import { supabaseAdmin } from '../supabaseClient';

export async function getMarques() {
  const { data, error } = await supabaseAdmin.from('Marque').select('*');
  if (error) throw error;
  return data;
}
