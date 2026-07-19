# <branch-name>

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `<feat/xxx>`
- **base**: `develop`
- **PR title**: `<conventional-commit-style title>`
- **依存**: なし | PR #N が develop に入っていること
- **想定 reviewer 観点**: <例: Performance/SEO / A11y / アーキテクト / UX / コンテンツ>

## ゴール

<1-3 文。何を達成するか。なぜそれをするか>

## 変更ファイル (これ以外は触らない)

- `path/to/file.tsx` — <何を変更するか>
- `path/to/new-file.tsx` (新規) — <内容>
- ...

## 禁止事項

- `path/to/file` — <なぜ触らないか (別 PR で / scope 外 / etc)>

## 実装ポイント

<API シグネチャ / 型 / 主要なロジック / エッジケース / 既存破壊の注意点 など>

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests && yarn build
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "<conventional commit message>"
git push -u origin <branch>
gh pr create --base develop --head <branch> --title "..." --body "..."
```

PR body 雛形:
```markdown
## Summary
- ...

## Test plan
- [ ] yarn lint / yarn test / yarn build
- [ ] CI green (test, Vercel)
- [ ] <feature 固有の動作確認>

🤖 Generated with Claude Code
```

## レビュー観点 (チェックリスト)

- [ ] 仕様通りに実装されているか
- [ ] 禁止事項に違反していないか
- [ ] <専門領域固有の欠陥>
- [ ] 既存破壊 (import 経路、型、命名)
- [ ] セキュリティ (XSS / CSP / Cookie / CSRF)
