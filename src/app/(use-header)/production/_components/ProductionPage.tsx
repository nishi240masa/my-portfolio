import { Box, Typography } from '@mui/material';
import ProductionList from './ProductionList';

export default function ProductionPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'top',
        minHeight: '100vh',
        gap: 10,
        pt: 5,
        px: { xs: 2, sm: 4 },
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
      <ProductionList />
    </Box>
  );
}
