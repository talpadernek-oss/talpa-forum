import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { siteUrl } from '@/lib/constants';

const description =
  '2nd TALPA Flight Safety Forum and TALPA-MDA Session · 1–2 December 2026 · Turkish DGCA (SHGM) Civil Aviation Academy, Istanbul. Positive safety culture, mental health and peer support, GNSS/TCAS spoofing & jamming, FTL and FRMS.';

export const metadata: Metadata = {
  title: '2nd TALPA Flight Safety Forum | 1–2 December 2026',
  description,
  alternates: { canonical: siteUrl('en'), languages: { tr: siteUrl('tr'), en: siteUrl('en') } },
  openGraph: {
    title: '2nd TALPA Flight Safety Forum',
    description,
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/forum-banner.jpg', width: 1350, height: 950, alt: '2nd TALPA Flight Safety Forum – 1-2 December 2026' }]
  }
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
