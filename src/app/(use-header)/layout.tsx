import Header from '../_components/Header';
import Footer from '../_components/design/Footer';
import NextStepCTA from '../_components/NextStepCTA';

export default function UseHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        本文へスキップ
      </a>
      <Header />
      <main id="main" tabIndex={-1} style={{ flex: 1 }}>
        {children}
        <NextStepCTA />
      </main>
      <Footer />
    </div>
  );
}
