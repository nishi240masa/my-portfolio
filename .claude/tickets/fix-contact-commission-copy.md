# fix/contact-commission-copy — /contact を受託導線として最適化 (mailto 維持)

## 目的

現在の /contact は第一カードが「採用オファー」で、受託の発注者向けになっていない。**mailto 方式は維持** (バックエンド・外部サービスを増やさない方針、ユーザー承認済み) しつつ、カードの並びと文言を受託向けに調整する。

## 依存

なし (feat/services-page と同時進行可 — 触るファイルが異なる。/services へのリンクは相対パスで書くだけでよく、services PR の merge を待つ必要はない)

## 仕様

### 1. `src/app/(use-header)/contact/_components/ContactView.tsx` のカード再構成

- **第一カードを「お仕事のご依頼」(受託) に**。漢字 eyebrow は既存流儀で選ぶ (例: 「依」)。mailto テンプレートの件名は「お仕事のご依頼」、本文テンプレートに「ご依頼内容 / ご希望納期 / ご予算感 (任意)」の記入欄を用意し、発注者が書きやすくする
- 既存の「結 (協業相談)」「招 (採用オファー)」「談 (雑談)」は残すが、順序を 依頼 → 協業 → 採用 → 雑談 に (カード数が増えすぎる場合は採用と雑談の統合も可。トーンは崩さない)
- 受託カードまたはページ冒頭に、対応メニューの詳細として `/services` への誘導リンクを一文添える
- 返信目安の文言は誠実に (即答を約束しない現行トーンを維持)

### 2. `/contact` の metadata 更新

- `src/app/(use-header)/contact/page.tsx` の description を「お仕事のご依頼・ご相談」が第一になる文面へ (現行は「採用オファー・協業相談・雑談」)

### 3. スパム対策

- 不要と判断済み (メールアドレスは profile で公開済み、フォーム非設置のため bot 送信の的なし)。**新たな対策コードは追加しない**

## 制約

- mailto 以外の送信手段 (API / 外部フォーム) を追加しない
- 依存パッケージの追加禁止
- コミットは変更単位で分割 (カード再構成 / metadata)。日本語 conventional commit
- `yarn lint && yarn test --passWithNoTests && yarn build` green (e2e smoke が /contact の見出しを参照している場合は期待値の整合を確認)
- **デプロイ (main へのリリース) はしない**。PR は base develop
