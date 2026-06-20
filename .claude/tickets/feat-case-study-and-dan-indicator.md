# feat-case-study-and-dan-indicator

## メタ

- **branch**: `feat/case-study-and-dan-indicator`
- **base**: `develop`
- **PR title**: `feat(content+a11y): Production ケーススタディ化 + DanIndicator a11y刷新`
- **依存**: develop に PR #4 (Zod SSOT), PR #7 (jsonld helpers), PR #9 (ISR), PR #10 (RelatedPosts) が入っていること(全て統合済 — `git log origin/develop` で確認可能)
- **想定 reviewer 観点**: A11y/コンテンツ戦略

## ゴール

Production を「制作物の羅列」から「採用判断材料としてのケーススタディ」へ昇格させる。同時に Skill ページの DanIndicator(段位インジケータ)を WCAG 2.2 / SR 利用者にも意味伝達できる形に刷新。

## 変更ファイル (これ以外は触らない)

### A. Case Study スキーマと表示

- `src/lib/schemas/production.ts` — `productionInputSchema` に optional な `caseStudy` を追加:
  ```ts
  caseStudy: z.object({
    role: z.string(),
    period: z.string(),
    teamSize: z.string().optional(),
    stack: z.array(z.string()).default([]),
    problem: z.string(),         // 問: 何が課題だったか
    approach: z.string(),        // 工: どう解決したか
    result: z.string(),          // 果: 何が起きたか
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }).optional()
  ```
- `src/types/post.ts` — `Post` と `PostPage` に `caseStudy?: CaseStudy` を z.infer 経由で反映
- `src/app/(use-header)/production/(use-production)/[id]/ProductionDetail.tsx`:
  - article.caseStudy が定義されていれば、本文 (markdown) の **前** に「問・工・果」ブロックを挿入
  - 縦書きの章タイトル(Tategaki)+ 各セクションの段落
  - `metrics` は `<dl><dt>label</dt><dd>value</dd></dl>` セマンティクスで描画(明朝大字の縦中横)
  - `links` は外部リンクとして本文末に
  - eyebrow の横に種別バッジ:「ケーススタディ」(caseStudy 定義あり) または「ノート」(なし)
- `src/app/(use-header)/production/(use-production)/[id]/page.tsx`:
  - caseStudy が定義されている場合、PR #7 で merge した `creativeWorkJsonLd` を使い `Article` 型の JSON-LD を生成
  - `<script type="application/ld+json">` でページに埋め込む
  - author は profile から自動補完 (PR #7 で必須化済み)
- `src/app/admin/productions/_components/ProductionEditor.tsx`:
  - caseStudy セクションをフォームに追加 (折り畳み可能 details/summary でも可)
  - 最低限必須: `role`, `problem`, `result`
  - metrics は最低 0 件 OK、追加/削除 UI
  - links も同様
  - 既存の Server Actions (PR #11) と zod 検証 (PR #4) のフローに乗せる

### B. DanIndicator a11y刷新

- `src/app/(use-header)/skill/_components/SkillView.tsx` (DanIndicator 部分):
  - 既存の `<div className="dan-cell">` を `role="meter" aria-valuenow={dan} aria-valuemin={0} aria-valuemax={6} aria-valuetext="三段 (3/6, 4年)"` で wrap
  - aria-valuetext は段位名(初/壱/弐/参/四/五/六/極)を反映
  - 空マスに `/` パターン記号を CSS で追加 (色覚多様性のあるユーザーのため、満マス=墨ベタ との区別を色以外で)
  - ページ先頭(SkillView の冒頭)に **凡例ブロックを1回表示**:
    - 「段位の見方」見出し
    - 初(0)/壱(1)/弐(2)/参(3)/四(4)/五(5)/六(6)/極(7) の対応表
    - 「空マスは習熟度不足、満マス(墨ベタ)は到達済み」の説明
- `src/app/globals.css`:
  - `.dan-cell` の空マス用に `background-image: linear-gradient(...)` でハッチパターンを追加
  - 満マスは現状の `background: var(--sumi)` 維持
  - dark mode でも見えるよう調整

## 禁止事項

- `src/app/layout.tsx` の編集 (root layout は触らない)
- `src/app/_components/Header/index.tsx` の編集 (PR #2, #10, #12 で完成済)
- `src/lib/repositories/` の interface 変更 (caseStudy は data 内に持つだけで、repo の type は z.infer から自動拡張)
- `data/productions.json` のレガシーデータには caseStudy を入れない(optional のため未定義で OK、admin から後で入力)
- `:focus-visible` とタップで開閉する説明 UI (DanIndicator) は **scope 外** (follow-up issue)
- yarn.lock / package.json の編集(新規 dependencies 追加不可)

## 実装ポイント

- caseStudy が optional なので、既存の 5 件の Production は全て「ノート」種別になる(バッジで明示)
- admin で caseStudy を入れた瞬間「ケーススタディ」種別に格上げされる UX
- 「問・工・果」のラベルは明朝大字で見出し化(`.t-h2` または専用クラス)
- metrics は最大 4 件くらいで止める(UI で警告)
- creativeWorkJsonLd の author は profile から取るので、profileRepo.get() を ProductionDetail 親 (page.tsx) で呼ぶ
- DanIndicator の凡例は SkillView の Server Component で一度だけ。中で多用される DanIndicator 子コンポーネントには `aria-describedby="dan-legend"` で凡例を参照させると親切

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build
```

build 出力で `/production/[id]` が SSG として 5 件生成されることを確認(PR #9 で導入済)。

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "feat(content+a11y): Production ケーススタディ化 + DanIndicator a11y刷新"
git push -u origin feat/case-study-and-dan-indicator
gh pr create --base develop --head feat/case-study-and-dan-indicator \
  --title "feat(content+a11y): Production ケーススタディ化 + DanIndicator a11y刷新" \
  --body "## Summary
- Production に optional caseStudy {role,period,teamSize,stack,problem,approach,result,metrics,links} 追加
- ProductionDetail に「問・工・果」ブロック + metrics dl/dt/dd + Article JSON-LD
- 種別バッジ(ケーススタディ/ノート)
- ProductionEditor で caseStudy 入力 UI
- DanIndicator を role='meter' + aria-valuetext + 空マスハッチ + 凡例

## Test plan
- [ ] yarn lint / test / build
- [ ] CI green
- [ ] caseStudy 未定義 article は「ノート」バッジで従来通り
- [ ] caseStudy 入力した article は「ケーススタディ」バッジ + 問工果ブロック
- [ ] DanIndicator が SR で「三段(3/6, 4年)」等読み上げ
- [ ] 色覚シミュレータで空/満マス区別可能

🤖 Generated with Claude Code"
```

## レビュー観点

### A11y reviewer
- [ ] DanIndicator の role='meter' + aria-valuenow/valuemin/valuemax/valuetext が正しい
- [ ] 凡例ブロックが SR で1回読み上げられ、子要素から aria-describedby で参照される
- [ ] 空マスのハッチが色覚多様性ユーザーで満マスと区別可能
- [ ] caseStudy ブロックの heading 階層 (`<h2>問・工・果` 等) が正しい
- [ ] metrics `<dl>` のセマンティクスが正しい (`<dt>label</dt><dd>value</dd>` の対応)
- [ ] 種別バッジが視覚 + テキストで判別可能 (色だけに頼らない)

### コンテンツ戦略 reviewer
- [ ] caseStudy のフィールド設計が STAR (Situation/Task/Action/Result) または Process×STAR ハイブリッドの趣旨に沿う
- [ ] metrics が「数値で語れる」設計になっている
- [ ] admin Editor の必須項目最小化 (role/problem/result) で運用負荷が高すぎない
- [ ] Article JSON-LD の author 必須化(PR #7)と整合
- [ ] 「ノート」バッジが手抜きと見られない説明文(凡例)

### 共通
- [ ] 禁止事項に違反していない (layout.tsx, Header, repo interface)
- [ ] yarn.lock 未変更
- [ ] PR #9 の SSG (`/production/[id]` 5件) が壊れていない
