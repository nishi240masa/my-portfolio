// クライアントから安全に import できる Server Action 共通型。
// 'use server' なヘルパや next/headers などの server-only API は含めない。

export type ActionState<T = unknown> = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: T;
};

export const INITIAL_ACTION_STATE: ActionState = { ok: false };
