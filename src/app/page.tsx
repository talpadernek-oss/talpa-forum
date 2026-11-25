import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { siteUrl } from '@/lib/constants';

export const metadata: Metadata = {
  alternates: { canonical: siteUrl('tr'), languages: { tr: siteUrl('tr'), en: siteUrl('en') } }
};

export default function Home() {
  return <HomePage lang="tr" />;
}
