import { Box, Typography, Button } from '@mui/material';

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
        alt="Maintenance"
        component="img"
        src="ment_cat.png" // メンテナンスを表すアイコンやイラスト
        sx={{
          width: '300px',
          height: '300px',
          mb: 4, // マージン（下）
        }}
      />

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
