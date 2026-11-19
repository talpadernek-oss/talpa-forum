import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { tr: '/', en: '/en' } }
};

export default function Home() {
  return <HomePage lang="tr" />;
}
