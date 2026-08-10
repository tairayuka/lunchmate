# Lunch Mate — バックエンド一式

`schema.sql`（1つ上の階層）と、このフォルダのAPI Routesで、実際にSupabase上で
参加登録〜マッチング〜キャンセルが動くようになります。フロント画面は先に作った
`lunch_mate_prototype.html` の画面デザインをベースに、`fetch()` をこのAPIに
差し替えれば本番相当になります。

## セットアップ手順

1. **Supabaseプロジェクト作成**（https://supabase.com、東京リージョン推奨）
2. SQL Editor で `../schema.sql` の中身を上から実行
   - テーブル・マスターデータ・マッチング関数・RLSポリシーが一括で作成されます
   - Cron削除（7章）はコメントアウトしてあるので、`pg_cron`拡張を有効化してから
     該当部分のコメントを外して実行してください
3. Settings > API から `URL` と `service_role key` を取得
4. `.env.local.example` を `.env.local` にリネームし、値を埋める
5. 依存関係インストール
   ```bash
   npm install
   ```
6. ローカル起動
   ```bash
   npm run dev
   ```
7. 動作確認（例：curlで参加登録）
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"ユウカ","nationalityCode":"JP"}'
   ```
   `status: "searching"` が返れば正常。もう一人、別国籍で同じリクエストを送ると
   `status: "matched"` と `match` オブジェクトが返るはずです。

## API一覧

| メソッド | パス | 用途 |
|---|---|---|
| POST | /api/register | 参加登録＋即時マッチ判定（ガイドライン同意後〜参加ボタン押下） |
| GET  | /api/status?userId=xxx | 検索中画面のポーリング用 |
| POST | /api/cancel | 手動キャンセル／60秒タイムアウト時 |

## フロント画面について

`app/page.js` に、動作確認を優先したシンプルなUIで6画面（Welcome〜結果/キャンセル）を実装済みです。
`/api/register` `/api/status` `/api/cancel` を実際に呼び出すので、Supabaseのセットアップが
完了していれば `npm run dev` だけでブラウザから一通り動作確認できます。
デザイン（`lunch_mate_prototype.html` のビジュアル）を反映する作業はまだ残っています。

## まだやっていないこと（次の一歩）

- デザインの反映（プロトタイプHTMLの見た目を `app/page.js` に移植）
- Vercelへのデプロイ（GitHub連携するだけ）
- pg_cronの有効化（schema.sql 7章のコメントアウトを外す）
- 複数ブラウザ（複数端末）での同時アクセステスト
