import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { type Post } from '@/types/post';

interface Props {
  data: Post;
}

export default function CardPage({ data }: Props) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // 内容を上下に分ける
        height: '100%', // 親要素に合わせる
        width: '100%', // グリッド幅に合わせる
        borderRadius: 4,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        },
      }}
    >
      <CardActionArea
        component={Link} // Linkを直接CardActionAreaに埋め込む
        href={`/production/${data.id}`}
        sx={{ flexGrow: 1 }}
      >
        {/* 画像 */}
        <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
          <Image
            alt={data.title}
            src={data.image}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Box>
        {/* コンテンツ */}
        <CardContent>
          {/* タイトル */}
          <Typography
            component="div"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            variant="h6"
          >
            {data.title}
          </Typography>
          {/* tag */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              mb: 1,
            }}
          >
            {data.tags.map((tag) => (
              <Typography
                key={tag}
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
                variant="caption"
              >
                {tag}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
      {/* 日付 */}
      <Box
        sx={{
          backgroundColor: '#f4f4f4',
          textAlign: 'center',
          padding: '8px',
          borderTop: '1px solid #ddd',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
          variant="caption"
        >
          {data.date}
        </Typography>
      </Box>
    </Card>
  );
}
