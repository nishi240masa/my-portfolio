# feat/production-case-study — 制作物に「課題→解決→成果」要約を投入 + #4 削除 + #5 誠実化

## 目的

発注者が数秒で「誰のどんな不便を、どう解決したか」を読み取れるようにする。技術の羅列ではなく課題解決を主語にした要約を、既存の `caseStudy` スキーマ (問・工・果) に**データ投入**する (描画実装は `ProductionDetail.tsx` に存在済み)。あわせて実態のない作品 #4 を削除し、#5 を個人検証として誠実な記述に修正する。

## 依存

なし

## 背景 (ユーザー確認済みの事実 — 勝手に変えない)

- **id:4 (Design System & Component Library) は実施していない作品** → 掲載から削除する (ユーザー承認済み)
- **id:5 (GraphQL BFF) は個人の検証プロジェクト**。本文中の「40%短縮」「30%削減」の数値は根拠なしのため削除する (ユーザー承認済み)

## 仕様

### 1. `data/productions.json` — caseStudy 投入 (以下の文面をそのまま使う。schema は `src/lib/schemas/production.ts` の `caseStudy` に適合させる)

**id:1 MD2S**
- problem: 「エンジニアがスライド資料を作るたびに、GUI ツールのレイアウト調整に時間を取られる。書き慣れた Markdown だけで資料を完成させたい——そんな不便の解消を目指した。」
- approach: 「Go (Gin) + React で、リアルタイムプレビュー・PDF 出力・共有 URL を備えたスライド生成 Web アプリを 4 人チームで開発。バックエンドとアーキテクチャ設計を担当した。」
- result: 「Markdown を書くだけでスライドが完成する体験を実現。約 2 ヶ月のチーム開発で完成させた。」

**id:2 w3st CMS**
- problem: 「SaaS 型 CMS では権限制御や独自のデータモデリングに制限があり、要件に合わせた柔軟なコンテンツスキーマを定義できない場面があった。」
- approach: 「DDD + クリーンアーキテクチャの 4 層構成で Go 製ヘッドレス CMS をフルスクラッチ開発。Terraform で AWS (ECS/RDS/S3) を IaC 化し、1 人で 5 ヶ月かけて構築した。」
- result: 「ドメイン層に影響を与えずインフラ実装を差し替えられる、保守性の高い構造を実現した。」

**id:3 センサー連動型対戦ゲーム**
- problem: 「加速度センサーの生データはノイズと遅延が大きく、そのまま使うとゲームキャラクターの動きがブレて操作にならない。」
- approach: 「エッジ側で予測と補正を組み合わせたフィルタリングを実装し、Go の並行処理 (goroutine + channel) で毎秒数十回のセンサーデータを低遅延で配信した。」
- result: 「滑らかな操作感を実現し、ハッカソンで技術部門賞を受賞した。」

**id:5 GraphQL BFF**
- problem: 「フロントエンドが複数の REST API を直接呼ぶ構成で生じる N+1 リクエストと過剰なデータ加工を、BFF 層でどう解消できるか検証したかった。」
- approach: 「Apollo Server による GraphQL BFF を個人開発し、DataLoader によるバッチ取得と Redis キャッシュでバックエンド負荷を抑える設計を実装した。」
- result: 「1 リクエストで画面に必要なデータが揃う構成を実証し、BFF の設計パターンを習得した。」

### 2. `data/productions.json` — id:4 の削除

- 配列から id:4 のオブジェクトを丸ごと削除。他作品の id は変更しない (歯抜けで良い)
- 削除により壊れる参照がないか確認 (`generateStaticParams`、テスト、`.lighthouserc.json` は `/production/1` のみ参照のはず)

### 3. `data/productions.json` — id:5 本文の誠実化

- 「Bckend For Frontend」のタイプミスを「Backend For Frontend」に修正 (全出現箇所)
- 「## 成果」節から 40% / 30% の数値主張を削除し、個人検証として得た学び (DataLoader によるバッチ化、リゾルバレベルのキャッシュ戦略など) を成果として記述し直す
- 「## 背景」の「〜が問題化していました」等、実運用サービスを思わせる表現を「検証テーマとして設定した」文脈に修正。嘘のない範囲で技術的深さは残してよい

### 4. 一覧カードへの要約表示 (小さな UI 追加)

- `/production` 一覧のカードに `caseStudy.problem` を 1〜2 行 (line-clamp) で表示する。caseStudy が無い作品では何も出さない (防御的に)
- 既存のカードデザイン・タイポスケール (`.t-meta` / `--fg-muted` 等) に馴染ませる。新しい色・フォント禁止

## 制約

- 依存パッケージの追加禁止
- コミットは変更単位で分割 (例: caseStudy 投入 / #4 削除 / #5 本文修正 / 一覧カード UI)。日本語 conventional commit
- `yarn lint && yarn test --passWithNoTests && yarn build` green を確認 (productions.json は Zod parse を通ること)
- **デプロイ (main へのリリース) はしない**。PR は base develop
