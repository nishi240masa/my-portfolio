"use client";

import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const WafuuButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#922a40',
  },
}));

export default function Example() {
  return <WafuuButton>和風ボタン</WafuuButton>;
}
