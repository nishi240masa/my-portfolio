// app/layout.tsx
import './globals.css'; // グローバルCSSが必要なら
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

export const metadata = {
  title: '和風 UI サンプル',
  description: 'Material UIを使った和風デザイン',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
