/** Shared by the public site, the admin panel and the API (no server-only imports). */

export const EVENT = {
  edition: '2. TALPA',
  title: 'Uçuş Emniyet Forumu',
  subtitle: 've TALPA-MDA Sempozyumu',
  dateLabel: '1–2 Aralık 2026',
  startTime: '09.00',
  venue: 'SHGM Türk Sivil Havacılık Akademisi',
  city: 'İstanbul',
  startsAt: '2026-12-01T09:00:00+03:00',
  website: 'https://www.talpa.org',
  instagram: 'https://www.instagram.com/talpa_org/',
  linkedin: 'https://www.linkedin.com/company/talpa/'
} as const;

export const DAYS = [
  { value: '1', label: '1 Aralık 2026', weekday: 'Salı' },
  { value: '2', label: '2 Aralık 2026', weekday: 'Çarşamba' }
] as const;
export type DayValue = (typeof DAYS)[number]['value'];

export const ROLES = [
  { value: 'katilimci', label: 'Katılımcı', badge: 'bg-sky-50 text-sky-800 ring-sky-200' },
  { value: 'konusmaci', label: 'Konuşmacı', badge: 'bg-amber-50 text-amber-800 ring-amber-200' },
  { value: 'protokol', label: 'Protokol', badge: 'bg-rose-50 text-rose-800 ring-rose-200' },
  { value: 'gorevli', label: 'Görevli', badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200' }
] as const;
export type RoleValue = (typeof ROLES)[number]['value'];

export const roleLabel = (v: string) => ROLES.find(r => r.value === v)?.label ?? v;

/** "Diğer" lets the person type their own title. */
export const JOB_TITLES = [
  'Pilot',
  'Kabin Personeli',
  'Uçuş Mühendisi',
  'Uçuş Dispeçeri / Harekât Uzmanı',
  'Hava Trafik Kontrolörü',
  'Uçak Bakım Teknisyeni / Mühendisi',
  'Uçuş Emniyeti Uzmanı',
  'Ekip Planlama',
  'Eğitim / Kalite / Risk Yönetimi',
  'İnsan Kaynakları',
  'Yönetici',
  'Akademisyen / Öğrenci',
  'Diğer'
] as const;
export const OTHER_TITLE = 'Diğer';

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  organization: string;
  days: DayValue[];
  role: RoleValue;
  notes: string;
  checkedIn: boolean;
  source: 'form' | 'manual';
  createdAt: string;
  updatedAt: string;
}
