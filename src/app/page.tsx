import Image from 'next/image';
import {
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Satellite,
  BedDouble,
  ArrowRight,
  Download,
  Instagram,
  Linkedin,
  Globe
} from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import { EVENT } from '@/lib/constants';

const UNITS = [
  'Uçuş İşletme',
  'Uçuş Emniyeti',
  'İnsan Kaynakları',
  'Eğitim',
  'Ekip Planlama',
  'Kalite',
  'Risk Yönetimi',
  'İlgili diğer birimler'
];

function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image src="/talpa-logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
      <span className="leading-tight">
        <span className="block text-[15px] font-extrabold tracking-wide">TALPA</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] opacity-70">Uçuş Emniyet Forumu</span>
      </span>
    </span>
  );
}

function SessionCard({
  icon: Icon,
  tag,
  title,
  children
}: {
  icon: typeof ShieldCheck;
  tag?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-card sm:p-7">
      <div className="mb-4 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forum-mist text-forum-blue">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          {tag && <p className="text-xs font-bold uppercase tracking-[0.14em] text-forum-ember">{tag}</p>}
          <h4 className="text-lg font-bold leading-snug text-forum-navy">{title}</h4>
        </div>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-slate-600">{children}</div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------- Header ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-forum-ink/80 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" aria-label="Sayfa başı">
            <Logo />
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/80 md:flex">
            <a href="#forum" className="hover:text-white">Forum</a>
            <a href="#program" className="hover:text-white">Program</a>
            <a href="#katilim" className="hover:text-white">Kimler Katılmalı</a>
            <a href="#mekan" className="hover:text-white">Tarih & Mekân</a>
          </nav>
          <a href="#kayit" className="btn-primary px-4 py-2 text-sm">
            Kayıt Ol
          </a>
        </div>
      </header>

      <main id="top">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-forum-ink text-white">
          {/* Top of the poster = photo only; the baked-in poster text stays out of frame. */}
          <div className="absolute inset-x-0 top-0 aspect-[950/520] w-full">
            <Image
              src="/forum-afis.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forum-ink/30 via-forum-ink/40 to-forum-ink" />
            <div className="absolute inset-0 bg-gradient-to-r from-forum-ink/85 via-forum-ink/35 to-transparent" />
          </div>
          <div className="dot-grid absolute bottom-0 right-0 h-72 w-1/2 opacity-40 [mask-image:linear-gradient(to_top_left,black,transparent)]" />

          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:pb-28 lg:pt-48">
            <p className="text-2xl font-normal tracking-wide sm:text-3xl">{EVENT.edition}</p>
            <h1 className="mt-1 max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Uçuş Emniyet Forumu
            </h1>
            <p className="mt-3 text-lg font-semibold text-forum-sunset sm:text-xl">{EVENT.subtitle}</p>
            <p className="mt-6 max-w-xl text-base italic leading-relaxed text-white/80 sm:text-lg">
              TALPA Uçuş Emniyet Forumu’na katılımınızı saygılarımızla arz ederiz.
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex items-center gap-4">
                <span className="text-6xl font-extrabold leading-none tracking-tighter sm:text-7xl">1-2</span>
                <span className="h-14 w-px bg-white/60" />
                <span className="leading-tight">
                  <span className="block text-2xl font-extrabold">ARALIK</span>
                  <span className="block text-2xl font-light tracking-[0.3em]">2026</span>
                </span>
              </div>
              <ul className="space-y-2 text-[15px] text-white/85">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-5 w-5 shrink-0 text-forum-sky" aria-hidden />
                  {EVENT.venue}, {EVENT.city}
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 shrink-0 text-forum-sky" aria-hidden />
                  Başlangıç {EVENT.startTime}
                </li>
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#kayit" className="btn-primary px-7 py-3.5 text-base">
                Hemen Kayıt Ol <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#program"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Programı İncele
              </a>
            </div>
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="forum" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">Davet</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">
                Uçuş emniyetini birlikte konuşuyoruz
              </h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-slate-600">
                <p>
                  TALPA – Türkiye Havayolu Pilotları Derneği olarak, uçuş emniyetine ilişkin güncel gelişmelerin, sektörel
                  risklerin ve çözüm önerilerinin ulusal ve uluslararası uzmanların katılımıyla ele alınacağı{' '}
                  <strong className="text-forum-navy">TALPA 2. Uçuş Emniyet Forumu ve TALPA-MDA Oturumu</strong>’na
                  sizleri davet etmekten onur duyarız.
                </p>
                <p>
                  İki gün sürecek etkinliğimizde, uçuş emniyetinin yalnızca teknik ve operasyonel boyutları değil; insan
                  faktörü, kurumsal kültür, psikolojik esenlik ve sürdürülebilir emniyet yönetimi açısından taşıdığı önem
                  de değerlendirilecektir.
                </p>
              </div>
              <blockquote className="mt-8 border-l-4 border-forum-sunset pl-5 text-lg font-semibold italic leading-relaxed text-forum-navy">
                “Uçuş emniyeti, yalnızca kurallara uyumla değil; güven, ortak sorumluluk, bilimsel yaklaşım ve sürekli
                öğrenmeyle güçlenir.”
              </blockquote>
            </div>
            <figure className="mx-auto w-full max-w-sm">
              <a href="/forum-afis.jpg" target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-200">
                <Image
                  src="/forum-afis.jpg"
                  alt="2. TALPA Uçuş Emniyet Forumu afişi – 1-2 Aralık 2026, SHGM Türk Sivil Havacılık Akademisi, 09.00"
                  width={950}
                  height={1350}
                  sizes="(min-width: 1024px) 384px, 90vw"
                  className="h-auto w-full"
                />
              </a>
              <figcaption className="mt-3 flex justify-center">
                <a href="/forum-afis.jpg" download className="inline-flex items-center gap-2 text-sm font-semibold text-forum-blue hover:underline">
                  <Download className="h-4 w-4" aria-hidden /> Afişi indir
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Program ---------- */}
        <section id="program" className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">Program</p>
            <h2 className="mt-2 text-3xl font-extrabold text-forum-navy sm:text-4xl">İki gün, dört ana başlık</h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-8">
              <div>
                <DayHeading day="1" weekday="Salı" />
                <div className="space-y-6">
                  <SessionCard icon={ShieldCheck} title="Positive Safety Culture (Pozitif Emniyet Kültürü)">
                    <p>
                      Uçuş emniyetinin temelinde yer alan güven ortamı, adil kültür (Just Culture), psikolojik güvenlik,
                      şeffaf raporlama ve kurumsal hesap verebilirlik konuları ele alınacaktır.
                    </p>
                    <p>
                      Pozitif Emniyet Kültürü’nün yalnızca Emniyet Yönetim Sistemi’nin (SMS) bir unsuru değil, üst yönetim
                      tarafından sahiplenilen ve tüm kuruma yayılan bir yönetim anlayışı olarak geliştirilmesi
                      tartışılacaktır.
                    </p>
                  </SessionCard>
                  <SessionCard
                    icon={HeartHandshake}
                    tag="TALPA-MDA · Meslektaş Destek Programı"
                    title="Havacılıkta Ruh Sağlığı, Esenlik ve Uçuş Emniyeti: Farkındalıktan Akran Desteğine"
                  >
                    <p>
                      Havacılık çalışanlarının ruh sağlığı ve psikolojik esenliğinin uçuş emniyetindeki öneminin ele
                      alınacağı oturumda; Flight Safety Foundation ve European Cockpit Association (ECA) yaklaşımları, farklı
                      uçuş operasyonlarında karşılaşılan iş yükü, stres ve psikososyal riskler değerlendirilecektir.
                    </p>
                    <p>
                      Ayrıca, TALPA-MDA Akran Destek Programı kapsamında edinilen deneyimler, akran destek gönüllülerinin
                      yetkinlikleri, güven, gizlilik ve etik ilkeler ile sürdürülebilir bir destek kültürünün geliştirilmesine
                      yönelik kurumsal iş birliği ele alınacaktır.
                    </p>
                  </SessionCard>
                </div>
              </div>

              <div>
                <DayHeading day="2" weekday="Çarşamba" />
                <div className="space-y-6">
                  <SessionCard icon={Satellite} title="GNSS/GPS ve TCAS Spoofing & Jamming">
                    <p>
                      Uydu tabanlı seyrüsefer sistemlerine yönelik kasıtlı sinyal bozma ve yanıltma girişimlerinin uçuş
                      operasyonları, seyrüsefer güvenilirliği ve hava trafik sistemleri üzerindeki etkileri
                      değerlendirilecektir.
                    </p>
                    <p>
                      Özellikle GNSS kaynaklı yanıltıcı verilerin uçak sistemleri ve TCAS üzerindeki olası etkileri,
                      operasyonel riskler ve alınabilecek önlemler ele alınacaktır.
                    </p>
                  </SessionCard>
                  <SessionCard icon={BedDouble} title="FTL ve Fatigue Risk Management System (FRMS)">
                    <p>
                      Uçuş ve görev süresi sınırlamalarının (FTL), bilimsel yorgunluk yönetimi ilkeleriyle birlikte
                      değerlendirilmesi; görev planlaması, dinlenme süreleri, sirkadiyen ritim ve birikimli yorgunluğun uçuş
                      emniyetine etkileri tartışılacaktır.
                    </p>
                    <p>
                      Düzenleyici gerekliliklerin ötesine geçen, veriye dayalı ve proaktif bir Bitkinlik Risk Yönetim
                      Sistemi’nin geliştirilmesine yönelik yaklaşımlar ele alınacaktır.
                    </p>
                  </SessionCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Who should attend ---------- */}
        <section id="katilim" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">Kimler katılmalı</p>
                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">
                  Kurumunuzun ilgili tüm birimlerini bekliyoruz
                </h2>
                <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-slate-600">
                  <p>
                    Bu anlayış doğrultusunda, kurumunuzun uçuş işletme, uçuş emniyeti, insan kaynakları, eğitim, ekip
                    planlama, kalite, risk yönetimi ve ilgili diğer birimlerinden temsilcilerin forumumuza katılımını
                    özellikle önemsiyoruz.
                  </p>
                  <p>
                    Bilgi ve deneyimlerin paylaşılacağı, sektörümüzün geleceğine yönelik ortak çözüm önerilerinin
                    geliştirileceği bu önemli buluşmada sizleri aramızda görmekten memnuniyet duyacağız.
                  </p>
                </div>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {UNITS.map(u => (
                  <li key={u} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-semibold text-forum-navy">
                    <span className="h-2 w-2 rounded-full bg-forum-blue" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Date & venue ---------- */}
        <section id="mekan" className="relative overflow-hidden bg-forum-navy py-16 text-white">
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
            {[
              { icon: CalendarDays, label: 'Tarih', value: '1–2 Aralık 2026', sub: 'Salı – Çarşamba' },
              { icon: Clock, label: 'Saat', value: EVENT.startTime, sub: 'Kayıt ve karşılama ile başlar' },
              { icon: MapPin, label: 'Mekân', value: EVENT.venue, sub: EVENT.city }
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <Icon className="h-6 w-6 text-forum-sunset" aria-hidden />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-white/60">{label}</p>
                <p className="mt-1 text-xl font-bold leading-snug">{value}</p>
                <p className="mt-1 text-sm text-white/70">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Registration ---------- */}
        <section id="kayit" className="bg-gradient-to-b from-slate-50 to-forum-mist py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">Kayıt</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">Katılım başvurusu</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-slate-600">
                Forumumuza katılım için formu doldurmanız yeterlidir. Kaydınız alındıktan sonra etkinlikle ilgili
                bilgilendirmeler e-posta adresinize iletilecektir.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
                Kurumunuzdan birden fazla kişi katılacaksa her katılımcının ayrı kayıt yapması gerekir.
              </p>
            </div>
            <RegistrationForm />
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-forum-ink py-10 text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm sm:px-6 md:flex-row">
          <Logo className="text-white" />
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href={EVENT.instagram} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-white">
              <Instagram className="h-4 w-4" aria-hidden /> talpa_org
            </a>
            <a href={EVENT.linkedin} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-white">
              <Linkedin className="h-4 w-4" aria-hidden /> TALPA
            </a>
            <a href={EVENT.website} target="_blank" rel="noopener" className="flex items-center gap-1.5 font-semibold text-white hover:underline">
              <Globe className="h-4 w-4" aria-hidden /> www.talpa.org
            </a>
          </div>
          <p className="text-center text-xs text-white/50">© 2026 TALPA – Türkiye Havayolu Pilotları Derneği</p>
        </div>
      </footer>
    </>
  );
}

function DayHeading({ day, weekday }: { day: string; weekday: string }) {
  return (
    <div className="mb-6 flex items-end gap-4">
      <span className="text-6xl font-extrabold leading-none text-forum-navy">{day}</span>
      <span className="pb-1 leading-tight">
        <span className="block text-sm font-bold uppercase tracking-[0.16em] text-forum-blue">Aralık 2026</span>
        <span className="block text-lg font-semibold text-slate-500">{weekday}</span>
      </span>
    </div>
  );
}
