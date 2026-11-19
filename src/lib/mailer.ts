import 'server-only';
import nodemailer from 'nodemailer';
import type { Lang } from './messages';

/**
 * Confirmation e-mail sent after a web form registration (SMTP_* env, see .env.example).
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
    subject: '2. TALPA Uçuş Emniyet Forumu – Başvurunuz alındı',
    greeting: (name: string) => (name ? `Değerli Katılımcımız ${name},` : 'Değerli Katılımcımız,'),
    body: '2. TALPA Uçuş Emniyet Forumu’na gösterdiğiniz ilgi için teşekkür ederiz. Program içeriği katılım onayınız ile birlikte gönderilecektir.',
    signOff: 'Saygılarımızla,',
    org: 'TALPA – Türkiye Havayolu Pilotları Derneği',
    edition: '2. TALPA',
    title: 'Uçuş Emniyet Forumu',
    when: '1–2 Aralık 2026 · SHGM Türk Sivil Havacılık Akademisi, İstanbul'
  },
  en: {
    fromName: 'TALPA Flight Safety Forum',
    subject: '2nd TALPA Flight Safety Forum – Registration received',
    greeting: (name: string) => (name ? `Dear ${name},` : 'Dear Participant,'),
    body: 'Thank you for your interest in the 2nd TALPA Flight Safety Forum. The programme will be sent to you together with your participation confirmation.',
    signOff: 'Kind regards,',
    org: 'TALPA – Turkish Airline Pilots’ Association',
    edition: '2nd TALPA',
    title: 'Flight Safety Forum',
    when: '1–2 December 2026 · Turkish DGCA (SHGM) Civil Aviation Academy, Istanbul'
  }
} satisfies Record<Lang, unknown>;

/** `name` empty → greeting without a name. */
function confirmation(name: string, lang: Lang) {
  const c = COPY[lang];
  const greeting = c.greeting(name);
  const body = c.body;

  const text = `${greeting}\n\n${body}\n\n${c.signOff}\n${c.org}\n`;
  const html = `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 12px;background:#e8f0fb;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0a2350;padding:22px 32px;color:#ffffff;">
<div style="font-size:14px;color:#c9d6ea;">${c.edition}</div>
<div style="font-size:22px;font-weight:800;text-transform:uppercase;">${c.title}</div>
<div style="font-size:14px;color:#f39a35;font-weight:700;margin-top:4px;">${c.when}</div>
</td></tr>
<tr><td style="padding:28px 32px;font-size:16px;line-height:26px;color:#334155;">
<p style="margin:0 0 16px;font-weight:700;color:#0a2350;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">${body}</p>
<p style="margin:0;">${c.signOff}<br><strong style="color:#0a2350;">${c.org}</strong></p>
</td></tr>
<tr><td style="background:#06142e;padding:16px 32px;font-size:13px;text-align:center;">
<a href="https://www.talpa.org" style="color:#ffffff;text-decoration:none;font-weight:700;">www.talpa.org</a>
</td></tr>
</table></td></tr></table>
</body></html>`;
  return { text, html };
}

/** Never throws: a failed e-mail must not turn a stored registration into an error. */
export async function sendRegistrationConfirmation(to: string, name: string, lang: Lang = 'tr'): Promise<boolean> {
  if (!mailConfigured()) {
    console.warn('SMTP is not configured; confirmation e-mail skipped');
    return false;
  }
  try {
    const user = env('SMTP_USER');
    await transport().sendMail({
      from: { name: env('SMTP_FROM_NAME') || COPY[lang].fromName, address: env('SMTP_FROM') || user },
      to,
      subject: COPY[lang].subject,
      ...confirmation(name, lang)
    });
    return true;
  } catch (e) {
    console.error('confirmation e-mail failed', to, e);
    return false;
  }
}
