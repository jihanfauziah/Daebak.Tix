import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Daebak.Tix — Platform Tiket Resmi Konser & Fanmeeting Korea Indonesia',
  description: 'Marketplace tiket resmi & terpercaya untuk event K-pop, Fanmeeting Aktor Korea, dan Fansign di Indonesia.',
  keywords: ['tiket kpop indonesia', 'fanmeeting aktor korea', 'fansign indonesia', 'daebaktix', 'tiket konser jakarta'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
