-- Lunch Mate DB schema
-- docs/lunch_mate_db_design.md 4章の定義に対応。
-- Supabase の SQL Editor で db/schema.sql → db/functions.sql の順に実行する。

create extension if not exists pgcrypto;

-- =========================================================
-- 1. マスターテーブル
-- =========================================================

create table if not exists nationalities (
  id smallint generated always as identity primary key,
  code char(2) not null unique,
  name varchar(50) not null
);

create table if not exists statuses (
  id smallint generated always as identity primary key,
  code varchar(20) not null unique -- searching / matched / canceled
);

create table if not exists locations (
  id smallint generated always as identity primary key,
  name varchar(100) not null
);

-- =========================================================
-- 2. Users / Matching
-- =========================================================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name varchar(20) not null,
  nationality_id smallint not null references nationalities (id),
  status_id smallint not null references statuses (id),
  searching_started_at timestamptz not null default now()
);

create index if not exists idx_users_status_started
  on users (status_id, searching_started_at);

create table if not exists matching (
  id uuid primary key default gen_random_uuid(),
  match_number char(4) not null unique
    check (match_number ~ '^[A-Z][0-9]{3}$'),
  user1_id uuid not null references users (id),
  user2_id uuid not null references users (id),
  location_id smallint not null references locations (id),
  status_id smallint not null references statuses (id),
  matched_at timestamptz not null default now()
);

create index if not exists idx_matching_user1 on matching (user1_id);
create index if not exists idx_matching_user2 on matching (user2_id);

-- =========================================================
-- 3. マスタ初期データ
-- QQ English（セブ）を想定した留学生の主要国籍。運用しながら追加していく。
-- =========================================================

insert into statuses (code)
values ('searching'), ('matched'), ('canceled')
on conflict (code) do nothing;

insert into nationalities (code, name) values
  ('JP', 'Japan'),
  ('KR', 'Korea'),
  ('TW', 'Taiwan'),
  ('CN', 'China'),
  ('VN', 'Vietnam'),
  ('TH', 'Thailand'),
  ('MN', 'Mongolia'),
  ('ID', 'Indonesia'),
  ('PH', 'Philippines'),
  ('BR', 'Brazil'),
  ('SA', 'Saudi Arabia'),
  ('US', 'USA')
on conflict (code) do nothing;

insert into locations (name) values
  ('市場前のフードコート'),
  ('カフェテリア1階 中央テーブル'),
  ('カフェテリア2階 テラス席'),
  ('中庭のベンチ'),
  ('図書館前のラウンジ')
on conflict do nothing;

-- =========================================================
-- 4. RLS
-- 全アクセスはサーバー側（service_role）経由のみ。service_role は RLS を
-- バイパスするため、ここでは「anon/authenticated からは一切触れない」ことを
-- 保証する目的で RLS を有効化し、ポリシーは追加しない（デフォルト拒否）。
-- =========================================================

alter table nationalities enable row level security;
alter table statuses enable row level security;
alter table locations enable row level security;
alter table users enable row level security;
alter table matching enable row level security;

-- =========================================================
-- 5. service_role への権限付与
-- service_role は RLS をバイパスする（BYPASSRLS）が、これはテーブルへの
-- GRANT自体は免除しないため、明示的に付与しておく必要がある。
-- 今後追加するテーブル/シーケンスにも自動で付与されるようデフォルト権限も設定する。
-- =========================================================

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

alter default privileges in schema public
  grant all on tables to service_role;
alter default privileges in schema public
  grant all on sequences to service_role;
