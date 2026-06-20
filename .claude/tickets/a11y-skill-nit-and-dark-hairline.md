# a11y/skill-nit-and-dark-hairline

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `a11y/skill-nit-and-dark-hairline`
- **base**: `develop`
- **PR title**: `a11y(skill): labelledby narrow + years 空時防御 + dark hairline 1.4.11`
- **依存**: PR #15 (DanIndicator 段位 meter) が develop にマージ済み
- **想定 reviewer 観点**: A11y (SR / WCAG 1.4.11 Non-text Contrast)

## ゴール

PR #15 reviewer から指摘された nit 3 件を解消する。

1. SR フォーカス時の読み上げを最適化 — `meter` の `aria-labelledby` が SkillRow 全体を指していたため、行内テキスト (note / years / rank ラベル) まで連結して読まれていた。skill name のみを指すよう narrow する。
2. `years` 空時に `aria-valuetext` と視覚表示の双方で「末尾カンマ」「空 hyphen」になる退行を防ぐ。
3. dark mode の `--hairline-strong` (dan-cell-empty ハッチパターン由来) が WCAG 1.4.11 (Non-text Contrast, 3:1) を満たしていない可能性を測定・調整する。

## 変更ファイル (これ以外は触らない)

- `src/app/(use-header)/skill/_components/SkillView.tsx`
  - `DanIndicator`: `years` が falsy なときに `aria-valuetext` を `${rankLabel} (${rank}/6)` (カンマなし) にする
  - `SkillRow`: 旧 `id={`skill-${categoryKey}-${index}`}` を skill name の `<span>` に付け替え (id=`skill-name-...`)。`meter` の `labelledBy` はそちらを参照。
  - `SkillRow`: `skill.years` が空のときの視覚表示を `—` でフォールバック。
- `src/app/globals.css`
  - `[data-theme="dark"]` の `--hairline-strong` を `rgba(237, 228, 211, 0.22)` から `rgba(237, 228, 211, 0.40)` に引き上げ。yoru-base (#14110e) 上で算出した contrast を `~1.81:1` → `~3.32:1` まで改善し、WCAG 1.4.11 (3:1) を充足。
- `.claude/tickets/a11y-skill-nit-and-dark-hairline.md` (新規) — 本ファイル (SSOT)

## 禁止事項

- `src/app/admin/**/*` — スコープ外 (管理画面 PR で扱う)
- `src/app/(use-header)/` 配下で `skill/_components/SkillView.tsx` 以外 — 本 PR は skill 限定の SR 改善
- `light` テーマの `--hairline-strong` — 既に 1.4.11 通過済想定。色味を揃えるリスクが上回るため触らない。
- ライブラリ追加 — 今回は CSS / TSX の局所修正のみ

## 実装ポイント

### (a) aria-labelledby を skill name span に narrow

旧:
```tsx
<div id={`skill-${categoryKey}-${index}`} className="skill-row">
  <div className="skill-name">
    <div>{skill.name}</div>
    <div>{skill.note || '—'}</div>
  </div>
  ...
  <DanIndicator ... labelledBy={`skill-${categoryKey}-${index}`} />
```

新:
```tsx
<div className="skill-row">
  <div className="skill-name">
    <div>
      <span id={`skill-name-${categoryKey}-${index}`}>{skill.name}</span>
    </div>
    <div>{skill.note || '—'}</div>
  </div>
  ...
  <DanIndicator ... labelledBy={`skill-name-${categoryKey}-${index}`} />
```

- これにより VoiceOver / NVDA で skill 1 つにフォーカスした際の読み上げが「{skill.name} — {rankLabel} ({rank}/6, {years})」のみに整理される。
- 旧 `<div>` の `id` は不要になるため削除 (他から参照する仕様はない)。

### (b) years 空時防御

```ts
const valueText = years
  ? `${rankLabel} (${rank}/6, ${years})`
  : `${rankLabel} (${rank}/6)`;
```

視覚表示側 (`skill.years` のセル) も `years || '—'` でフォールバック。

### (c) dark mode --hairline-strong コントラスト

WCAG 1.4.11 (Non-text Contrast 3:1) — `dan-cell-empty` のハッチ線色 = `--hairline-strong`、背景 = `--bg` (`--yoru-base` = `#14110e`)。

算出 (sRGB → relative luminance, alpha blend):

| value                         | L (relative luminance) |
|-------------------------------|------------------------|
| `#14110e`                     | 0.00565                |
| 旧: blend(α=0.22 / #ede4d3)   | 0.0505                 |
| 新: blend(α=0.40 / #ede4d3)   | 0.1348                 |

| contrast vs `#14110e`         | ratio    | WCAG 1.4.11 (3:1) |
|-------------------------------|----------|-------------------|
| 旧                            | 1.81:1   | FAIL              |
| 新                            | 3.32:1   | PASS              |

→ `[data-theme="dark"] --hairline-strong` を `rgba(237, 228, 211, 0.40)` に変更。

ハッチパターン以外への副作用:
- `.sumi-line`, `.btn` の border, `::-webkit-scrollbar-thumb` 等にも適用される。これらは元々 visual non-text 要素であり、より見やすくなる方向の変化なので問題なし。
- card hover の border-color も同変数。dark mode で hover が見えやすくなる方向。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
```

手動:
- VoiceOver: skill 1 つ focus で `skill name + 段位ラベル` のみ読み上げ、note 文字列が連結されないこと
- `years` が空のスキルアイテムを一時的に作って `aria-valuetext` に末尾カンマが出ないこと
- dark mode で skill 段位インジケータの空マス (ハッチ) が視認可能であること

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "a11y(skill): labelledby を name span に narrow + years 空時防御 + dark hairline 1.4.11"
git push -u origin a11y/skill-nit-and-dark-hairline
gh pr create --base develop --head a11y/skill-nit-and-dark-hairline \
  --title "a11y(skill): labelledby narrow + years 空時防御 + dark hairline 1.4.11" \
  --body "..."
```

## レビュー観点 (チェックリスト)

- [ ] 仕様通りに実装されているか
- [ ] 禁止事項 (admin / 他 use-header 配下) に違反していないか
- [ ] meter の `aria-labelledby` が skill name span のみを指しているか (note / years を巻き込んでいないか)
- [ ] `years` 空でも `aria-valuetext` / 視覚表示が破綻しないか
- [ ] dark `--hairline-strong` 引き上げで light モードに影響していないか
- [ ] 既存破壊 (id 命名変更で他から参照されていないか) — 旧 `skill-${categoryKey}-${index}` への参照は他にないことを確認
