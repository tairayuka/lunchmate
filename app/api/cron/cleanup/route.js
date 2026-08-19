export const dynamic = 'force-dynamic';

// GET /api/cron/cleanup
// docs/lunch_mate_db_design.md 7章の定期削除用エンドポイント。
// Vercel CronはGETリクエストで呼び出し、CRON_SECRET環境変数を設定していれば
// `Authorization: Bearer <CRON_SECRET>` ヘッダーを自動付与してくれるため、
// それを検証することで第三者からの誤呼び出しを防ぐ。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const expected = process.env.CRON_SECRET;

    if (!expected) {
      console.error('CRON_SECRET が未設定です');
      return NextResponse.json({ error: 'サーバー設定エラー（CRON_SECRET未設定）' }, { status: 500 });
    }
    if (authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
      return NextResponse.json({ error: 'サーバー設定エラー（環境変数未設定）' }, { status: 500 });
    }

    const supabase = supabaseServer();
    const { error } = await supabase.rpc('cleanup_old_records');

    if (error) {
      console.error('cleanup_old_records RPCエラー:', error);
      return NextResponse.json({ error: '削除処理に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('予期しないエラー:', e);
    return NextResponse.json({ error: 'サーバー内部エラー' }, { status: 500 });
  }
}
