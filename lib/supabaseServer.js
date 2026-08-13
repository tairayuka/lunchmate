// サーバー側（API Routes）専用の Supabase クライアント。
// Service Role Key は絶対にブラウザに露出させないこと（.env.local のみで管理）。
import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false },
      // Next.jsはRoute Handler内のfetchをデフォルトでキャッシュするため、
      // 明示的にno-storeを指定してSupabaseへのリクエストが常に最新状態を
      // 取得するようにする（さもないと同じuserIdへの2回目以降の問い合わせが
      // 古いレスポンスのまま固定されてしまう）。
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  );
}
