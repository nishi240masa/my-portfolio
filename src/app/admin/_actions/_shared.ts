// 管理 Server Actions 用の server-only ヘルパ。
// このモジュールは Server Action ファイルからのみ import すること
// (クライアントから import すると next/headers / @/auth が解決できずビルド失敗)。
//
// 共通の型 (ActionState) はクライアントから参照可能な ./_types を使う。

import 'server-only';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import type { ActionState } from './_types';

export type { ActionState };
export { INITIAL_ACTION_STATE } from './_types';

// CSRF / クロスオリジン対策: Server Action 呼び出しは
// sec-fetch-site で same-origin を厳密確認する。
// - sec-fetch-site が 'same-origin' 以外 (cross-site / same-site / none) は拒否
//   ※ 'none' はアドレスバー直打ち等で攻撃に悪用される可能性があるため許可しない
// - sec-fetch-site が無い古いブラウザでは origin と host を厳密一致確認
// - origin / host も無い場合は検証不能として拒否
export async function assertSameOrigin(): Promise<ActionState<never> | null> {
  const h = await headers();
  const site = h.get('sec-fetch-site');
  if (site) {
    if (site !== 'same-origin') {
      return { ok: false, error: 'Forbidden (cross-site)' };
    }
    return null;
  }
  // sec-fetch-site が無い古い環境では origin / host を厳密比較
  const origin = h.get('origin');
  const host = h.get('host');
  if (!origin || !host) {
    return { ok: false, error: 'CSRF: unable to verify origin' };
  }
  try {
    const o = new URL(origin).host;
    if (o !== host) {
      return { ok: false, error: 'Forbidden (cross-origin)' };
    }
  } catch {
    return { ok: false, error: 'Forbidden (invalid origin)' };
  }
  return null;
}

export async function requireAdminAction(): Promise<ActionState<never> | null> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, error: 'Unauthorized' };
  }
  return null;
}

// formData から JSON ペイロードを取得する。
// AdminForm は payload フィールド (JSON 文字列) を投げる規約。
export function readJsonPayload(formData: FormData): unknown {
  const raw = formData.get('payload');
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
