import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// تشخيص: التأكد من وصول القيم أثناء البناء (وهي تُدمج في الحزمة anyway)
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ موجود' : '❌ مفقود');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Check .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);