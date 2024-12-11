'use client';

import Box from '@mui/material/Box';

export default function WagaraBox() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
        backgroundImage: 'url(/path-to-your-wagara-pattern.png)',
        backgroundSize: 'cover',
        borderRadius: '8px',
        border: '1px solid #b5495b',
      }}
    >
      和柄背景のボックス
    </Box>
  );
}
