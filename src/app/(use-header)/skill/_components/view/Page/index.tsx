import {
  Box,
  Typography,
  Paper,
  Container,
  Grid2,
  LinearProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import WebIcon from '@mui/icons-material/Web';

interface Skill {
  name: string;
  level: number;
  experience: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
  color: string;
}

export default function Page() {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Backend Development',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      color: '#b5495b',
      skills: [
        { name: 'Golang', level: 85, experience: '2年' },
        { name: 'REST API Design', level: 80, experience: '2年' },
        { name: 'DDD (Domain-Driven Design)', level: 75, experience: '1年' },
        { name: 'Microservices', level: 70, experience: '1年' },
        { name: 'gRPC', level: 65, experience: '1年' },
      ],
    },
    {
      title: 'Frontend Development',
      icon: <WebIcon sx={{ fontSize: 40 }} />,
      color: '#e9c895',
      skills: [
        { name: 'TypeScript', level: 80, experience: '2年' },
        { name: 'Next.js', level: 75, experience: '1.5年' },
        { name: 'React', level: 75, experience: '2年' },
        { name: 'Material-UI', level: 70, experience: '1年' },
        { name: 'CSS/SCSS', level: 70, experience: '2年' },
      ],
    },
    {
      title: 'Database & Storage',
      icon: <StorageIcon sx={{ fontSize: 40 }} />,
      color: '#b5495b',
      skills: [
        { name: 'PostgreSQL', level: 80, experience: '2年' },
        { name: 'MySQL', level: 70, experience: '1.5年' },
        { name: 'Redis', level: 65, experience: '1年' },
        { name: 'SQL Design', level: 75, experience: '2年' },
      ],
    },
    {
      title: 'Infrastructure & DevOps',
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      color: '#e9c895',
      skills: [
        { name: 'Docker', level: 80, experience: '2年' },
        { name: 'AWS (EC2, RDS, S3)', level: 70, experience: '1年' },
        { name: 'GitHub Actions', level: 70, experience: '1年' },
        { name: 'Linux', level: 75, experience: '2年' },
        { name: 'Nginx', level: 65, experience: '1年' },
      ],
    },
  ];

  const tools = [
    'Git',
    'GitHub',
    'VS Code',
    'Postman',
    'Figma',
    'Notion',
    'Slack',
    'Jira',
  ];

  const certifications = [
    {
      name: 'none',
      date: 'none',
    },
  ];

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
              Skills
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              技術スタックとスキルセット
            </Typography>
          </Box>

          {/* スキルカテゴリー */}
          <Grid2 container spacing={4} sx={{ mb: 6 }}>
            {skillCategories.map((category, index) => (
              <Grid2 size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #fffaf4 0%, #f7f4ef 100%)',
                    border: '2px solid',
                    borderColor: category.color,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent>
                    {/* カテゴリーヘッダー */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 2,
                      }}
                    >
                      <Box sx={{ color: category.color }}>{category.icon}</Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: category.color,
                        }}
                      >
                        {category.title}
                      </Typography>
                    </Box>

                    {/* スキルリスト */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {category.skills.map((skill, skillIndex) => (
                        <Box key={skillIndex}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {skill.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary' }}
                            >
                              経験: {skill.experience}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={skill.level}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: category.color,
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* ツール & ソフトウェア */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #fffaf4 0%, #f7f4ef 100%)',
              border: '2px solid',
              borderColor: 'secondary.main',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 3,
              }}
            >
              Tools & Software
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tools.map((tool) => (
                <Chip
                  key={tool}
                  label={tool}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'text.primary',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    padding: '20px 12px',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* 資格 */}
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
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 3,
              }}
            >
              Certifications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {certifications.map((cert, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'rgba(233, 200, 149, 0.2)',
                    borderRadius: 1,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </main>
  );
}
