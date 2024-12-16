import { Box, Typography } from '@mui/material';
import ProductionPageLogic from '../../logic/Page';

export default function Page() {
  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'top',
          height: '100vh',
          gap: 10,
          pt: 5,
        }}
      >
        <Typography
          sx={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'underline',
          }}
          variant="h1"
        >
          Production
        </Typography>
        <ProductionPageLogic />
      </Box>
    </main>
  );
}
