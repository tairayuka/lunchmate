# Lunch Mate 🍱

**留学先の語学学校で、国籍の違う留学生同士をランチでマッチングするWebアプリ**

🔗 **公開URL**:https://lunchmate-ten.vercel.app

<!-- スクリーンショットを入れる場合は、次の行の画像パスを書き換えて、行頭と行末の記号を消してください -->
<!-- ![Lunch Mateの画面](docs/screenshot.png) -->

---

## 📌 概要
名前と国籍を入力して「Find a Mate」を押すだけで、**今ランチ相手を探している、国籍の違う留学生**と自動でマッチングします。
ログインは不要で、60秒以内に相手が見つかると、集合場所と番号が表示されます。

## 💡 作ったきっかけ
フィリピン・セブ島の語学学校に留学中、留学生から次のような声を聞きました。

> 「国籍の違う人と交流する機会は、学校の外にはたくさんある。でも、校内には出会いの場が少ない」

授業以外の時間は、同じ国籍の人同士で固まりがちです。そこで、**毎日必ずあるランチの時間**を交流のきっかけにできないかと考え、このアプリを作りました。

## 🏆 成果
- 語学学校の**公式アクティビティの1つとして導入**されました
- 約**60名**の留学生が利用しました
- 企画から公開まで、**約1か月半で個人開発**しました

## 🛠 技術構成

| 分類 | 使用技術 |
|---|---|
| フロントエンド | Next.js(React)、JavaScript |
| バックエンド | Next.js API Routes |
| データベース | Supabase(PostgreSQL)、PL/pgSQL |
| デプロイ・定期実行 | Vercel(Vercel Cron) |
| デザイン | Figma |
| 開発支援 | 【使ったAIツール名。例:Google Antigravity、Claude】 |

## 🧩 設計で工夫したこと
- **要件定義から始めた設計**:要件定義書、ER図、フローチャート、ステータス遷移図を作ってから実装しました(`docs/` フォルダ)。
- **技術選定**:Supabase・Firebase・Neon・MongoDB Atlas の4つを比較しました。データ同士が結びつく構造に合うリレーショナルDBで、無料枠でも運用できる Supabase を選びました。
- **同時に押されても二重マッチングしない仕組み**:マッチング処理をデータベースの関数(RPC)にまとめ、サーバー側で一度に処理しています。
- **セキュリティ**:データベースはRLSで外部からのアクセスをすべて拒否し、操作はサーバー経由だけに限定しました。定期削除のAPIは `CRON_SECRET` で保護しています。
- **例外への対応**:60秒のタイムアウト、自分でのキャンセル、相手が来ない場合、ブラウザを閉じられた場合まで想定しました。放置されたデータは定期実行で自動削除します。

## 📈 今後の改善案
- 現在は数秒ごとにサーバーへ確認する方式(ポーリング)です。Supabase のリアルタイム機能に切り替えて、通信量と待ち時間を減らしたいと考えています。
- キャンセル/タイムアウト画面(`/canceled`)は仮のデザインで作っています。Figmaのデザインが決まったら差し替えます。
- 色やフォントを、Figmaのデザインにより正確に合わせます(設定は `lib/theme.js` にまとめてあります)。

---

## 👩‍💻 開発者向け情報

要件定義書 `docs/lunch_mate_requirements.md` と、DB設計書 `docs/lunch_mate_db_design.md` に基づいて実装しています。画面一覧・API一覧・設計判断の詳細は、`docs/` フォルダのドキュメントを参照してください。

### セットアップ手順
1. Supabaseプロジェクトを作成する(https://supabase.com 、東京リージョン推奨)
2. SQL Editorで、次の順に実行する
   - `db/schema.sql`(テーブル定義・マスタ初期データ・RLS)
   - `db/functions.sql`(`register_and_match` / `get_user_status` / `cancel_user` / `cleanup_old_records` の4つのRPC関数)
3. Settings > API から `URL` と `service_role key` を取得する
4. `.env.local.example` を `.env.local` にリネームし、値を埋める(`CRON_SECRET` には、自分で作った任意のランダム文字列を入れる)
5. 依存関係をインストールする
```
   npm install
```
6. ローカルで起動する
```
   npm run dev
```
   http://localhost:3000 にアクセスすると、Welcome画面から一連の画面遷移を確認できます。

### 画面構成

| # | 画面 | ルート |
|---|---|---|
| 1 | Welcome | `/` |
| 2 | プロフィール入力 | `/profile` |
| 3 | ガイドライン同意 | `/guideline` |
| 4 | ホーム/参加表明(「今日のランチに参加する」) | `/home` |
| 5 | 検索中 | `/searching` |
| 6 | マッチング結果 | `/result` |
| 7 | キャンセル/タイムアウト | `/canceled` |

セッション管理は使わず、画面間の入力値(名前・国籍・userId・マッチ結果など)はURLクエリパラメータで受け渡しています(DB設計書5章の設計判断に準拠)。

### API一覧

| メソッド | パス | 用途 |
|---|---|---|
| GET | `/api/nationalities` | 国籍マスタ一覧の取得(プロフィール画面のセレクトボックス用) |
| POST | `/api/register` | 参加登録と即時マッチ判定(ホーム画面の「Find a Mate」を押したとき) |
| GET | `/api/status?userId=xxx` | 検索中画面のポーリング用(60秒のタイムアウトもサーバー側で判定) |
| POST | `/api/cancel` | 手動キャンセル、または60秒タイムアウト時 |
| GET | `/api/cron/cleanup` | 定期削除(`CRON_SECRET` で保護。`vercel.json` のCronから毎日起動) |

### フォルダ構成
```
app/          各画面(page.js)とAPIルート(api/**/route.js)
components/   画面共通のUIパーツ(Header、PrimaryButton、CountdownRing など)
lib/          Supabaseクライアント、デザイントークン、画面文言、クエリパラメータ補助
db/           schema.sql / functions.sql(Supabase の SQL Editor で実行するSQL)
docs/         要件定義書・DB設計書
```

### デプロイ
Vercelにデプロイし、GitHubリポジトリと連携するだけで動きます。`vercel.json` に、`/api/cron/cleanup` を毎日実行する設定を入れています(環境変数 `CRON_SECRET` の設定が必須です)。
