import {
  Box,
  Typography,
  Paper,
  Container,
  Divider,
  Stack,
  Chip,
  Link,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Page() {
  return (
    <main>
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: 8,
            pb: 8,
          }}
        >
          {/* ヘッダー */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 6,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Profile
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              未来のある開発を 意味のある人生を
            </Typography>
          </Box>

          {/* プロフィール本体 */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fffaf4 0%, #f7f4ef 100%)',
              border: '2px solid',
              borderColor: 'secondary.main',
            }}
          >
            {/* 基本情報 */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                  borderBottom: '3px solid',
                  borderColor: 'primary.main',
                  pb: 1,
                }}
              >
                西尾 匡生 (Masaki Nishio)
                にっしー
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                }}
              >
                Software Engineer / Backend Developer
              </Typography>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'secondary.main' }} />

            {/* 自己紹介 */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                About Me
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 2,
                  color: 'text.primary',
                  whiteSpace: 'pre-line',
                }}
              >
                {`愛知工業大学情報科学部コンピュータシステム専攻に在学中のソフトウェアエンジニアです。
バックエンド開発を中心に、フロントエンド、インフラまで幅広く携わっています。

特にGolangを用いたマイクロサービスアーキテクチャやREST API設計、
ドメイン駆動設計（DDD）に興味を持ち、実践的なプロジェクトに取り組んでいます。

「未来のある開発を、意味のある人生を」をモットーに、
技術を通じて社会に貢献できるエンジニアを目指しています。`}
              </Typography>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'secondary.main' }} />

            {/* 経歴 */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Education & Experience
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                  >
                    愛知工業大学 情報科学部 コンピュータシステム専攻
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2023年4月 - 2026年2月 在学中
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'secondary.main' }} />

            {/* 興味分野 */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Interests
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'Backend Development',
                  'Golang',
                  'REST API',
                  'DDD (Domain-Driven Design)',
                  'Microservices',
                  'Docker',
                  'PostgreSQL',
                  'AWS',
                  'Next.js',
                  'TypeScript',
                ].map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'text.primary',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: 'secondary.main' }} />

            {/* SNS Links */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                Connect With Me
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Link
                  href="https://github.com/west-23"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <GitHubIcon />
                  <Typography variant="body1">GitHub</Typography>
                </Link>
                <Link
                  href="https://twitter.com/west_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <TwitterIcon />
                  <Typography variant="body1">Twitter</Typography>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/kentaro-nishi"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <LinkedInIcon />
                  <Typography variant="body1">LinkedIn</Typography>
                </Link>
                <Link
                  href="mailto:contact@w3st.net"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <EmailIcon />
                  <Typography variant="body1">Email</Typography>
                </Link>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    </main>
  );
}
