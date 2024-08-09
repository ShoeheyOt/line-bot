import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from './type'

export const supabaseClient = ():Database => createClient<Database>(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)