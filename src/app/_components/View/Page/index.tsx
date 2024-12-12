import { Box } from '@mui/material';
import Link from 'next/link';

export default function TopPage() {
  return (
    <main>
      <Box>
        <h1>myPortfolio</h1>
      </Box>
      <Box>
        <Link href="/home">Home</Link>
        <Link href="/production">Production</Link>
        <Link href="/profyle">Profyle</Link>
        <Link href="/skill">Skill</Link>
      </Box>
    </main>
  );
}
