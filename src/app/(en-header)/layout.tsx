import EnHeader from '../_components/EnHeader';
import EnFooter from '../_components/EnFooter';

export default function EnHeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="shell" lang="en">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <EnHeader />
      <main id="main" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>
      <EnFooter />
    </div>
  );
}
