import { Box, Typography, Paper } from '@mui/material';

export default function Page() {
  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          pt: 10,
          pl: 5,
          pr: 5,
          //   背景を透過
          bgcolor: 'rgba(255, 255, 255, 0)',
        }}
      >
        {/* 画像 */}
        <Paper
          sx={{
            width: { xs: '100%', sm: '750px' },
            height: { xs: 'auto', sm: '550px' },
            overflow: 'hidden',
            boxShadow: '15px 15px 0px 0 #e9c895',
          }}
        >
          <img
            alt="home"
            src="my_home.jpg"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        </Paper>

        {/* テキスト */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 2,
            // 背景を透過
            bgcolor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Typography
            sx={{
              writingMode: 'vertical-lr',
              textIndent: '4em',
              fontWeight: 'bold',
              lineHeight: 1.2,
            }}
            variant="h2"
          >
            未来のある開発を
          </Typography>
          <Typography
            sx={{
              writingMode: 'vertical-lr',
              fontWeight: 'bold',
              lineHeight: 1.2,
            }}
            variant="h2"
          >
            意味のある 人生を
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '600px', // 三角形の幅
          height: '100%', // 三角形の高さ
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)', // 三角形を作成
          backgroundImage: 'url(red_origami.jpg)', // 背景画像を設定
          backgroundSize: 'cover', // 画像を全体にフィット
          backgroundPosition: 'center', // 画像を中央配置
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // 影を追加（オプション）
          position: 'absolute', // 位置を絶対値に
          top: '9%', // 上から50%の位置に
          right: '0px',
          zIndex: -1, // 他の要素よりも背面に配置
        }}
      />
    </main>
  );
}
