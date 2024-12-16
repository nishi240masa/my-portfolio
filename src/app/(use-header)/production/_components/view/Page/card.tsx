import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
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
      <CardActionArea sx={{ flexGrow: 1 }}>
        {/* 画像 */}
        <CardMedia alt={data.title} component="img" height="180" image={data.image} />
        {/* コンテンツ */}
        <CardContent>
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
          <Typography
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            variant="body2"
          >
            {data.description}
          </Typography>
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
