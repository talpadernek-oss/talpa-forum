import { EVENT, siteUrl } from './constants';
import type { Lang } from './messages';

/**
 * Calendar entry for the forum: both days 08:45–16:30 Istanbul time (UTC+3, no DST),
 * as a daily event repeated twice. Times are given in UTC so no VTIMEZONE block is needed.
 */
const START_UTC = '20261201T054500Z';
const END_UTC = '20261201T133000Z';
const RRULE = 'FREQ=DAILY;COUNT=2';

export const VENUE_TEXT = {
  tr: { name: EVENT.venue, address: EVENT.address },
  en: {
    name: 'Turkish DGCA (SHGM) Civil Aviation Academy',
    address: 'Yeşilköy Mahallesi, Yeni Havaalanı Caddesi, No: 7, Bakırköy / Istanbul (next to DHMİ Gate A)'
  }
} as const;

const TEXT = {
  tr: {
    title: '2. TALPA Uçuş Emniyet Forumu ve MDA Oturumu',
    details: (url: string) => `1–2 Aralık 2026, her iki gün 08:45–16:30.\nProgram: ${url}#program`
  },
  en: {
    title: '2nd TALPA Flight Safety Forum and MDA Session',
    details: (url: string) => `1–2 December 2026, both days 08:45–16:30.\nProgramme: ${url}#program`
  }
} as const;

const location = (lang: Lang) => `${VENUE_TEXT[lang].name}, ${VENUE_TEXT[lang].address}`;

/** Public URL of the .ics file (src/app/takvim.ics/route.ts). */
export const icsUrl = (lang: Lang) => `${siteUrl(lang)}takvim.ics${lang === 'en' ? '?lang=en' : ''}`;

export function calendarLinks(lang: Lang) {
  const t = TEXT[lang];
  const google =
    'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE',
      text: t.title,
      dates: `${START_UTC}/${END_UTC}`,
      details: t.details(siteUrl(lang)),
      location: location(lang),
      ctz: 'Europe/Istanbul',
      recur: `RRULE:${RRULE}`
    }).toString();
  // Outlook (desktop, web and mobile) and Apple Calendar both open the .ics file, which keeps both days.
  const ics = icsUrl(lang);
  return { google, outlook: ics, ics };
}

/** RFC 5545 text escaping and 75-octet line folding. */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

function fold(line: string) {
  const out: string[] = [];
  let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch, 'utf8') > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
    }
    cur += ch;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function icsFile(lang: Lang) {
  const t = TEXT[lang];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TALPA//Ucus Emniyet Forumu//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:talpa-ucus-emniyet-forumu-2026-${lang}@talpa.org`,
    'DTSTAMP:20261128T000000Z',
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `RRULE:${RRULE}`,
    `SUMMARY:${esc(t.title)}`,
    `LOCATION:${esc(location(lang))}`,
    `DESCRIPTION:${esc(t.details(siteUrl(lang)))}`,
    `URL:${siteUrl(lang)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(t.title)}`,
    'TRIGGER:-PT12H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
