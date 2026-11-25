import Image from 'next/image';
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  Instagram,
  Linkedin,
  Globe,
  ExternalLink,
  Car,
  TrainFront,
  Languages
} from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import { EVENT, HOTEL, siteUrl } from '@/lib/constants';
import { HOME_COPY } from '@/content/home';
import type { Lang } from '@/lib/messages';

function Logo({ sub, className = '' }: { sub: string; className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image src="/talpa-logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
      <span className="leading-tight">
        <span className="block text-[15px] font-extrabold tracking-wide">TALPA</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] opacity-70">{sub}</span>
      </span>
    </span>
  );
}

export default function HomePage({ lang }: { lang: Lang }) {
  const t = HOME_COPY[lang];
  // In production the other language lives on its own domain; "/" on the English domain is the English page.
  const switchHref = process.env.VERCEL_ENV === 'production' ? siteUrl(lang === 'tr' ? 'en' : 'tr') : t.switchTo.href;

  return (
    // Root layout is Turkish; marking the English page keeps screen readers and translators right.
    <div lang={lang}>
      {/* ---------- Header ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-forum-ink/80 text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#top" aria-label={t.topAria}>
            <Logo sub={t.logoSub} />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 xl:flex">
            <a href="#forum" className="hover:text-white">{t.nav.forum}</a>
            <a href="#konusmacilar" className="hover:text-white">{t.nav.speakers}</a>
            <a href="#program" className="hover:text-white">{t.nav.program}</a>
            <a href="#mekan" className="hover:text-white">{t.nav.venue}</a>
            <a href="#ulasim" className="hover:text-white">{t.nav.travel}</a>
            <a href="#konaklama" className="hover:text-white">{t.nav.stay}</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={switchHref}
              hrefLang={t.switchTo.label.toLowerCase()}
              aria-label={t.switchTo.aria}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Languages className="h-4 w-4" aria-hidden /> {t.switchTo.label}
            </a>
            <a href="#kayit" className="btn-primary px-4 py-2 text-sm">
              {t.nav.register}
            </a>
          </div>
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
            <p className="text-2xl font-normal tracking-wide sm:text-3xl">{t.hero.edition}</p>
            <h1 className="mt-1 max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-3 text-lg font-semibold text-forum-sunset sm:text-xl">{t.hero.subtitle}</p>
            <p className="mt-6 max-w-xl text-base italic leading-relaxed text-white/80 sm:text-lg">{t.hero.tagline}</p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="flex items-center gap-4">
                <span className="text-6xl font-extrabold leading-none tracking-tighter sm:text-7xl">1-2</span>
                <span className="h-14 w-px bg-white/60" />
                <span className="leading-tight">
                  <span className="block text-2xl font-extrabold">{t.hero.month}</span>
                  <span className="block text-2xl font-light tracking-[0.3em]">2026</span>
                </span>
              </div>
              <ul className="space-y-2 text-[15px] text-white/85">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-5 w-5 shrink-0 text-forum-sky" aria-hidden />
                  {t.hero.venue}
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 shrink-0 text-forum-sky" aria-hidden />
                  {t.hero.start}
                </li>
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#kayit" className="btn-primary px-7 py-3.5 text-base">
                {t.hero.cta} <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="#program"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                {t.hero.ctaProgram}
              </a>
            </div>
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="forum" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            {/* Kept to a readable line length now that the poster column is gone. */}
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">{t.about.tag}</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">{t.about.heading}</h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-slate-600">
                {t.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <blockquote className="mt-8 border-l-4 border-forum-sunset pl-5 text-lg font-semibold italic leading-relaxed text-forum-navy">
                {t.about.quote}
              </blockquote>
            </div>
          </div>
        </section>

        {/* ---------- Speakers ---------- */}
        <section id="konusmacilar" className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-forum-navy sm:text-4xl">{t.speakers.heading}</h2>
            <a href={t.speakers.image.src} target="_blank" rel="noopener"
              className="mt-10 block overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-200 transition hover:ring-forum-blue/50">
              <Image
                src={t.speakers.image.src}
                alt={t.speakers.image.alt}
                width={3840}
                height={2160}
                sizes="(min-width: 1152px) 1104px, 100vw"
                className="h-auto w-full"
              />
            </a>
            <p className="mt-4 text-center text-sm text-slate-500">{t.speakers.openHint}</p>
          </div>
        </section>

        {/* ---------- Program ---------- */}
        <section id="program" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">{t.program.tag}</p>
            <h2 className="mt-2 text-3xl font-extrabold text-forum-navy sm:text-4xl">{t.program.heading}</h2>

            {/* Both pages have the same aspect ratio, so side by side they line up exactly. */}
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {t.program.pages.map(page => (
                <a key={page.src} href={page.src} target="_blank" rel="noopener"
                  className="block overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-200 transition hover:ring-forum-blue/50">
                  <Image
                    src={page.src}
                    alt={page.alt}
                    width={2382}
                    height={3369}
                    sizes="(min-width: 1152px) 544px, (min-width: 768px) 48vw, 100vw"
                    className="h-auto w-full"
                  />
                </a>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">{t.program.openHint}</p>
          </div>
        </section>

        {/* ---------- Date & venue ---------- */}
        <section id="mekan" className="relative overflow-hidden bg-forum-navy py-16 text-white">
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-3">
            {[
              { icon: CalendarDays, ...t.venue.date, href: '' },
              { icon: Clock, ...t.venue.time, href: '' },
              { icon: MapPin, ...t.venue.place, href: EVENT.mapsUrl }
            ].map(({ icon: Icon, label, value, sub, href }) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                {/* The icon stands in for the visible label. */}
                <Icon className="h-6 w-6 text-forum-sunset" aria-label={label} />
                <p className="mt-4 text-xl font-bold leading-snug">{value}</p>
                <p className="mt-1 text-sm text-white/70">{sub}</p>
                {href && (
                  <a href={href} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forum-sunset hover:underline">
                    {t.venue.mapLink} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Registration ---------- */}
        <section id="kayit" className="bg-gradient-to-b from-slate-50 to-forum-mist py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">{t.register.tag}</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">{t.register.heading}</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-slate-600">{t.register.lead}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{t.register.note}</p>
            </div>
            <RegistrationForm lang={lang} />
          </div>
        </section>

        {/* ---------- Getting there ---------- */}
        <section id="ulasim" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">{t.travel.tag}</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">{t.travel.heading}</h2>
              <div className="mt-6 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forum-mist text-forum-blue">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-[17px] leading-relaxed text-slate-600">
                  <strong className="block text-forum-navy">{t.travel.addressLabel}</strong>
                  {/* Postal address stays in Turkish in both languages. */}
                  <span lang="tr">{EVENT.address}</span>
                </p>
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forum-mist text-forum-blue">
                  <Car className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-[17px] leading-relaxed text-slate-600">{t.travel.car}</p>
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forum-mist text-forum-blue">
                  <TrainFront className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-[17px] leading-relaxed text-slate-600">{t.travel.metro}</p>
              </div>
              <a href={EVENT.mapsUrl} target="_blank" rel="noopener" className="btn-navy mt-8 inline-flex">
                <MapPin className="h-4 w-4" aria-hidden /> {t.travel.mapButton}
              </a>
            </div>
            <figure>
              <a href={EVENT.mapsUrl} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl shadow-card ring-1 ring-slate-200">
                <Image
                  src="/ulasim-kroki.png"
                  alt={t.travel.mapAlt}
                  width={1052}
                  height={710}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className="h-auto w-full"
                />
              </a>
              <figcaption className="mt-3 text-center text-sm text-slate-500">{t.travel.mapCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Accommodation ---------- */}
        <section id="konaklama" className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-forum-ember">{t.stay.tag}</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-forum-navy sm:text-4xl">{t.stay.heading}</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-slate-600">{t.stay.lead}</p>
              {/* The logo is white on transparent, so it needs the dark card. */}
              <div className="mt-8 rounded-2xl bg-forum-navy p-8 shadow-card">
                <Image src={HOTEL.logo} alt={HOTEL.name} width={773} height={244} className="mx-auto h-auto w-full max-w-[260px]" />
                <a href={HOTEL.url} target="_blank" rel="noopener"
                  className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-forum-sunset hover:underline">
                  {t.stay.website}: cpistanbulflorya.com <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>
            <div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-forum-navy text-xs font-semibold uppercase tracking-wide text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 sm:px-5">{t.stay.roomType}</th>
                      <th scope="col" className="whitespace-nowrap px-3 py-3 text-right sm:px-5">{t.stay.single}</th>
                      <th scope="col" className="whitespace-nowrap px-3 py-3 text-right sm:px-5">{t.stay.double}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {HOTEL.rooms.map(r => (
                      <tr key={r.tr} className="align-top">
                        <th scope="row" className="px-4 py-4 font-normal sm:px-5">
                          <span className="block font-semibold text-forum-navy">{r[lang]}</span>
                          {/* The hotel's own bed description, in English for both pages. */}
                          <span lang="en" className="mt-0.5 block text-xs text-slate-500">{r.beds}</span>
                        </th>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-base font-bold text-forum-navy sm:px-5">€ {r.single}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-right text-base font-bold text-forum-navy sm:px-5">€ {r.double}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-slate-500">{t.stay.currencyNote}</p>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-forum-ink py-10 text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm sm:px-6 md:flex-row">
          <Logo sub={t.logoSub} className="text-white" />
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
          <p className="text-center text-xs text-white/50">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
