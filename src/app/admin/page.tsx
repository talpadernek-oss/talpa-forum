import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Kayıt Paneli | 2. TALPA Uçuş Emniyet Forumu',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminApp />;
}
