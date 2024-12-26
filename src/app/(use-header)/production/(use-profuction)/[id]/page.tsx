import { Box, Button, Divider, Typography, Chip } from '@mui/material';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { getAllPosts, getPostById } from '@/utils/article';

// interface Article {
//   id: number;
//   title: string;
//   date: string;
//   tags: string[];
//   image: string;
//   description: string;
//   peopleNum: number;
//   role: string;
//   period: string;
//   technologys: string[];
//   content: string;
// }

// Static Parametersを生成
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

// ページコンポーネント (Server Component)
export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getPostById(params.id);

  if (article === null || article === undefined) {
    return notFound();
  }

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
      <Typography
        sx={{
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
        }}
        variant="h3"
      >
        {article.title}
      </Typography>
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
      <Box
        alt={article.title}
        component="img"
        src={article.image}
        sx={{ width: '100%', borderRadius: 4, objectFit: 'cover' }}
      />
      <Divider />
      <Typography sx={{ lineHeight: 1.8, fontSize: '1rem', color: '#555' }} variant="body1">
        {article.description}
      </Typography>
      <Box sx={{ lineHeight: 1.8, fontSize: '1rem', color: '#444' }}>
        <ReactMarkdown rehypePlugins={[rehypeKatex]} remarkPlugins={[remarkMath]}>
          {article.content}
        </ReactMarkdown>
      </Box>
      <Box sx={{ textAlign: 'start', mt: 4 }}>
        <Button
          onClick={() => {
            window.history.back();
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
