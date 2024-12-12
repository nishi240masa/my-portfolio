// app/layout.tsx
import './globals.css'; // グローバルCSSが必要なら
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

export const metadata = {
  title: 'west-Potfolio',
  description: 'westのポートフォリオサイト',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hina+Mincho&family=Noto+Sans+JP:wght@100..900&display=swap"
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
