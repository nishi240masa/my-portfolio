'use client';

import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: ReactNode;
}

/**
 * クライアントサイドのレイアウトコンポーネント
 * ErrorBoundary と ThemeProvider を含む
 */
export default function ClientLayout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
