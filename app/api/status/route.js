// GET /api/status?userId=xxxx
// 検索中画面（/searching）が1.5秒おきなどでポーリングする想定。
import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId は必須です' }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .rpc('get_user_status', { p_user_id: userId })
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: '状態取得に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({
    status: data.status, // 'searching' | 'matched' | 'canceled'
    match: data.status === 'matched' ? {
      matchNumber: data.match_number,
      partnerName: data.partner_name,
      partnerNationality: data.partner_nationality,
      location: data.location_name,
      matchedAt: data.matched_at,
    } : null,
  });
}
