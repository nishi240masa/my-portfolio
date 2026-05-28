'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme, type ThemeMode } from '../theme';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeModeContext, THEME_STORAGE_KEY } from './ThemeModeContext';

interface Props {
  children: ReactNode;
}

/**
 * クライアントサイドのレイアウトコンポーネント
 * テーマ（ライト／夜墨）の状態管理、ErrorBoundary、ThemeProvider を含む。
 * 初期テーマは <head> のインラインスクリプトが data-theme として確定済みのため、
 * マウント後にそれを読み取って React 状態と同期する（フラッシュ無し）。
 */
export default function ClientLayout({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const initial =
      (document.documentElement.getAttribute('data-theme') as ThemeMode | null) ?? 'light';
    setMode(initial);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // localStorage 不可（プライベートモード等）は無視
      }
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
