// POST /api/cancel
// body: { userId: string }
// 「検索をやめる」ボタン、または60秒タイムアウト時にフロントから呼ぶ。
// マッチ済みの場合は相手側もまとめてcanceledにする。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function POST(req) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId は必須です' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { error } = await supabase.rpc('cancel_user', { p_user_id: userId });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'キャンセルに失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
