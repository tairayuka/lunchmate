# Lunch Mate

ランチタイム限定で、異なる国籍のユーザーをマッチングするアプリ。
`docs/lunch_mate_requirements.md`（要件定義書）・`docs/lunch_mate_db_design.md`（DB設計書）
に基づいて実装している。詳細な画面一覧・API一覧・設計判断は
`docs/`直下のドキュメントおよびリポジトリ作成時にレビューした実装計画を参照。

## セットアップ手順

1. **Supabaseプロジェクト作成**（https://supabase.com、東京リージョン推奨）
2. SQL Editorで以下を順に実行
   - `db/schema.sql`（テーブル定義・マスタ初期データ・RLS）
   - `db/functions.sql`（`register_and_match` / `get_user_status` / `cancel_user` /
     `cleanup_old_records`の4RPC関数）
3. Settings > API から `URL` と `service_role key` を取得
4. `.env.local.example` を `.env.local` にリネームし、値を埋める（`CRON_SECRET`は任意の
   ランダム文字列を自分で生成する）
5. 依存関係インストール
   ```bash
   npm install
   ```
6. ローカル起動
   ```bash
   npm run dev
   ```
   `http://localhost:3000` にアクセスすると Welcome画面 から一連の画面遷移を確認できる。

## 画面構成

| # | 画面 | ルート |
|---|---|---|
| 1 | Welcome | `/` |
| 2 | プロフィール入力 | `/profile` |
| 3 | ガイドライン同意 | `/guideline` |
| 4 | ホーム/参加表明（「今日のランチに参加する」） | `/home` |
| 5 | 検索中 | `/searching` |
| 6 | マッチング結果 | `/result` |
| 7 | キャンセル/タイムアウト | `/canceled` |

セッション管理は使用せず、画面間の入力値（名前・国籍・userId・マッチ結果など）は
URLクエリパラメータで持ち回る（DB設計書5章の設計判断に準拠）。

## API一覧

| メソッド | パス | 用途 |
|---|---|---|
| GET  | /api/nationalities | 国籍マスタ一覧の取得（プロフィール画面のセレクトボックス用） |
| POST | /api/register | 参加登録＋即時マッチ判定（ホーム画面の「Find a Mate」押下時） |
| GET  | /api/status?userId=xxx | 検索中画面のポーリング用（サーバー側で60秒タイムアウトも判定） |
| POST | /api/cancel | 手動キャンセル／60秒タイムアウト時 |
| GET  | /api/cron/cleanup | 定期削除（`CRON_SECRET`で保護。`vercel.json`のCronから毎時起動） |

## フォルダ構成

```
app/                  各画面（page.js）とAPIルート（api/**/route.js）
components/           画面共通のUIパーツ（Header, PrimaryButton, CountdownRing 等）
lib/                  Supabaseクライアント、デザイントークン、画面文言、クエリパラメータ補助
db/                   schema.sql / functions.sql（Supabase SQL Editorで実行するSQL）
docs/                 要件定義書・DB設計書
```

## デプロイ

Vercelにデプロイし、GitHubリポジトリと連携するだけで動作する。`vercel.json`に
`/api/cron/cleanup`の毎時実行設定を含めている（`CRON_SECRET`環境変数の設定が必須）。

## まだやっていないこと（次の一歩）

- Supabaseプロジェクトを実際に作成し、`db/schema.sql` → `db/functions.sql` を実行して動作確認
- 複数ブラウザ（複数端末）での同時アクセス・マッチング成立のテスト
- Figmaデザインの正確なカラーコード・フォントへの微調整（`lib/theme.js`に集約済み）
- キャンセル/タイムアウト画面（`/canceled`）はFigma未確定のため独自にラフ作成。デザイン確定後に差し替え
