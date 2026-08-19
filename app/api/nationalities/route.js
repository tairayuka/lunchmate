export const dynamic = 'force-dynamic';

// GET /api/nationalities
// プロフィール入力画面の国籍セレクトボックス用に、国籍マスタ一覧を返す。
// コード修正・再デプロイなしで選択肢を追加できるようにする、というDB設計書5章の
// 意図を反映するため、フロントにハードコードせずこのAPI経由でDBから取得する。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_URL または SUPABASE_SERVICE_ROLE_KEY が未設定です');
      return NextResponse.json({ error: 'サーバー設定エラー（環境変数未設定）' }, { status: 500 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('nationalities')
      .select('code, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('nationalities取得エラー:', error);
      return NextResponse.json({ error: '国籍一覧の取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ nationalities: data });
  } catch (e) {
    console.error('予期しないエラー:', e);
    return NextResponse.json({ error: 'サーバー内部エラー' }, { status: 500 });
  }
}
