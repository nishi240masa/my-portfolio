'use client';

import { Box, Button, Chip, Divider, Grid2, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { postAtomLoadable } from '@/store/postAtom';

export const runtime = 'edge';

export default function ArticlePage() {
  const { id } = useParams();
  const number = typeof id === 'string' ? parseInt(id, 10) : 0;

  const router = useRouter();
  const [articles] = useAtom(postAtomLoadable);

  // エラー処理およびローディング
  if (articles.state === 'hasError') return <div>エラーが発生しました</div>;
  if (articles.state === 'loading') return <div>ローディング中...</div>;

  // 記事データの取得
  const article = articles.state === 'hasData' ? articles.data.find((a) => a.id === number) : undefined;

  // 記事が見つからない場合
  if (article === null || article === undefined) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">記事が見つかりません。</Typography>
        <Button
          onClick={() => {
            router.back();
          }}
          sx={{ mt: 2 }}
          variant="contained"
        >
          戻る
        </Button>
      </Box>
    );
  }

  // 記事表示
  return (
    <Box
      sx={{
        maxWidth: '900px',
        mx: 'auto',
        p: 4,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* タイトル */}
      <Typography sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }} variant="h3">
        {article.title}
      </Typography>

      {/* 作成日とタグ */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: 'text.secondary', mb: 2 }} variant="subtitle1">
          作成日: {article.date}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {article.tags.map((tag) => (
            <Chip key={tag} label={tag} sx={{ fontSize: '0.875rem', fontWeight: 'medium' }} variant="outlined" />
          ))}
        </Box>
      </Box>

      <Divider />

      {/* 画像 */}
      <Box
        alt={article.title}
        component="img"
        src={article.image}
        sx={{ width: '100%', borderRadius: 4, objectFit: 'cover' }}
      />

      <Divider />

      {/* 記事の概要 */}
      <Typography sx={{ lineHeight: 1.8, fontSize: '1rem', color: '#555' }} variant="body1">
        {article.description}
      </Typography>

      {/* 詳細情報 */}
      <Grid2 container spacing={2}>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <Typography variant="body1">
            <strong>人数:</strong> {article.peopleNum}人
          </Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <Typography variant="body1">
            <strong>役割:</strong> {article.role}
          </Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <Typography variant="body1">
            <strong>期間:</strong> {article.period}
          </Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, xs: 12 }}>
          <Typography variant="body1">
            <strong>使用技術:</strong> {article.technologys.join(', ')}
          </Typography>
        </Grid2>
      </Grid2>

      <Divider />

      {/* 本文 */}
      <Box sx={{ lineHeight: 1.8, fontSize: '1rem', color: '#444' }}>
        <ReactMarkdown rehypePlugins={[rehypeKatex]} remarkPlugins={[remarkMath]}>
          {article.content}
        </ReactMarkdown>
      </Box>

      {/* 戻るボタン */}
      <Box sx={{ textAlign: 'start', mt: 4 }}>
        <Button
          onClick={() => {
            router.back();
          }}
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            padding: '8px 24px',
            color: '#fff',
            '&:hover': { backgroundColor: '#0056b3' },
          }}
          variant="contained"
        >
          戻る
        </Button>
      </Box>
    </Box>
  );
}
