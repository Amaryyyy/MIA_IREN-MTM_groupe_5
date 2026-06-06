import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase non configuré : définissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env"
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
