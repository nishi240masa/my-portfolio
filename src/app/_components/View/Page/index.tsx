import Header from '../../Header';
import Home from '@/app/(use-header)/home/_components/view/Page';

export default function TopPage() {
  return (
    <main>
      <Header />
      {/* ・/HomeをtopPageとする */}
      <Home />
    </main>
  );
}
