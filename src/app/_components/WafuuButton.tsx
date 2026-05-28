'use client';

import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * 和風スタイルのボタンコンポーネント
 * MUI の Button を拡張し、和のカラーパレットを適用したもの
 */
const WafuuButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontWeight: 'bold',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#922a40',
  },
}));

export type WafuuButtonProps = ButtonProps;

export default WafuuButton;
