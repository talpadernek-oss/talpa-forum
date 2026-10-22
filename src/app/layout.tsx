import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap'
});

const description =
  'TALPA 2. Uçuş Emniyet Forumu ve TALPA-MDA Sempozyumu · 1–2 Aralık 2026 · SHGM Türk Sivil Havacılık Akademisi, İstanbul. Pozitif emniyet kültürü, ruh sağlığı ve akran desteği, GNSS/TCAS spoofing & jamming, FTL ve FRMS.';

const siteUrl =
  process.env.APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '2. TALPA Uçuş Emniyet Forumu | 1–2 Aralık 2026',
  description,
  openGraph: {
    title: '2. TALPA Uçuş Emniyet Forumu',
    description,
    locale: 'tr_TR',
    type: 'website',
    images: [{ url: '/forum-banner.jpg', width: 1350, height: 950, alt: '2. TALPA Uçuş Emniyet Forumu – 1-2 Aralık 2026' }]
  }
};

export const viewport: Viewport = { themeColor: '#0a2350' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={montserrat.variable}>
      <body className="min-h-screen bg-white font-sans text-forum-ink antialiased">{children}</body>
    </html>
  );
}
