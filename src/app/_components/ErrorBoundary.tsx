'use client';

import { Component, ReactNode } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * エラーバウンダリーコンポーネント
 * 子コンポーネントで発生したエラーをキャッチして、フォールバックUIを表示する
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生したら state を更新してフォールバックUIを表示
    return {
      hasError: true,
      error,
      errorInfo: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // エラーログをコンソールに出力
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // 本番環境では、ここでエラーログをサーバーに送信することもできる
    // 例: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // エラー状態をリセット
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    // ホームページに移動
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIがある場合はそれを表示
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: 64,
                color: 'error.main',
                mb: 2,
              }}
            />

            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
              エラーが発生しました
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              申し訳ございません。予期しないエラーが発生しました。
              <br />
              ページをリロードするか、ホームに戻ってお試しください。
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: 'grey.100',
                  textAlign: 'left',
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && `\n\n${this.state.errorInfo}`}
                </Typography>
              </Paper>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{ minWidth: 140 }}
              >
                再試行
              </Button>

              <Button
                variant="outlined"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                sx={{ minWidth: 140 }}
              >
                ホームに戻る
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * 簡易版エラーバウンダリー（関数コンポーネント用）
 * React 19 では useErrorBoundary フックが使用可能になる予定
 */
export function SimpleErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
