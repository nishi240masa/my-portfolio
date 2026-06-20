'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme, type ThemeMode } from '../theme';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeModeContext, THEME_STORAGE_KEY } from './ThemeModeContext';

interface Props {
  children: ReactNode;
  initialMode: ThemeMode;
}

/**
 * クライアントサイドのレイアウトコンポーネント
 * テーマ（ライト／夜墨）の状態管理、ErrorBoundary、ThemeProvider を含む。
 * 初期テーマは SSR 段階で cookie から確定済み(initialMode)を引き継ぐ。
 */
export default function ClientLayout({ children, initialMode }: Props) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // localStorage 不可（プライベートモード等）は無視
      }
      try {
        document.cookie = `theme-mode=${next}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // cookie 書き込み不可は無視
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
