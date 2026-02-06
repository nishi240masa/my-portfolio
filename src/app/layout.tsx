// app/layout.tsx
import './globals.css';
import ClientLayout from './_components/ClientLayout';

export const metadata = {
  title: 'west-Potfolio',
  description: 'westのポートフォリオサイト',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hina+Mincho&family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
