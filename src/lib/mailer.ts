import 'server-only';
import nodemailer from 'nodemailer';
import { EVENT, siteUrl } from './constants';
import { calendarLinks, VENUE_TEXT } from './calendar';
import type { Lang } from './messages';

/**
 * E-mails to participants (SMTP_* env, see .env.example):
 * - registration received – sent automatically after the web form,
 * - participation confirmed – sent from the admin panel.
 * Without SMTP settings nothing is sent, so local development keeps working.
 */

const env = (key: string) => (process.env[key] || '').trim();

export const mailConfigured = () => Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'));

function transport() {
  const port = Number(env('SMTP_PORT')) || 587;
  return nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure: port === 465,
    // Port 587 (Office 365): plain connection upgraded with STARTTLS; refuse to send without it.
    requireTLS: port !== 465,
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const COPY = {
  tr: {
    fromName: 'TALPA Uçuş Emniyet Forumu',
    signOff: 'Saygılarımızla,',
    org: 'TALPA – Türkiye Havayolu Pilotları Derneği',
    edition: '2. TALPA',
    title: 'Uçuş Emniyet Forumu',
    when: '1–2 Aralık 2026 · SHGM Türk Sivil Havacılık Akademisi, İstanbul',
    received: {
      subject: '2. TALPA Uçuş Emniyet Forumu – Başvurunuz alındı',
      greeting: (name: string) => (name ? `Değerli Katılımcımız ${name},` : 'Değerli Katılımcımız,'),
      body: '2. TALPA Uçuş Emniyet Forumu’na gösterdiğiniz ilgi için teşekkür ederiz. Program içeriği katılım onayınız ile birlikte gönderilecektir.'
    },
    approved: {
      subject: '2. TALPA Uçuş Emniyet Forumu – Katılımınız onaylandı',
      greeting: (name: string) => (name ? `Değerli ${name},` : 'Değerli Katılımcımız,'),
      body: '2. TALPA Uçuş Emniyet Forumu ve MDA Oturumu’na katılımınız onaylanmıştır. Giriş kartınızı kayıt masasından alabilirsiniz.',
      date: 'Tarih',
      dateValue: '1–2 Aralık 2026',
      time: 'Saat',
      timeValue: '08:45',
      place: 'Konum',
      map: 'Haritada görüntüle',
      calendar: 'Takvime ekle',
      apple: 'Apple (iOS)',
      program: 'Program içeriğine ulaşmak için tıklayınız.',
      programButton: 'Program içeriği',
      signature: 'TALPA'
    }
  },
  en: {
    fromName: 'TALPA Flight Safety Forum',
    signOff: 'Kind regards,',
    org: 'TALPA – Turkish Airline Pilots’ Association',
    edition: '2nd TALPA',
    title: 'Flight Safety Forum',
    when: '1–2 December 2026 · Turkish DGCA (SHGM) Civil Aviation Academy, Istanbul',
    received: {
      subject: '2nd TALPA Flight Safety Forum – Registration received',
      greeting: (name: string) => (name ? `Dear ${name},` : 'Dear Participant,'),
      body: 'Thank you for your interest in the 2nd TALPA Flight Safety Forum. The programme will be sent to you together with your participation confirmation.'
    },
    approved: {
      subject: '2nd TALPA Flight Safety Forum – Participation confirmed',
      greeting: (name: string) => (name ? `Dear ${name},` : 'Dear Participant,'),
      body: 'Your participation in the 2nd TALPA Flight Safety Forum and MDA Session has been confirmed. You can collect your entry badge at the registration desk.',
      date: 'Date',
      dateValue: '1–2 December 2026',
      time: 'Time',
      timeValue: '08:45',
      place: 'Venue',
      map: 'View on map',
      calendar: 'Add to calendar',
      apple: 'Apple (iOS)',
      program: 'Click here to view the programme.',
      programButton: 'Programme',
      signature: 'TALPA'
    }
  }
} satisfies Record<Lang, unknown>;

/** Shared header / footer around the message content. */
function layout(lang: Lang, inner: string) {
  const c = COPY[lang];
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#e8f0fb;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0a2350;padding:22px 32px;color:#ffffff;">
<div style="font-size:14px;color:#c9d6ea;">${c.edition}</div>
<div style="font-size:22px;font-weight:800;text-transform:uppercase;">${c.title}</div>
<div style="font-size:14px;color:#f39a35;font-weight:700;margin-top:4px;">${c.when}</div>
</td></tr>
<tr><td style="padding:28px 32px;font-size:16px;line-height:26px;color:#334155;">
${inner}
</td></tr>
<tr><td style="background:#06142e;padding:16px 32px;font-size:13px;text-align:center;">
<a href="https://www.talpa.org" style="color:#ffffff;text-decoration:none;font-weight:700;">www.talpa.org</a>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

/** `name` empty → greeting without a name. */
function receivedMail(name: string, lang: Lang) {
  const c = COPY[lang];
  const greeting = c.received.greeting(name);
  const text = `${greeting}\n\n${c.received.body}\n\n${c.signOff}\n${c.org}\n`;
  const html = layout(
    lang,
    `<p style="margin:0 0 16px;font-weight:700;color:#0a2350;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">${c.received.body}</p>
<p style="margin:0;">${c.signOff}<br><strong style="color:#0a2350;">${c.org}</strong></p>`
  );
  return { subject: c.received.subject, text, html };
}

function approvedMail(name: string, lang: Lang) {
  const a = COPY[lang].approved;
  const venue = VENUE_TEXT[lang];
  const greeting = a.greeting(name);
  const programUrl = `${siteUrl(lang)}#program`;
  const cal = calendarLinks(lang);

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;font-weight:700;color:#0a2350;white-space:nowrap;vertical-align:top;">${label}:</td><td style="padding:4px 0;">${value}</td></tr>`;
  const calButton = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #0a2350;border-radius:8px;color:#0a2350;font-size:14px;font-weight:700;text-decoration:none;">${label}</a>`;

  const html = layout(
    lang,
    `<p style="margin:0 0 16px;font-weight:700;color:#0a2350;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 20px;">${a.body}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;font-size:15px;line-height:22px;">
${row(a.date, a.dateValue)}
${row(a.time, a.timeValue)}
${row(a.place, `${venue.name}<br>${venue.address}<br><a href="${EVENT.mapsUrl}" style="color:#1d5bbf;font-weight:700;">${a.map}</a>`)}
</table>
<p style="margin:0 0 8px;font-weight:700;color:#0a2350;">${a.calendar}:</p>
<p style="margin:0 0 20px;">${calButton(cal.outlook, 'Outlook')}${calButton(cal.google, 'Google')}${calButton(cal.ics, a.apple)}</p>
<p style="margin:0 0 12px;">${a.program}</p>
<p style="margin:0 0 24px;"><a href="${programUrl}" style="display:inline-block;padding:12px 22px;background:#f39a35;border-radius:8px;color:#ffffff;font-weight:700;text-decoration:none;">${a.programButton}</a></p>
<p style="margin:0;">${COPY[lang].signOff}<br><strong style="color:#0a2350;">${a.signature}</strong></p>`
  );

  const text = [
    greeting,
    '',
    a.body,
    '',
    `${a.date}: ${a.dateValue}`,
    `${a.time}: ${a.timeValue}`,
    `${a.place}: ${venue.name}, ${venue.address}`,
    EVENT.mapsUrl,
    '',
    `${a.calendar}:`,
    `Outlook: ${cal.outlook}`,
    `Google: ${cal.google}`,
    `${a.apple}: ${cal.ics}`,
    '',
    `${a.program} ${programUrl}`,
    '',
    COPY[lang].signOff,
    a.signature,
    ''
  ].join('\n');

  return { subject: a.subject, text, html };
}

async function send(to: string, lang: Lang, mail: { subject: string; text: string; html: string }) {
  const user = env('SMTP_USER');
  await transport().sendMail({
    from: { name: env('SMTP_FROM_NAME') || COPY[lang].fromName, address: env('SMTP_FROM') || user },
    to,
    ...mail
  });
}

/** Never throws: a failed e-mail must not turn a stored registration into an error. */
export async function sendRegistrationConfirmation(to: string, name: string, lang: Lang = 'tr'): Promise<boolean> {
  if (!mailConfigured()) {
    console.warn('SMTP is not configured; confirmation e-mail skipped');
    return false;
  }
  try {
    await send(to, lang, receivedMail(name, lang));
    return true;
  } catch (e) {
    console.error('confirmation e-mail failed', to, e);
    return false;
  }
}

/** Participation confirmed (admin panel). Throws on failure so the panel can show it. */
export async function sendApprovalEmail(to: string, name: string, lang: Lang = 'tr') {
  await send(to, lang, approvedMail(name, lang));
}
