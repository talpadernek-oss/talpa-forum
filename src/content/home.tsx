import type { ReactNode } from 'react';
import type { Lang } from '@/lib/messages';

/** Every visible text of the home page, per language. Layout lives in components/HomePage.tsx. */
export interface HomeCopy {
  /** Link to the same page in the other language. */
  switchTo: { href: string; label: string; aria: string };
  logoSub: string;
  topAria: string;
  nav: { forum: string; speakers: string; program: string; venue: string; travel: string; stay: string; register: string };
  hero: {
    edition: string;
    title: string;
    subtitle: string;
    tagline: string;
    month: string;
    venue: string;
    start: string;
    cta: string;
    ctaProgram: string;
  };
  about: { tag: string; heading: string; paragraphs: ReactNode[]; quote: string; posterAlt: string; posterDownload: string };
  /** Speakers and moderator as one image; the alt text lists them for screen readers and search. */
  speakers: { heading: string; image: { src: string; alt: string }; openHint: string };
  program: {
    tag: string;
    heading: string;
    /** Programme pages as images under public/, day 1 first. */
    pages: { src: string; alt: string }[];
    /** Hint under the images: they open full size in a new tab. */
    openHint: string;
  };
  venue: {
    date: { label: string; value: string; sub: string };
    time: { label: string; value: string; sub: string };
    place: { label: string; value: string; sub: string };
    mapLink: string;
  };
  register: { tag: string; heading: string; lead: string; note: string };
  travel: {
    tag: string;
    heading: string;
    addressLabel: string;
    car: ReactNode;
    metro: ReactNode;
    mapButton: string;
    mapAlt: string;
    mapCaption: string;
  };
  stay: {
    tag: string;
    heading: string;
    lead: string;
    roomType: string;
    single: string;
    double: string;
    currencyNote: string;
    website: string;
  };
  footer: { copyright: string };
}

const strong = (text: string) => <strong className="text-forum-navy">{text}</strong>;

const tr: HomeCopy = {
  switchTo: { href: '/en', label: 'EN', aria: 'Switch to English' },
  logoSub: 'Uçuş Emniyet Forumu',
  topAria: 'Sayfa başı',
  nav: { forum: 'Forum', speakers: 'Konuşmacılar', program: 'Program', venue: 'Tarih & Mekân', travel: 'Ulaşım', stay: 'Konaklama', register: 'Kayıt Ol' },
  hero: {
    edition: '2. TALPA',
    title: 'Uçuş Emniyet Forumu',
    subtitle: 've TALPA-MDA Oturumu',
    tagline: 'TALPA Uçuş Emniyet Forumu’na katılımınızı saygılarımızla arz ederiz.',
    month: 'ARALIK',
    venue: 'SHGM Türk Sivil Havacılık Akademisi, İstanbul',
    start: 'Başlangıç 08.45',
    cta: 'Hemen Kayıt Ol',
    ctaProgram: 'Programı İncele'
  },
  about: {
    tag: 'Davet',
    heading: 'Uçuş emniyetini hep birlikte koruyor, hep birlikte en üst düzeyde tutuyoruz.',
    paragraphs: [
      <>
        TALPA – Türkiye Havayolu Pilotları Derneği olarak, uçuş emniyetine ilişkin güncel gelişmelerin, sektörel risklerin ve
        çözüm önerilerinin ulusal ve uluslararası uzmanların katılımıyla ele alınacağı{' '}
        {strong('TALPA 2. Uçuş Emniyet Forumu ve TALPA-MDA Oturumu')}’na sizleri davet etmekten onur duyarız.
      </>,
      'İki gün sürecek etkinliğimizde, uçuş emniyetinin yalnızca teknik ve operasyonel boyutları değil; insan faktörü, kurumsal kültür, psikolojik esenlik ve sürdürülebilir emniyet yönetimi açısından taşıdığı önem de değerlendirilecektir.'
    ],
    quote: '“Uçuş emniyeti, yalnızca kurallara uyumla değil; güven, ortak sorumluluk, bilimsel yaklaşım ve sürekli öğrenmeyle güçlenir.”',
    posterAlt: '2. TALPA Uçuş Emniyet Forumu afişi – 1-2 Aralık 2026, SHGM Türk Sivil Havacılık Akademisi',
    posterDownload: 'Afişi indir'
  },
  speakers: {
    heading: 'Konuşmacılar',
    image: {
      src: '/speakers-tr.jpg',
      alt: 'Konuşmacılar: Kpt. Plt. Juan Carlos LOZANO (ECA Direktörü, bir önceki; IFALPA Başkan Yardımcısı, bir önceki), Prof. Dr. Murat EFE (Ankara Üniversitesi), Prof. Dr. Michael FELUX (Zürih Uygulamalı Bilimler Üniversitesi), Dr. Okuary OSECHAS (Zürih Uygulamalı Bilimler Üniversitesi), Kpt. Plt. Melih YARARCAN (Pegasus Hava Yolları), Psk. Simay LEBLEBİCİ (TALPA MDA Program Psikoloğu), Kpt. Plt. Muharrem GÜNDOĞAN (TALPA MDA Program Koordinatörü), Kpt. Plt. Bülent ATAŞ (Türk Hava Yolları), Nedim YARDIMCI (Türk Hava Yolları), Buğra IŞIK (Türk Hava Yolları), Kpt. Plt. Muhammet E. AKIN (SunExpress), Özcan ÇETİN (SunExpress). Moderatör: Plt. Merve BAŞARAN (ECA Uçuş Standartları ve Operasyon Çalışma Grubu Başkanı).'
    },
    openHint: 'Büyük boyutta görüntülemek için görsele tıklayınız.'
  },
  program: {
    tag: 'Program',
    heading: '1-2 Aralık TALPA Uçuş Emniyet Forum Programı',
    pages: [
      { src: '/program-tr-1.jpg', alt: '1. Gün programı – 1 Aralık 2026, Salı' },
      { src: '/program-tr-2-r2.jpg', alt: '2. Gün programı – 2 Aralık 2026, Çarşamba' }
    ],
    openHint: 'Büyük boyutta görüntülemek için programa tıklayınız.'
  },
  venue: {
    date: { label: 'Tarih', value: '1–2 Aralık 2026', sub: 'Salı – Çarşamba' },
    time: { label: 'Saat', value: '08.45', sub: 'Kayıt ve karşılama ile başlar' },
    place: { label: 'Mekân', value: 'SHGM Türk Sivil Havacılık Akademisi', sub: 'İstanbul' },
    mapLink: 'Konum için tıklayınız'
  },
  register: {
    tag: 'Kayıt',
    heading: 'Katılım başvurusu',
    lead: 'Kaydınız alındıktan sonra etkinlikle ilgili bilgilendirmeler e-posta adresinize iletilecektir.',
    note: 'Kurumunuzdan birden fazla kişi katılacaksa her katılımcının ayrı kayıt yapması gerekir.'
  },
  travel: {
    tag: 'Ulaşım',
    heading: 'Etkinlik alanına ulaşım',
    addressLabel: 'SHGM Türk Sivil Havacılık Akademisi Adresi:',
    car: 'Kendi aracı ile gelecek olan katılımcılarımız için açık otopark imkânı bulunmaktadır.',
    metro: (
      <>
        Toplu taşıma ile gelecek olan katılımcılarımız {strong('M1A metrosu')} ile {strong('Atatürk Havalimanı')} durağında
        inebilirler.
      </>
    ),
    mapButton: 'Konum için tıklayınız',
    mapAlt: 'Kroki: SHGM Türk Sivil Havacılık Akademisi, Yeni Havaalanı Caddesi üzerinde, Atatürk Havalimanı metro durağının kuzeydoğusunda',
    mapCaption: 'Kroki – haritada açmak için tıklayınız'
  },
  stay: {
    tag: 'Konaklama',
    heading: 'Anlaşmalı otel',
    lead: 'İstanbul dışından gelecek katılımcılarımız için anlaşmalı otelimiz ve özel fiyatları aşağıdadır.',
    roomType: 'Oda Tipi',
    single: 'Tek Kişi',
    double: 'İki Kişi',
    currencyNote: 'Fiyatlar Euro (€) cinsindendir.',
    website: 'Otelin web sitesi'
  },
  footer: { copyright: '© 2026 TALPA – Türkiye Havayolu Pilotları Derneği' }
};

const en: HomeCopy = {
  switchTo: { href: '/', label: 'TR', aria: 'Türkçe sayfaya geç' },
  logoSub: 'Flight Safety Forum',
  topAria: 'Back to top',
  nav: { forum: 'Forum', speakers: 'Speakers', program: 'Programme', venue: 'Date & Venue', travel: 'Getting There', stay: 'Accommodation', register: 'Register' },
  hero: {
    edition: '2nd TALPA',
    title: 'Flight Safety Forum',
    subtitle: 'and TALPA-MDA Session',
    tagline: 'We cordially invite you to attend the TALPA Flight Safety Forum.',
    month: 'DECEMBER',
    venue: 'Turkish DGCA (SHGM) Civil Aviation Academy, Istanbul',
    start: 'Starts at 08:45',
    cta: 'Register Now',
    ctaProgram: 'View Programme'
  },
  about: {
    tag: 'Invitation',
    heading: 'Together we safeguard flight safety, and together we keep it at the highest level.',
    paragraphs: [
      <>
        TALPA – Turkish Airline Pilots’ Association is honoured to invite you to the{' '}
        {strong('2nd TALPA Flight Safety Forum and TALPA-MDA Session')}, where current developments in flight safety,
        industry risks and proposed solutions will be addressed by national and international experts.
      </>,
      'Over the two days, the forum will examine not only the technical and operational dimensions of flight safety, but also its significance for human factors, organisational culture, psychological well-being and sustainable safety management.'
    ],
    quote: '“Flight safety is strengthened not only by compliance with rules, but by trust, shared responsibility, a scientific approach and continuous learning.”',
    posterAlt: '2nd TALPA Flight Safety Forum poster – 1-2 December 2026, Turkish DGCA (SHGM) Civil Aviation Academy',
    posterDownload: 'Download poster'
  },
  speakers: {
    heading: 'Speakers',
    image: {
      src: '/speakers-en.jpg',
      alt: 'Speakers: Capt. Juan Carlos LOZANO (Former ECA Tech. Director, Former IFALPA Deputy President), Prof. Dr. Murat EFE (Ankara University), Prof. Dr. Michael FELUX (Zurich University of Applied Sciences), Dr. Okuary OSECHAS (Zurich University of Applied Sciences), Capt. Melih YARARCAN (Pegasus Airlines), Psych. Simay LEBLEBİCİ (TALPA MDA Program Psychologist), Capt. Muharrem GÜNDOĞAN (TALPA MDA Program Supervisor), Capt. Bülent ATAŞ (Turkish Airlines), Nedim YARDIMCI (Turkish Airlines), Buğra IŞIK (Turkish Airlines), Capt. Muhammet E. AKIN (SunExpress), Özcan ÇETİN (SunExpress). Moderator: Plt. Merve BAŞARAN (ECA Flight Standards and Operations Working Group Chair).'
    },
    openHint: 'Click on the image to view it full size.'
  },
  program: {
    tag: 'Programme',
    heading: 'TALPA Flight Safety Forum Programme, 1-2 December',
    pages: [
      { src: '/program-en-1.jpg', alt: 'Day 1 programme – Tuesday, 1 December 2026' },
      { src: '/program-en-2-r2.jpg', alt: 'Day 2 programme – Wednesday, 2 December 2026' }
    ],
    openHint: 'Click on a page to view it full size.'
  },
  venue: {
    date: { label: 'Date', value: '1–2 December 2026', sub: 'Tuesday – Wednesday' },
    time: { label: 'Time', value: '08:45', sub: 'Opens with registration and welcome' },
    place: { label: 'Venue', value: 'Turkish DGCA (SHGM) Civil Aviation Academy', sub: 'Istanbul' },
    mapLink: 'Click for location'
  },
  register: {
    tag: 'Registration',
    heading: 'Register to attend',
    lead: 'Once your registration has been received, event information will be sent to your e-mail address.',
    note: 'If more than one person from your organisation will attend, each participant must register separately.'
  },
  travel: {
    tag: 'Getting there',
    heading: 'Getting to the venue',
    addressLabel: 'Turkish DGCA (SHGM) Civil Aviation Academy – address:',
    car: 'Open-air parking is available for participants arriving by car.',
    metro: (
      <>
        Participants using public transport can take the {strong('M1A metro line')} and get off at{' '}
        {strong('Atatürk Havalimanı (Atatürk Airport)')} station.
      </>
    ),
    mapButton: 'Click for location',
    mapAlt: 'Map: Turkish DGCA (SHGM) Civil Aviation Academy on Yeni Havaalanı Caddesi, north-east of the Atatürk Airport metro station',
    mapCaption: 'Map – click to open in Google Maps'
  },
  stay: {
    tag: 'Accommodation',
    heading: 'Partner hotel',
    lead: 'For participants travelling from outside Istanbul, our partner hotel and its special rates are listed below.',
    roomType: 'Room type',
    single: 'Single',
    double: 'Double',
    currencyNote: 'Rates are in euros (€).',
    website: 'Hotel website'
  },
  footer: { copyright: '© 2026 TALPA – Turkish Airline Pilots’ Association' }
};

export const HOME_COPY: Record<Lang, HomeCopy> = { tr, en };
