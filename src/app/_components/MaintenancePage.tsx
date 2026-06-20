import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <Box
      sx={{
        height: '100vh', // ビューポート全体の高さ
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        bgcolor: '#f3f4f6', // 背景色
        p: 4,
      }}
    >
      {/* アイコンやイラスト */}
      <Box
        sx={{
          width: 300,
          height: 300,
          mb: 4, // マージン（下）
        }}
      >
        <Image
          alt="メンテナンス中のイラスト"
          src="/ment_cat.png"
          width={300}
          height={300}
          priority
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>

      {/* メッセージ */}
      <Typography sx={{ fontWeight: 'bold', mb: 2 }} variant="h4">
        ただいまメンテナンス中です
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }} variant="body1">
        サイトの改善のため、現在作業を行っております。しばらくお待ちください。
      </Typography>

      {/* ボタン（オプション） */}
      <Button color="primary" href="/home" sx={{ mt: 2 }} variant="contained">
        トップページへ戻る
      </Button>
    </Box>
  );
}
