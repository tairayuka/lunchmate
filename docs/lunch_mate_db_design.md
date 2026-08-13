
Lunch Mate データベース設計書 
1. 概要
ランチタイム限定で、異なる国籍のユーザーをマッチングし、一緒にランチをする相手を見つけるアプリ「Lunch Mate」のDB設計書。
2. 要件サマリー
機能要件
プロフィール入力（名前・国籍）
注意喚起（ガイドライン同意）画面
ランチ参加表明機能（「今日のランチに参加する」ボタン）
国籍を判断してのマッチング
マッチング結果・ステータス表示（マッチング番号）
画面構成
Welcome画面（"Hey! Are you ready for match?"）
プロフィール登録・編集画面（名前、国籍のみ）
ガイドライン同意
ホーム / 参加表明画面
検索中
マッチング結果画面


4. テーブル定義
Nationalities（国籍マスターテーブル）
カラム名
型
制約
説明
id
smallint
PK, GENERATED ALWAYS AS IDENTITY
国籍ID
code
char(2)
NOT NULL, UNIQUE
国コード（例：JP）
name
varchar(50)
NOT NULL
表示名（例：Japan）

Statuses（ステータス共通マスターテーブル）※新規
先生FBにより新設。Users・Matching双方で使う「状態」を1箇所で管理し、DB側で選択肢を管理できるようにする。`idle`は廃止し、以下の3つのみで管理する。

カラム名
型
制約
説明
id
smallint
PK, GENERATED ALWAYS AS IDENTITY
ステータスID
code
varchar(20)
NOT NULL, UNIQUE
searching / matched / canceled

Locations（集合場所マスターテーブル）※新規
先生FBにより新設。集合場所を自由入力テキストではなく、マスタ管理に変更。

カラム名
型
制約
説明
id
smallint
PK, GENERATED ALWAYS AS IDENTITY
場所ID
name
varchar(100)
NOT NULL
場所名（例：市場前のフードコート）

Users
「idle（待機）」という状態はDBに保存しない。ユーザーの行は、ガイドライン同意画面のボタンが押された瞬間に初めて作成され、その時点で最初から`status = searching`として登録される（「行が存在しない」こと自体が「まだ参加していない」を意味する）。

カラム名
型
制約
説明
id
uuid
PK, DEFAULT gen_random_uuid()
ユーザーID
name
varchar(20)
NOT NULL
名前
nationality_id
smallint
FK → Nationalities.id, NOT NULL
国籍
status_id
smallint
FK → Statuses.id, NOT NULL
searching / matched / canceled のいずれか。行作成時は必ずsearching
searching_started_at
timestamptz
NOT NULL, DEFAULT `now()`
検索開始時刻＝行の作成時刻そのもの。idleを持たないためNULL許容ではなくNOT NULLに変更

Matching
カラム名
型
制約
説明
id
uuid
PK, DEFAULT gen_random_uuid()
マッチングID（内部管理用）
match_number
char(4)
NOT NULL, UNIQUE, CHECK (match_number ~ '^[A-Z][0-9]{3}$')
表示用の識別番号。アルファベット1文字（A〜Z）＋数字3桁の固定4文字（例：`A123`）
user1_id
uuid
FK → Users.id, NOT NULL
マッチング参加者1
user2_id
uuid
FK → Users.id, NOT NULL
マッチング参加者2
location_id
smallint
FK → Locations.id, NOT NULL
集合場所。Locationsマスタから自動割当
status_id
smallint
FK → Statuses.id, NOT NULL
matched / canceled のいずれか
matched_at
timestamptz
NOT NULL, DEFAULT now()
マッチング成立日時


5. 設計判断とその理由
判断
理由
マッチングは常に2人ペア。中間テーブルは使わない
要件が「常に2人ペアのみ」のため、user1_id/user2_idの2つの外部キーで十分
国籍はマスターテーブル（Nationalities）で管理する
先生FBにより、コード修正・再デプロイなしで選択肢を追加できるようにする
マッチング条件は「国籍が異なること」のみ
「日本人/その他」の二値判定から、「異なる国籍同士なら成立」という条件に変更したため、判定用の追加カラムは不要
ステータスをStatuses共通マスターテーブルで一元管理し、`idle`は廃止する
先生FBにより、Users・Matching双方のstatusをDB側で管理できるようにする。「参加意思がない状態」は行自体を作らないことで表現し、idleというデータを持たせる必要をなくした
集合場所をLocationsマスターテーブルで管理する
先生FBにより、自由入力テキストからマスタ管理に変更。候補地の追加・編集をコード修正なしで行えるようにする
Match Numberをアルファベット1文字＋数字3桁に変更
連番のみだと表現の幅が狭いため、視認性・入力しやすさを考慮した形式に変更。`CHECK`制約でDBレベルの形式違反を防止
ユーザーに見せる識別番号を、id（uuid）とは別にmatch_numberとして持たせる
内部管理用のuuidと表示用の番号を分離し、安全性と表示のしやすさを両立
セッション管理（Auth）は使用せず、URLクエリパラメータで入力内容を保持する
想定利用者が少数（10人程度）のため、認証機構を持たずシンプルに運用する。名前・国籍などの入力値は、Users行が作成される（ガイドライン同意）までクエリパラメータとして画面間を持ち回る。行作成後は、発行された`Users.id`をクエリパラメータとして後続画面に渡すことで、以後のリクエストがどのユーザーかを特定する
二重マッチング対策として、行ロックではなくシンプルな検索方式を採用
登録（検索開始）時に、条件に合う最も古い`searching`中の候補を1件検索し、見つかればその場でマッチさせる。複雑な行ロックは行わず、少人数（10人程度）を想定し二重マッチングのリスクを許容する

6. マッチング業務ロジック
ガイドライン同意画面のボタンが押される → Usersテーブルに新規レコードを作成（status_id = searching、searching_started_at = now()）
登録と同時に、searching中のユーザーの中から、自分とnationality_idが異なる、最も古い（searching_started_atが早い）候補を1件検索する
見つかった場合 → Matchingレコードを作成し（match_number発行、location_id割当）、両ユーザーのstatus_idをmatchedに変更
見つからなかった場合 → `searching`のまま待機。以後、新しい参加者が登録されるたびに手順2の検索対象として拾われる可能性がある
searching_started_atから60秒経過しても相手が見つからない場合 → 自分のstatus_idをcanceledに変更（検索終了）
キャンセル時の状態変化（新規）
シナリオ
トリガー
Users.status_id
Matching.status_id
searching中に自分でキャンセル
ユーザー操作（検索中止ボタン）
→ canceled
（Matching未作成のため対象なし）
60秒経過（見つからなかった）
タイムアウト
→ canceled
（Matching未作成のため対象なし）
マッチ後、集合前後を問わずキャンセル
ユーザー操作
両者 matched → canceled
matched → canceled
タブを閉じる
検知不可（操作なし）
変化なし（searchingのまま放置。後述のCronで一定時間後に削除）
ー
相手が見つからない（新規登録時に候補なし）
システム判定
searchingのまま待機継続（60秒以内は上記タイムアウトへ）
ー

7. 定期実行（Cron）処理
マッチング番号・ユーザーデータを定期的に削除する。

対象
削除条件（案）
Users
searching_started_atから一定時間（1日を想定）経過したレコード
Matching
matched_atから一定時間（1日を想定）経過したレコード


実行間隔は今後調整（まずは1時間ごとを想定）。Supabase Edge Functions / Cron、またはpg_cron拡張の利用を想定。


8. DB候補調査と選定結果
比較した候補（2026年7月時点）
サービス
無料枠の概要
特徴・注意点
Supabase
500MB DB容量、500MB共有RAM、月5万MAU、1GBファイルストレージ、5GB送信帯域、月50万回のEdge Function実行
7日間操作がないとプロジェクトが自動一時停止（手動復旧）
Firebase Firestore
認証は月5万MAU、Firestoreは1GiBストレージ・1日5万回読み取り、Cloud Functionsは月200万回実行
無料枠超過でBlazeプラン（従量課金・上限なし）に切替わる
PostgreSQL（Neon）
永続無料のサーバーレスPostgres、ブランチ機能あり
東京リージョンなし
MongoDB Atlas
M0クラスター：512MBストレージ、最大接続数500、期間無制限の永続無料
GitHub Student Developer Pack経由で$50分のAtlasクレジット＋MongoDB University認定資格（$150相当）が無料

選定結果：Supabase
理由
詳細
DBエンジンがPostgreSQLそのもの
Users・Matchingは外部キーで結ばれた典型的なリレーショナル構造であり、ER図をほぼそのままテーブル定義に落とし込める
ステータス管理・タイムアウト判定のロジックと相性が良い
SQLのWHERE条件で素直に書ける、リレーショナルDBが得意とするクエリ
リアルタイム機能がある
現状は60秒ポーリング方式だが、将来拡張の余地がある
無料枠が今回の規模に対して十分
少人数規模の想定であれば、無料枠で完結できる

9. サーバー・バックエンド選定
選定結果：Next.js（フロント＋API Routes）＋ Supabase（DB）＋ Vercel（デプロイ）
構成要素
選定
理由
フロントエンド
Next.js（React）
Figmaのコンポーネント設計と思想が一致。求人でも需要が高い技術
デプロイ
Vercel
GitHubリポジトリと連携するだけで無料デプロイ可能
バックエンド
Supabaseクライアント＋Next.js API Routes
マッチング処理のみサーバー側（API Routes）でアトミックに処理

10. ステータス遷移図
（ここにステータス遷移図を挿入）
11. フローチャート（全分岐）
（ここにフローチャートを挿入）
12. 保留事項
インデックス設計（追加箇所・理由）：保留

