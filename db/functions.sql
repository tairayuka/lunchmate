-- Lunch Mate RPC functions
-- docs/lunch_mate_db_design.md 6章（マッチング業務ロジック）に対応。
-- db/schema.sql を実行した後にこのファイルを実行する。

-- =========================================================
-- register_and_match
-- ガイドライン同意後、ホーム画面の「今日のランチに参加する」ボタン押下時に呼ぶ。
-- Users行の作成と即時マッチ判定をアトミックに行う。
-- =========================================================
create or replace function register_and_match(
  p_name text,
  p_nationality_id smallint
)
returns table (
  user_id uuid,
  status text,
  match_number text,
  partner_name text,
  partner_nationality text,
  location_name text,
  matched_at timestamptz
)
language plpgsql
as $$
declare
  v_searching_id smallint;
  v_matched_id smallint;
  v_new_user_id uuid;
  v_candidate_id uuid;
  v_candidate_name text;
  v_candidate_nationality text;
  v_location_id smallint;
  v_match_number text;
  v_matched_at timestamptz;
begin
  select id into v_searching_id from statuses where code = 'searching';
  select id into v_matched_id from statuses where code = 'matched';

  insert into users (name, nationality_id, status_id)
  values (p_name, p_nationality_id, v_searching_id)
  returning id into v_new_user_id;

  -- 自分と国籍が異なる、最も古いsearching中の候補を1件検索
  -- （行ロックは行わない簡易方式。docs/lunch_mate_db_design.md 5章の設計判断に準拠）
  select u.id, u.name, n.name
    into v_candidate_id, v_candidate_name, v_candidate_nationality
  from users u
  join nationalities n on n.id = u.nationality_id
  where u.status_id = v_searching_id
    and u.id <> v_new_user_id
    and u.nationality_id <> p_nationality_id
  order by u.searching_started_at asc
  limit 1;

  if v_candidate_id is null then
    return query
      select v_new_user_id, 'searching'::text,
             null::text, null::text, null::text, null::text, null::timestamptz;
    return;
  end if;

  select id into v_location_id from locations order by random() limit 1;

  -- match_number発行（英字1文字＋数字3桁、例：A123）。重複時はリトライ。
  loop
    v_match_number := chr(65 + floor(random() * 26)::int)
                       || lpad(floor(random() * 1000)::text, 3, '0');
    begin
      insert into matching (match_number, user1_id, user2_id, location_id, status_id)
      values (v_match_number, v_new_user_id, v_candidate_id, v_location_id, v_matched_id)
      returning matching.matched_at into v_matched_at;
      exit;
    exception when unique_violation then
      continue;
    end;
  end loop;

  update users set status_id = v_matched_id where id in (v_new_user_id, v_candidate_id);

  return query
    select
      v_new_user_id,
      'matched'::text,
      v_match_number,
      v_candidate_name,
      v_candidate_nationality,
      (select name::text from locations where id = v_location_id),
      v_matched_at;
end;
$$;

-- =========================================================
-- get_user_status
-- 検索中画面のポーリング用。呼び出しのたびに、60秒タイムアウトの
-- 遅延失効チェックも行う（タブを閉じて放置された場合でも、次に誰かが
-- 問い合わせた時点で確実にcanceledへ倒れる）。
-- =========================================================
create or replace function get_user_status(p_user_id uuid)
returns table (
  status text,
  match_number text,
  partner_name text,
  partner_nationality text,
  location_name text,
  matched_at timestamptz
)
language plpgsql
as $$
declare
  v_searching_id smallint;
  v_canceled_id smallint;
  v_matched_id smallint;
  v_status_id smallint;
  v_started_at timestamptz;
begin
  select id into v_searching_id from statuses where code = 'searching';
  select id into v_canceled_id from statuses where code = 'canceled';
  select id into v_matched_id from statuses where code = 'matched';

  select status_id, searching_started_at into v_status_id, v_started_at
  from users where id = p_user_id;

  if v_status_id is null then
    return query
      select 'not_found'::text, null::text, null::text, null::text, null::text, null::timestamptz;
    return;
  end if;

  if v_status_id = v_searching_id and now() - v_started_at > interval '60 seconds' then
    update users set status_id = v_canceled_id where id = p_user_id;
    v_status_id := v_canceled_id;
  end if;

  if v_status_id = v_matched_id then
    return query
      select
        'matched'::text,
        m.match_number::text,
        partner.name::text,
        n.name::text,
        l.name::text,
        m.matched_at
      from matching m
      join users partner
        on partner.id = (case when m.user1_id = p_user_id then m.user2_id else m.user1_id end)
      join nationalities n on n.id = partner.nationality_id
      join locations l on l.id = m.location_id
      where (m.user1_id = p_user_id or m.user2_id = p_user_id)
        and m.status_id = v_matched_id
      order by m.matched_at desc
      limit 1;
    return;
  end if;

  return query
    select
      (select code::text from statuses where id = v_status_id),
      null::text, null::text, null::text, null::text, null::timestamptz;
end;
$$;

-- =========================================================
-- cancel_user
-- 検索中のキャンセルボタン／60秒タイムアウト検知／マッチ後のキャンセルで
-- 共通して使う。マッチ済みだった場合は相手側もまとめてcanceledにする。
-- =========================================================
create or replace function cancel_user(p_user_id uuid)
returns void
language plpgsql
as $$
declare
  v_matched_id smallint;
  v_canceled_id smallint;
  v_partner_id uuid;
begin
  select id into v_matched_id from statuses where code = 'matched';
  select id into v_canceled_id from statuses where code = 'canceled';

  select case when user1_id = p_user_id then user2_id else user1_id end
    into v_partner_id
  from matching
  where (user1_id = p_user_id or user2_id = p_user_id)
    and status_id = v_matched_id
  order by matched_at desc
  limit 1;

  if v_partner_id is not null then
    update matching set status_id = v_canceled_id
    where (user1_id = p_user_id or user2_id = p_user_id)
      and status_id = v_matched_id;

    update users set status_id = v_canceled_id where id in (p_user_id, v_partner_id);
  else
    update users set status_id = v_canceled_id where id = p_user_id;
  end if;
end;
$$;

-- =========================================================
-- cleanup_old_records
-- 7章の定期削除。/api/cron/cleanup から呼び出す想定。
-- =========================================================
create or replace function cleanup_old_records()
returns void
language plpgsql
as $$
begin
  -- Usersに外部キー参照されたままだと削除時にFK違反になるため、
  -- 削除対象ユーザーに紐づくMatchingを先にまとめて削除してからUsersを削除する。
  delete from matching
  where matched_at < now() - interval '1 day'
     or user1_id in (select id from users where searching_started_at < now() - interval '1 day')
     or user2_id in (select id from users where searching_started_at < now() - interval '1 day');

  delete from users where searching_started_at < now() - interval '1 day';
end;
$$;

-- =========================================================
-- service_role への実行権限付与
-- =========================================================
grant execute on function register_and_match(text, smallint) to service_role;
grant execute on function get_user_status(uuid) to service_role;
grant execute on function cancel_user(uuid) to service_role;
grant execute on function cleanup_old_records() to service_role;

alter default privileges in schema public
  grant execute on functions to service_role;
