'use client';

import Box from '@mui/material/Box';
import { ReactNode } from 'react';

interface WagaraBoxProps {
  children?: ReactNode;
  height?: string | number;
  pattern?: 'asanoha' | 'seigaiha' | 'ichimatsu';
}

export default function WagaraBox({
  children,
  height = '200px',
  pattern = 'asanoha',
}: WagaraBoxProps) {
  // SVGパターンをData URLとして定義
  const patterns = {
    // 麻の葉模様
    asanoha: `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#fffaf4"/>
        <path d="M50 0 L50 50 L0 25 M50 0 L50 50 L100 25 M50 50 L25 75 M50 50 L75 75 M0 75 L50 50 L100 75"
          stroke="#e9c895" stroke-width="1.5" fill="none"/>
        <path d="M50 100 L50 50 L0 75 M50 100 L50 50 L100 75 M50 50 L25 25 M50 50 L75 25 M0 25 L50 50 L100 25"
          stroke="#e9c895" stroke-width="1.5" fill="none"/>
      </svg>
    `)}`,

    // 青海波模様
    seigaiha: `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="#fffaf4"/>
        <path d="M0 30 Q25 10 50 30 T100 30" stroke="#e9c895" stroke-width="1.5" fill="none"/>
        <path d="M0 40 Q25 20 50 40 T100 40" stroke="#e9c895" stroke-width="1.5" fill="none"/>
        <path d="M0 50 Q25 30 50 50 T100 50" stroke="#b5495b" stroke-width="1.5" fill="none"/>
      </svg>
    `)}`,

    // 市松模様
    ichimatsu: `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" fill="#e9c895"/>
        <rect x="20" y="20" width="20" height="20" fill="#e9c895"/>
        <rect x="20" y="0" width="20" height="20" fill="#fffaf4"/>
        <rect x="0" y="20" width="20" height="20" fill="#fffaf4"/>
      </svg>
    `)}`,
  };

  return (
    <Box
      sx={{
        width: '100%',
        height,
        backgroundImage: `url("${patterns[pattern]}")`,
        backgroundRepeat: 'repeat',
        borderRadius: '8px',
        border: '2px solid #b5495b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(255,250,244,0.8) 0%, rgba(247,244,239,0.8) 100%)',
          zIndex: 0,
        },
        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      }}
    >
      {children}
    </Box>
  );
}
