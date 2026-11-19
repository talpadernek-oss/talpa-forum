/** Shared by the public site, the admin panel and the API (no server-only imports). */
import type { Lang } from './messages';

export const EVENT = {
  edition: '2. TALPA',
  title: 'Uçuş Emniyet Forumu',
  subtitle: 've TALPA-MDA Oturumu',
  dateLabel: '1–2 Aralık 2026',
  startTime: '09.00',
  venue: 'SHGM Türk Sivil Havacılık Akademisi',
  city: 'İstanbul',
  address: 'Yeşilköy Mahallesi, Yeni Havaalanı Caddesi, No: 7, Bakırköy / İstanbul (DHMİ A Kapısı yanı)',
  mapsUrl: 'https://maps.app.goo.gl/omhneBUTGUidrBaD7',
  startsAt: '2026-12-01T09:00:00+03:00',
  website: 'https://www.talpa.org',
  instagram: 'https://www.instagram.com/talpa_org/',
  linkedin: 'https://www.linkedin.com/company/talpa/'
} as const;

/** Partner hotel for participants coming from outside Istanbul; agreed rates in EUR, single / double occupancy. */
export const HOTEL = {
  name: 'Crowne Plaza Istanbul Florya',
  url: 'https://cpistanbulflorya.com/',
  logo: '/crowne-plaza-florya.png',
  rooms: [
    { tr: 'Superior Bahçe Manzaralı Oda', en: 'Superior Room – Garden View', beds: '1 King Premium Sofa Bed with Balcony', single: 120, double: 140 },
    { tr: 'Deluxe Kısmi Deniz Manzaralı Oda', en: 'Deluxe Room – Partial Sea View', beds: '1 King/Twin Bed Premium Sofa Bed Side Sea View', single: 135, double: 155 },
    { tr: 'Studio Suite Panoramik Deniz Manzaralı Oda', en: 'Studio Suite – Panoramic Sea View', beds: '1 King Bed Junior Suite Sofa Bed Sea View', single: 195, double: 215 },
    { tr: 'Junior Suite (Club Lounge)', en: 'Junior Suite (Club Lounge)', beds: '1 King Junior Suite Sofa Bed Sea View', single: 245, double: 265 },
    { tr: 'Family Suite', en: 'Family Suite', beds: '1 King Bed and 2 Twin Beds Junior Suite', single: 270, double: 290 },
    { tr: 'Senior Suite Pool Access With Terrace', en: 'Senior Suite – Pool Access with Terrace', beds: '1 King Junior Suite with Pool Access', single: 315, double: 335 },
    { tr: 'Executive Suite', en: 'Executive Suite', beds: '1 King Bed Junior Suite with Living Area', single: 335, double: 355 }
  ]
} as const;

export const DAYS = [
  { value: '1', label: '1 Aralık 2026', weekday: 'Salı', labelEn: '1 December 2026', weekdayEn: 'Tuesday' },
  { value: '2', label: '2 Aralık 2026', weekday: 'Çarşamba', labelEn: '2 December 2026', weekdayEn: 'Wednesday' }
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
  'Kaptan Pilot',
  'First Officer',
  'Kabin Amiri',
  'Kabin Memuru',
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

/** English labels for the English form; the stored value stays Turkish so the admin list is uniform. */
export const JOB_TITLES_EN: Record<(typeof JOB_TITLES)[number], string> = {
  'Kaptan Pilot': 'Captain',
  'First Officer': 'First Officer',
  'Kabin Amiri': 'Cabin Chief / Purser',
  'Kabin Memuru': 'Cabin Crew Member',
  'Uçuş Mühendisi': 'Flight Engineer',
  'Uçuş Dispeçeri / Harekât Uzmanı': 'Flight Dispatcher / Flight Operations Officer',
  'Hava Trafik Kontrolörü': 'Air Traffic Controller',
  'Uçak Bakım Teknisyeni / Mühendisi': 'Aircraft Maintenance Technician / Engineer',
  'Uçuş Emniyeti Uzmanı': 'Flight Safety Officer',
  'Ekip Planlama': 'Crew Planning / Rostering',
  'Eğitim / Kalite / Risk Yönetimi': 'Training / Quality / Risk Management',
  'İnsan Kaynakları': 'Human Resources',
  'Yönetici': 'Manager / Executive',
  'Akademisyen / Öğrenci': 'Academic / Student',
  'Diğer': 'Other'
};

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
  /** Verified by T.C. Kimlik No against Odoo at registration. */
  talpaMember?: boolean;
  odooPartnerId?: number;
  /** Language of the page the web form was sent from (missing on older and manual entries = Turkish). */
  lang?: Lang;
  source: 'form' | 'manual';
  createdAt: string;
  updatedAt: string;
}
