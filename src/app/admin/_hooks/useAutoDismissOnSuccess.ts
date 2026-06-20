'use client';

import { useEffect, useState } from 'react';

/**
 * 成功状態 (state.ok === true) を観測して、Toolbar の「✓ 保存しました」
 * バッジを一定時間だけ表示するためのカスタムフック。
 *
 * useActionState は同じ成功でも毎回新しい state オブジェクトを返すため、
 * deps に state オブジェクト自体を入れて identity を観測する。これによって
 * 2 回目以降の連続成功でも effect が再発火し、トースト相当の表示が
 * リフレッシュされる。
 *
 * @param state - useActionState から返る state（最低限 `ok?: boolean` を持つ）
 * @param ms - 自動消失までのミリ秒（既定 3000）
 * @returns showOk - Toolbar に渡すフラグ
 */
export function useAutoDismissOnSuccess<T extends { ok?: boolean }>(
  state: T,
  ms: number = 3000,
): boolean {
  const [showOk, setShowOk] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setShowOk(true);
      const t = setTimeout(() => setShowOk(false), ms);
      return () => clearTimeout(t);
    }
  }, [state, ms]);

  return showOk;
}
