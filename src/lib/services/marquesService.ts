import { supabase } from '../supabaseClient';

export async function getMarques() {
  const { data, error } = await supabase.from('Marque').select('*');
  if (error) throw error;
  return data;
}
