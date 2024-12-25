'use client';

import { Grid2 } from '@mui/material';
import { useAtom } from 'jotai';
import CardPage from '../view/Page/card';
import { postAtomLoadable } from '@/store/postAtom';

export default function ProductionPageLogic() {
  const [articles] = useAtom(postAtomLoadable);
  // エラー処理およびローディング
  if (articles.state === 'hasError') return <div>エラーが発生しました</div>;
  if (articles.state === 'loading') return <div>ローディング中...</div>;

  return (
    <div>
      <Grid2
        container
        spacing={3}
        sx={{
          alignItems: 'stretch',
        }}
      >
        {articles.data.map((data) => (
          <Grid2 key={data.id} size={{ md: 4, sm: 6, xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CardPage data={{ ...data, date: data.date ?? '' }} />
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}
