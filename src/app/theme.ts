import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

/**
 * デザイントークン（globals.css の CSS 変数）と整合する MUI テーマを生成する。
 * 背景・文字色は CSS 変数（var(--bg) / var(--fg)）に束ねることで、
 * data-theme 切替に対してフラッシュ無しで追従する。
 */
export function createAppTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#b5495b' }, // 深紅／朱
      secondary: { main: '#e9c895' }, // 金茶／桜
      background: {
        default: isDark ? '#14110e' : '#f7f4ef',
        paper: isDark ? '#1c1814' : '#fffaf4',
      },
      text: {
        primary: isDark ? '#ede4d3' : '#2c2c2c',
        secondary: isDark ? '#a9a195' : '#8a8a8a',
      },
    },
    typography: {
      fontFamily:
        '"Noto Sans JP", -apple-system, "Hiragino Kaku Gothic ProN", system-ui, sans-serif',
      h1: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
      h2: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
      h3: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
      h4: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
      h5: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
      h6: { fontFamily: '"Hina Mincho", serif', fontWeight: 400 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // CSS 変数を正とし、MUI 由来の背景・文字色を上書きさせない
          body: {
            backgroundColor: 'var(--bg)',
            color: 'var(--fg)',
          },
        },
      },
    },
  });
}

const theme = createAppTheme('light');
export default theme;
