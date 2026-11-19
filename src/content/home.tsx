import type { ReactNode } from 'react';
import type { Lang } from '@/lib/messages';

/** Every visible text of the home page, per language. Layout lives in components/HomePage.tsx. */
export interface HomeCopy {
  /** Link to the same page in the other language. */
  switchTo: { href: string; label: string; aria: string };
  logoSub: string;
  topAria: string;
  nav: { forum: string; program: string; attend: string; venue: string; travel: string; stay: string; register: string };
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
  program: {
    tag: string;
    heading: string;
    month: string;
    days: { weekday: string; sessions: { tag?: string; title: string; paragraphs: string[] }[] }[];
  };
  attend: { tag: string; heading: string; paragraphs: string[]; units: string[] };
  venue: {
    date: { label: string; value: string; sub: string };
    time: { label: string; value: string; sub: string };
    place: { label: string; value: string; sub: string };
    mapLink: string;
  };
  register: { tag: string; heading: string; lead: string; note: string; dayOffNotice: boolean };
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
  nav: { forum: 'Forum', program: 'Program', attend: 'Kimler Katılmalı', venue: 'Tarih & Mekân', travel: 'Ulaşım', stay: 'Konaklama', register: 'Kayıt Ol' },
  hero: {
    edition: '2. TALPA',
    title: 'Uçuş Emniyet Forumu',
    subtitle: 've TALPA-MDA Oturumu',
    tagline: 'TALPA Uçuş Emniyet Forumu’na katılımınızı saygılarımızla arz ederiz.',
    month: 'ARALIK',
    venue: 'SHGM Türk Sivil Havacılık Akademisi, İstanbul',
    start: 'Başlangıç 09.00',
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
    posterAlt: '2. TALPA Uçuş Emniyet Forumu afişi – 1-2 Aralık 2026, SHGM Türk Sivil Havacılık Akademisi, 09.00',
    posterDownload: 'Afişi indir'
  },
  program: {
    tag: 'Program',
    heading: 'İki gün, dört ana başlık',
    month: 'Aralık 2026',
    days: [
      {
        weekday: 'Salı',
        sessions: [
          {
            title: 'Positive Safety Culture (Pozitif Emniyet Kültürü)',
            paragraphs: [
              'Uçuş emniyetinin temelinde yer alan güven ortamı, adil kültür (Just Culture), psikolojik güvenlik, şeffaf raporlama ve kurumsal hesap verebilirlik konuları ele alınacaktır.',
              'Pozitif Emniyet Kültürü’nün yalnızca Emniyet Yönetim Sistemi’nin (SMS) bir unsuru değil, üst yönetim tarafından sahiplenilen ve tüm kuruma yayılan bir yönetim anlayışı olarak geliştirilmesi tartışılacaktır.'
            ]
          },
          {
            tag: 'TALPA-MDA · Meslektaş Destek Programı',
            title: 'Havacılıkta Ruh Sağlığı, Esenlik ve Uçuş Emniyeti: Farkındalıktan Akran Desteğine',
            paragraphs: [
              'Havacılık çalışanlarının ruh sağlığı ve psikolojik esenliğinin uçuş emniyetindeki öneminin ele alınacağı oturumda; Flight Safety Foundation ve European Cockpit Association (ECA) yaklaşımları, farklı uçuş operasyonlarında karşılaşılan iş yükü, stres ve psikososyal riskler değerlendirilecektir.',
              'Ayrıca, TALPA-MDA Akran Destek Programı kapsamında edinilen deneyimler, akran destek gönüllülerinin yetkinlikleri, güven, gizlilik ve etik ilkeler ile sürdürülebilir bir destek kültürünün geliştirilmesine yönelik kurumsal iş birliği ele alınacaktır.'
            ]
          }
        ]
      },
      {
        weekday: 'Çarşamba',
        sessions: [
          {
            title: 'GNSS/GPS ve TCAS Spoofing & Jamming',
            paragraphs: [
              'Uydu tabanlı seyrüsefer sistemlerine yönelik kasıtlı sinyal bozma ve yanıltma girişimlerinin uçuş operasyonları, seyrüsefer güvenilirliği ve hava trafik sistemleri üzerindeki etkileri değerlendirilecektir.',
              'Özellikle GNSS kaynaklı yanıltıcı verilerin uçak sistemleri ve TCAS üzerindeki olası etkileri, operasyonel riskler ve alınabilecek önlemler ele alınacaktır.'
            ]
          },
          {
            title: 'FTL ve Fatigue Risk Management System (FRMS)',
            paragraphs: [
              'Uçuş ve görev süresi sınırlamalarının (FTL), bilimsel yorgunluk yönetimi ilkeleriyle birlikte değerlendirilmesi; görev planlaması, dinlenme süreleri, sirkadiyen ritim ve birikimli yorgunluğun uçuş emniyetine etkileri tartışılacaktır.',
              'Düzenleyici gerekliliklerin ötesine geçen, veriye dayalı ve proaktif bir Bitkinlik Risk Yönetim Sistemi’nin geliştirilmesine yönelik yaklaşımlar ele alınacaktır.'
            ]
          }
        ]
      }
    ]
  },
  attend: {
    tag: 'Kimler katılmalı',
    heading: 'Kurumunuzun ilgili tüm birimlerini bekliyoruz',
    paragraphs: [
      'Bu anlayış doğrultusunda, kurumunuzun uçuş işletme, uçuş emniyeti, insan kaynakları, eğitim, ekip planlama, kalite, risk yönetimi ve ilgili diğer birimlerinden temsilcilerin forumumuza katılımını özellikle önemsiyoruz.',
      'Bilgi ve deneyimlerin paylaşılacağı, sektörümüzün geleceğine yönelik ortak çözüm önerilerinin geliştirileceği bu önemli buluşmada sizleri aramızda görmekten memnuniyet duyacağız.'
    ],
    units: ['Uçuş İşletme', 'Uçuş Emniyeti', 'İnsan Kaynakları', 'Eğitim', 'Ekip Planlama', 'Kalite', 'Risk Yönetimi', 'İlgili diğer birimler']
  },
  venue: {
    date: { label: 'Tarih', value: '1–2 Aralık 2026', sub: 'Salı – Çarşamba' },
    time: { label: 'Saat', value: '09.00', sub: 'Kayıt ve karşılama ile başlar' },
    place: { label: 'Mekân', value: 'SHGM Türk Sivil Havacılık Akademisi', sub: 'İstanbul' },
    mapLink: 'Konum için tıklayınız'
  },
  register: {
    tag: 'Kayıt',
    heading: 'Katılım başvurusu',
    lead: 'Kaydınız alındıktan sonra etkinlikle ilgili bilgilendirmeler e-posta adresinize iletilecektir.',
    note: 'Kurumunuzdan birden fazla kişi katılacaksa her katılımcının ayrı kayıt yapması gerekir.',
    dayOffNotice: true
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
  nav: { forum: 'Forum', program: 'Programme', attend: 'Who Should Attend', venue: 'Date & Venue', travel: 'Getting There', stay: 'Accommodation', register: 'Register' },
  hero: {
    edition: '2nd TALPA',
    title: 'Flight Safety Forum',
    subtitle: 'and TALPA-MDA Session',
    tagline: 'We cordially invite you to attend the TALPA Flight Safety Forum.',
    month: 'DECEMBER',
    venue: 'Turkish DGCA (SHGM) Civil Aviation Academy, Istanbul',
    start: 'Starts at 09:00',
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
    posterAlt: '2nd TALPA Flight Safety Forum poster – 1-2 December 2026, Turkish DGCA (SHGM) Civil Aviation Academy, 09:00',
    posterDownload: 'Download poster'
  },
  program: {
    tag: 'Programme',
    heading: 'Two days, four key topics',
    month: 'December 2026',
    days: [
      {
        weekday: 'Tuesday',
        sessions: [
          {
            title: 'Positive Safety Culture',
            paragraphs: [
              'The session will address the foundations of flight safety: an environment of trust, Just Culture, psychological safety, open reporting and organisational accountability.',
              'It will discuss developing a Positive Safety Culture not merely as one element of the Safety Management System (SMS), but as a management approach owned by senior management and embedded across the entire organisation.'
            ]
          },
          {
            tag: 'TALPA-MDA · Peer Support Programme',
            title: 'Mental Health, Well-being and Flight Safety in Aviation: From Awareness to Peer Support',
            paragraphs: [
              'This session will address the importance of the mental health and psychological well-being of aviation personnel for flight safety, reviewing the approaches of the Flight Safety Foundation and the European Cockpit Association (ECA), as well as the workload, stress and psychosocial risks encountered across different types of flight operations.',
              'It will also cover the experience gained through the TALPA-MDA Peer Support Programme, the competencies of peer support volunteers, the principles of trust, confidentiality and ethics, and institutional cooperation towards a sustainable peer support culture.'
            ]
          }
        ]
      },
      {
        weekday: 'Wednesday',
        sessions: [
          {
            title: 'GNSS/GPS and TCAS Spoofing & Jamming',
            paragraphs: [
              'The session will assess the impact of intentional interference with, and spoofing of, satellite-based navigation systems on flight operations, navigation integrity and air traffic systems.',
              'In particular, it will address the potential effects of misleading GNSS data on aircraft systems and TCAS, the resulting operational risks and possible mitigation measures.'
            ]
          },
          {
            title: 'FTL and Fatigue Risk Management System (FRMS)',
            paragraphs: [
              'Flight Time Limitations (FTL) will be examined together with scientific principles of fatigue management, discussing rostering, rest periods, circadian rhythm and the effects of cumulative fatigue on flight safety.',
              'Approaches to developing a data-driven, proactive Fatigue Risk Management System that goes beyond regulatory requirements will be addressed.'
            ]
          }
        ]
      }
    ]
  },
  attend: {
    tag: 'Who should attend',
    heading: 'We welcome all relevant departments of your organisation',
    paragraphs: [
      'In this spirit, we particularly value the participation of representatives from your flight operations, flight safety, human resources, training, crew planning, quality, risk management and other relevant departments.',
      'We look forward to welcoming you to this important gathering, where knowledge and experience will be shared and joint solutions for the future of our industry will be developed.'
    ],
    units: ['Flight Operations', 'Flight Safety', 'Human Resources', 'Training', 'Crew Planning', 'Quality', 'Risk Management', 'Other relevant departments']
  },
  venue: {
    date: { label: 'Date', value: '1–2 December 2026', sub: 'Tuesday – Wednesday' },
    time: { label: 'Time', value: '09:00', sub: 'Opens with registration and welcome' },
    place: { label: 'Venue', value: 'Turkish DGCA (SHGM) Civil Aviation Academy', sub: 'Istanbul' },
    mapLink: 'Click for location'
  },
  register: {
    tag: 'Registration',
    heading: 'Register to attend',
    lead: 'Once your registration has been received, event information will be sent to your e-mail address.',
    note: 'If more than one person from your organisation will attend, each participant must register separately.',
    dayOffNotice: false
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
