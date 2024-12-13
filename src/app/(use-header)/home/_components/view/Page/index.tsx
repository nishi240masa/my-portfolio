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

          '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            top: '9%',
            right: 0,
            width: '600px',
            height: '100%',
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
            backgroundImage: 'url(red_wasi.jpg)', //
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          },
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
            // bgcolor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Typography
            sx={{
              writingMode: 'vertical-lr',
              textIndent: '4em',
              fontWeight: 'bold',
              lineHeight: 1.2,
              textShadow: '#FC0 1px 0 10px',
            }}
            variant="h4"
          >
            未来のある開発を
          </Typography>
          <Typography
            sx={{
              writingMode: 'vertical-lr',
              fontWeight: 'bold',
              lineHeight: 1.2,
              textShadow: '#FC0 1px 0 10px',
            }}
            variant="h4"
          >
            意味のある 人生を
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
