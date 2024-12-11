'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b5495b', // 深紅色
    },
    secondary: {
      main: '#e9c895', // 桜色
    },
    background: {
      default: '#f7f4ef', // 和紙風の背景色
      paper: '#fffaf4', // 明るい和紙風の色
    },
    text: {
      primary: '#2c2c2c', // 墨色
      secondary: '#8a8a8a', // 灰色
    },
  },
  typography: {
    fontFamily: '"Noto Serif JP", "serif"',
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
});

export default theme;
