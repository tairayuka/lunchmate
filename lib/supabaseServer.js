// サーバー側（API Routes）専用の Supabase クライアント。
// Service Role Key は絶対にブラウザに露出させないこと（.env.local のみで管理）。
import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
