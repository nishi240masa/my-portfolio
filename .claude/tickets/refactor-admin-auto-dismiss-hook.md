# refactor-admin-auto-dismiss-hook

> ファイル名 = ブランチ名 (`/` → `-`)
> 1 ファイル 1 PR

## メタ

- **branch**: `refactor/admin-auto-dismiss-hook`
- **base**: `develop`
- **PR title**: `refactor(admin): useAutoDismissOnSuccess カスタムフックに DRY 化`
- **依存**: PR #16 (AdminForm DRY) が develop に入っていること
- **想定 reviewer 観点**: DRY / React フック設計 / 既存挙動の保全 / A11y

## ゴール

PR #16 reviewer の nit (4 Editor で重複する「成功 → 3 秒で自動消失」useEffect) を解消する。
専用カスタムフック `useAutoDismissOnSuccess` に集約し、各 Editor の Toolbar に渡す `showOk` フラグ生成を 1 行で済むようにする。

## 変更ファイル (これ以外は触らない)

- `src/app/admin/_hooks/useAutoDismissOnSuccess.ts` (新規) — フック本体
- `src/app/admin/home/HomeEditor.tsx` — useState/useEffect 重複ブロックを `useAutoDismissOnSuccess(state)` に置換
- `src/app/admin/profile/ProfileEditor.tsx` — 同上
- `src/app/admin/skill/SkillEditor.tsx` — 同上
- `src/app/admin/productions/_components/ProductionEditor.tsx` — 同上
- `.claude/tickets/refactor-admin-auto-dismiss-hook.md` (新規) — 本ファイル (SSOT)

## 禁止事項

- `src/app/admin/_components/AdminForm.tsx` — Toolbar の API (`showOk` prop) は据え置き。Toolbar 側に dismiss ロジックを持ち込まない (Toolbar は表示専任)
- `src/app/admin/**` の他ロジック (バリデーション・router.refresh/push 等) は触らない
- `src/app/admin/_actions/*` の変更
- `src/lib/repositories/` の変更
- `next-auth` 関連の変更

## 実装ポイント

### フック API

```ts
export function useAutoDismissOnSuccess<T extends { ok?: boolean }>(
  state: T,
  ms?: number, // default 3000
): boolean;
```

- 戻り値 `showOk` を Toolbar に渡す。
- 内部で `useState(false)` + `useEffect([state, ms])`。`state.ok` が `true` のとき `setShowOk(true)` → `setTimeout` で `false`。
- **deps は `[state, ms]`**。`useActionState` は同じ成功でも毎回新しい state オブジェクトを返すため、object identity を観測することで 2 回目以降の連続成功でも effect が再発火する (= トースト相当の再表示が走る)。
- cleanup で `clearTimeout` してアンマウント時に setState しない。
- `'use client'` ディレクティブ付き。

### Editor 側

- 既存の `useState(false)` + 「3 秒後に false」useEffect 2 行ブロックを削除し、`const showOk = useAutoDismissOnSuccess(state);` に置換。
- `router.refresh()` / `router.push()` の useEffect は別関心 (ナビゲーション) なので触らない。
- `<Toolbar ... showOk={showOk} />` の prop も変えない。

## 検証

```bash
export PATH="/Users/k23087kk/.nodebrew/current/bin:$PATH"
yarn lint && yarn test --passWithNoTests
NEXT_PUBLIC_SITE_URL=https://example.com yarn build
```

## コミット & PR

```bash
git add -A
git -c commit.gpgsign=false commit -m "refactor(admin): useAutoDismissOnSuccess カスタムフックに DRY 化"
git push -u origin refactor/admin-auto-dismiss-hook
gh pr create --base develop --head refactor/admin-auto-dismiss-hook \
  --title "refactor(admin): useAutoDismissOnSuccess カスタムフックに DRY 化" \
  --body "..."
```

PR body:
```markdown
## Summary
- src/app/admin/_hooks/useAutoDismissOnSuccess.ts 新規 (state identity 観測 + ms 後 false)
- 4 Editor (HomeEditor / ProfileEditor / SkillEditor / ProductionEditor) の useEffect 重複をフック呼び出しに置換
- 既存挙動 (3秒自動消失、role=status/aria-live=polite) を維持

## Test plan
- [ ] yarn lint / test / build
- [ ] admin で 2 連続保存しても 2 回目のトーストが出る (state identity)
- [ ] SR で「✓ 保存しました」が live region で読み上げ

🤖 Generated with Claude Code
```

## レビュー観点 (チェックリスト)

- [ ] フック名 / 引数 / 戻り値が分かりやすいか
- [ ] deps に state オブジェクト identity を含めて連続成功にも反応する設計か
- [ ] cleanup が走り、アンマウント後の setState 警告が出ないか
- [ ] Toolbar 側 API (`showOk` prop) を変えていないか
- [ ] 4 Editor 全てで等価な置換 (挙動差なし) か
- [ ] スコープ外 (_actions / repositories / next-auth / AdminForm) を触っていないか
