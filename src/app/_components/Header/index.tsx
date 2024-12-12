'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* ロゴ部分 */}
        <Typography component="div" variant="h6">
          My Portfolio
        </Typography>

        {/* ナビゲーションリンク */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[
            { label: 'Home', href: '/home' },
            { label: 'Production', href: '/production' },
            { label: 'Profyle', href: '/profyle' },
            { label: 'Skill', href: '/skill' },
          ].map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
