export const dynamic = 'force-dynamic';

// POST /api/register
// body: { name: string, nationalityCode: string }
// 「今日のランチに参加する」ボタン押下時に呼ぶ。
// schema.sql の register_and_match() をRPC呼び出しし、
// Users行の作成〜即時マッチ判定までをDB側でアトミックに処理する。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function POST(req) {
  try {
    const { name, nationalityCode } = await req.json();

    if (!name || !nationalityCode) {
      return NextResponse.json({ error: 'name と nationalityCode は必須です' }, { status: 400 });
    }

    // 環境変数が未設定/不正だとここで分かるようにする
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
      return NextResponse.json({ error: 'サーバー設定エラー（環境変数未設定）' }, { status: 500 });
    }

    const supabase = supabaseServer();

    // 国籍コード → nationality_id を解決
    const { data: nat, error: natError } = await supabase
      .from('nationalities')
      .select('id')
      .eq('code', nationalityCode)
      .single();

    if (natError || !nat) {
      console.error('nationalities取得エラー:', natError);
      return NextResponse.json({ error: '不正な国籍コード、またはSupabase接続に失敗しました' }, { status: 400 });
    }

    // register_and_match() をRPC実行（登録 + 即時マッチ判定をDB側でアトミックに処理）
    const { data, error } = await supabase
      .rpc('register_and_match', { p_name: name, p_nationality_id: nat.id })
      .single();

    if (error) {
      console.error('register_and_match RPCエラー:', error);
      return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({
      userId: data.user_id,
      status: data.status, // 'matched' | 'searching'
      match: data.status === 'matched' ? {
        matchNumber: data.match_number,
        partnerName: data.partner_name,
        partnerNationality: data.partner_nationality,
        location: data.location_name,
        matchedAt: data.matched_at,
      } : null,
    });
  } catch (e) {
    console.error('予期しないエラー:', e);
    return NextResponse.json({ error: 'サーバー内部エラー' }, { status: 500 });
  }
}
