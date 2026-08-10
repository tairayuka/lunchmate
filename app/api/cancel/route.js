// POST /api/cancel
// body: { userId: string }
// 「検索をやめる」ボタン、または60秒タイムアウト時にフロントから呼ぶ。
// マッチ済みの場合は相手側もまとめてcanceledにする。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId は必須です' }, { status: 400 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
      return NextResponse.json({ error: 'サーバー設定エラー（環境変数未設定）' }, { status: 500 });
    }

    const supabase = supabaseServer();
    const { error } = await supabase.rpc('cancel_user', { p_user_id: userId });

    if (error) {
      console.error('cancel_user RPCエラー:', error);
      return NextResponse.json({ error: 'キャンセルに失敗しました', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('予期しないエラー:', e);
    return NextResponse.json({ error: 'サーバー内部エラー', detail: String(e?.message || e) }, { status: 500 });
  }
}
