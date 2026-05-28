'use client';

import { Box, CircularProgress, Typography, Grid2 } from '@mui/material';
import { useAtom } from 'jotai';
import ProductionCard from './ProductionCard';
import { postsAtomLoadable } from '@/store/postAtom';

/**
 * Production一覧ページのロジックコンポーネント
 * データ取得・状態管理を担当し、ProductionCard に描画を委譲する
 */
export default function ProductionList() {
  const [articles] = useAtom(postsAtomLoadable);

  // ローディング中
  if (articles.state === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // エラー発生
  if (articles.state === 'hasError') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">
          データの取得に失敗しました。しばらくしてからもう一度お試しください。
        </Typography>
      </Box>
    );
  }

  return (
    <Grid2
      container
      spacing={3}
      sx={{
        alignItems: 'stretch',
      }}
    >
      {articles.data.map((data) => (
        <Grid2 key={data.id} size={{ md: 4, sm: 6, xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ProductionCard data={data} />
        </Grid2>
      ))}
    </Grid2>
  );
}
