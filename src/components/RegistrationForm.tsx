'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, BadgeCheck, Info } from 'lucide-react';
import { DAYS, JOB_TITLES, JOB_TITLES_EN, OTHER_TITLE, type DayValue } from '@/lib/constants';
import type { Lang } from '@/lib/messages';
import DayOffNotice from './DayOffNotice';

/** Masked values from /api/member/verify; the server fills in the real ones on submit. */
type Member = { name: string; email: string; phone: string; organization: string };

const COPY = {
  tr: {
    memberLegend: 'TALPA üyeliği',
    memberToggle: 'TALPA üyesiyim',
    memberToggleHint: 'Üyeliğinizi doğrulayın, bilgileriniz otomatik doldurulsun.',
    tcLabel: 'T.C. Kimlik Numarası',
    tcPlaceholder: '11 haneli T.C. Kimlik No',
    tcLength: 'T.C. Kimlik Numaranızı 11 hane olarak giriniz.',
    change: 'Değiştir',
    verify: 'Üyeliğimi doğrula ve bilgilerimi otomatik doldur',
    verifying: 'Doğrulanıyor…',
    verified: (name: React.ReactNode) => <>Üyeliğiniz doğrulandı, <strong>{name}</strong>. Bilgileriniz TALPA üye kaydınızdan dolduruldu.</>,
    notMember: 'Bu T.C. Kimlik Numarası ile aktif bir TALPA üyeliği bulunamadı. Formu aşağıdan manuel olarak doldurabilirsiniz.',
    verifyFailed: 'Üyelik doğrulanamadı.',
    tcPrivacy: 'T.C. Kimlik Numaranız yalnızca üyelik doğrulaması için kullanılır, kaydınızla birlikte saklanmaz.',
    personalLegend: 'Kişisel bilgiler',
    fullName: 'Ad Soyad',
    email: 'E-posta',
    emailPlaceholder: 'ornek@firma.com',
    phone: 'Telefon',
    phonePlaceholder: '0532 123 45 67',
    useOther: (label: string) => `Farklı ${label.toLocaleLowerCase('tr-TR')} gir`,
    professionalLegend: 'Mesleki bilgiler',
    jobTitle: 'İş Ünvanı',
    select: 'Seçiniz',
    organization: 'Çalıştığı Firma / Kurum',
    organizationPlaceholder: 'Havayolu, kurum veya üniversite',
    jobTitleOther: 'Ünvanınız',
    daysLegend: 'Katılacağınız gün(ler)',
    consent: 'Paylaştığım kişisel verilerin, 6698 sayılı KVKK kapsamında yalnızca forumun organizasyonu ve bu etkinlikle ilgili bilgilendirme amacıyla TALPA tarafından işlenmesini kabul ediyorum.',
    verifyFirst: 'Lütfen önce üyeliğinizi doğrulayınız ya da “TALPA üyesiyim” seçimini kaldırınız.',
    daysRequired: 'Lütfen katılacağınız günü seçiniz.',
    consentRequired: 'Devam etmek için aydınlatma metnini onaylayınız.',
    submitFailed: 'Kayıt alınamadı.',
    submit: 'Kaydı Tamamla',
    submitting: 'Gönderiliyor…',
    doneTitle: 'Kaydınız alındı',
    doneText: (name: string) => (
      <>
        {name ? <>Sayın <strong className="text-forum-navy">{name}</strong>, 2.</> : '2.'} TALPA Uçuş Emniyet Forumu’na kaydınız
        için teşekkür ederiz. 1–2 Aralık 2026’da sizi aramızda görmekten memnuniyet duyacağız.
      </>
    ),
    registerAnother: 'Başka bir kişi kaydet',
    honeypot: 'Web sitesi'
  },
  en: {
    memberLegend: 'TALPA membership',
    memberToggle: 'I am a TALPA member',
    memberToggleHint: 'Verify your membership to fill in your details automatically.',
    tcLabel: 'Turkish ID Number (T.C. Kimlik No)',
    tcPlaceholder: '11-digit T.C. Kimlik No',
    tcLength: 'Please enter your 11-digit T.C. Kimlik No.',
    change: 'Change',
    verify: 'Verify my membership and fill in my details',
    verifying: 'Verifying…',
    verified: (name: React.ReactNode) => <>Membership verified, <strong>{name}</strong>. Your details have been filled in from your TALPA member record.</>,
    notMember: 'No active TALPA membership was found for this ID number. You can fill in the form below manually.',
    verifyFailed: 'Membership could not be verified.',
    tcPrivacy: 'Your ID number is used only to verify your membership and is not stored with your registration.',
    personalLegend: 'Personal details',
    fullName: 'Full name',
    email: 'E-mail',
    emailPlaceholder: 'name@company.com',
    phone: 'Phone',
    phonePlaceholder: '+90 532 123 45 67',
    useOther: (label: string) => `Use a different ${label.toLowerCase()}`,
    professionalLegend: 'Professional details',
    jobTitle: 'Job title',
    select: 'Please select',
    organization: 'Company / Organisation',
    organizationPlaceholder: 'Airline, organisation or university',
    jobTitleOther: 'Your job title',
    daysLegend: 'Day(s) you will attend',
    consent: 'I consent to TALPA processing the personal data I have provided, under Turkish Personal Data Protection Law No. 6698 (KVKK), solely for the organisation of the forum and for communications about this event.',
    verifyFirst: 'Please verify your membership first, or untick “I am a TALPA member”.',
    daysRequired: 'Please select the day(s) you will attend.',
    consentRequired: 'Please accept the personal data notice to continue.',
    submitFailed: 'Your registration could not be completed.',
    submit: 'Complete Registration',
    submitting: 'Submitting…',
    doneTitle: 'Registration received',
    doneText: (name: string) => (
      <>
        {name ? <>Dear <strong className="text-forum-navy">{name}</strong>, thank you</> : 'Thank you'} for registering for the
        2nd TALPA Flight Safety Forum. We look forward to welcoming you on 1–2 December 2026.
      </>
    ),
    registerAnother: 'Register another person',
    honeypot: 'Website'
  }
};

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  jobTitle: '',
  jobTitleOther: '',
  organization: '',
  days: DAYS.map(d => d.value) as DayValue[],
  consent: false,
  website: ''
};

export default function RegistrationForm({ lang = 'tr' }: { lang?: Lang }) {
  const t = COPY[lang];
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [doneName, setDoneName] = useState<string | null>(null);

  const [isMember, setIsMember] = useState(false);
  const [tcNo, setTcNo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [memberNote, setMemberNote] = useState<{ tone: 'warn' | 'error'; text: string } | null>(null);
  // When the member wants a different e-mail / phone than the one in Odoo.
  const [ownEmail, setOwnEmail] = useState(false);
  const [ownPhone, setOwnPhone] = useState(false);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setForm(f => ({ ...f, [key]: value }));

  const toggleDay = (d: DayValue) =>
    set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d]);

  const resetMember = () => {
    setMember(null);
    setMemberNote(null);
    setOwnEmail(false);
    setOwnPhone(false);
  };

  const useOdooEmail = Boolean(member?.email) && !ownEmail;
  const useOdooPhone = Boolean(member?.phone) && !ownPhone;

  async function verifyMember() {
    resetMember();
    if (!/^\d{11}$/.test(tcNo)) return setMemberNote({ tone: 'error', text: t.tcLength });

    setVerifying(true);
    try {
      const res = await fetch('/api/member/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tcNo, lang })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || t.verifyFailed);
      if (!data.isMember) return setMemberNote({ tone: 'warn', text: t.notMember });
      const m: Member = data.member;
      setMember(m);
      setForm(f => ({
        ...f,
        // Odoo doesn't return the member's rank; an empty title defaults to captain and stays editable.
        jobTitle: f.jobTitle || 'Kaptan Pilot',
        organization: f.organization || m.organization
      }));
    } catch (err: any) {
      setMemberNote({ tone: 'error', text: err.message || t.verifyFailed });
    } finally {
      setVerifying(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (isMember && !member) return setError(t.verifyFirst);
    if (!form.days.length) return setError(t.daysRequired);
    if (!form.consent) return setError(t.consentRequired);

    setBusy(true);
    try {
      const { jobTitleOther, ...rest } = form;
      const payload = { ...rest, lang, jobTitle: form.jobTitle === OTHER_TITLE ? jobTitleOther : form.jobTitle };
      // Empty e-mail / phone tell the server to use the member's Odoo record.
      if (member) Object.assign(payload, { tcNo, fullName: '', email: useOdooEmail ? '' : form.email, phone: useOdooPhone ? '' : form.phone });
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || t.submitFailed);
      // Members get no name back (it would reveal the unmasked Odoo record).
      setDoneName(member ? '' : data.name || form.fullName.trim());
      setForm(EMPTY);
      setIsMember(false);
      setTcNo('');
      resetMember();
    } catch (err: any) {
      setError(err.message || t.submitFailed);
    } finally {
      setBusy(false);
    }
  }

  if (doneName !== null) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" aria-hidden />
        <h3 className="mt-4 text-2xl font-extrabold text-forum-navy">{t.doneTitle}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-slate-600">{t.doneText(doneName)}</p>
        {/* "Boş Gün" (day off) is a Turkish airline arrangement, so the notice is Turkish-only. */}
        {lang === 'tr' && <DayOffNotice className="mt-6 w-full max-w-md" />}
        <button type="button" onClick={() => setDoneName(null)} className="btn-ghost mt-8">
          {t.registerAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200 sm:p-8">
      <fieldset>
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">{t.memberLegend}</legend>
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${isMember ? 'border-forum-blue bg-forum-mist' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
          <input type="checkbox" className="h-4 w-4 accent-forum-blue" checked={isMember}
            onChange={e => {
              setIsMember(e.target.checked);
              resetMember();
            }} />
          <span>
            <span className="block font-semibold text-forum-navy">{t.memberToggle}</span>
            <span className="block text-sm text-slate-500">{t.memberToggleHint}</span>
          </span>
        </label>

        {isMember && (
          <div className="mt-4">
            <label htmlFor="tcNo" className="field-label">{t.tcLabel}</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id="tcNo" className="field-input sm:flex-1" inputMode="numeric" autoComplete="off" maxLength={11}
                placeholder={t.tcPlaceholder} value={tcNo} readOnly={Boolean(member)}
                onChange={e => {
                  setTcNo(e.target.value.replace(/\D/g, '').slice(0, 11));
                  setMemberNote(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!member) verifyMember();
                  }
                }} />
              {member ? (
                <button type="button" className="btn-ghost" onClick={() => { resetMember(); setTcNo(''); }}>
                  {t.change}
                </button>
              ) : (
                <button type="button" className="btn-navy" disabled={verifying || tcNo.length !== 11} onClick={verifyMember}>
                  {verifying ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {t.verifying}</> : t.verify}
                </button>
              )}
            </div>

            {member && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{t.verified(member.name)}</span>
              </p>
            )}
            {memberNote && (
              <p role="alert" className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ring-1 ${memberNote.tone === 'warn' ? 'bg-amber-50 text-amber-800 ring-amber-200' : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>
                {memberNote.tone === 'warn' ? <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                {memberNote.text}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">{t.tcPrivacy}</p>
          </div>
        )}
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">{t.personalLegend}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="field-label">{t.fullName}</label>
            {member ? (
              <input id="fullName" className="field-input bg-slate-50 text-slate-600" readOnly value={member.name} />
            ) : (
              <input id="fullName" className="field-input" required autoComplete="name" maxLength={120}
                value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            )}
          </div>
          <div>
            <ContactLabel htmlFor="email" label={t.email} action={t.useOther(t.email)} fromOdoo={useOdooEmail} onChange={() => setOwnEmail(true)} />
            {useOdooEmail ? (
              <input id="email" className="field-input bg-slate-50 text-slate-600" readOnly value={member!.email} />
            ) : (
              <input id="email" type="email" className="field-input" required autoComplete="email" maxLength={120}
                placeholder={t.emailPlaceholder} value={form.email} onChange={e => set('email', e.target.value)} />
            )}
          </div>
          <div>
            <ContactLabel htmlFor="phone" label={t.phone} action={t.useOther(t.phone)} fromOdoo={useOdooPhone} onChange={() => setOwnPhone(true)} />
            {useOdooPhone ? (
              <input id="phone" className="field-input bg-slate-50 text-slate-600" readOnly value={member!.phone} />
            ) : (
              <input id="phone" type="tel" className="field-input" required autoComplete="tel" maxLength={30}
                placeholder={t.phonePlaceholder} value={form.phone} onChange={e => set('phone', e.target.value)} />
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">{t.professionalLegend}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="jobTitle" className="field-label">{t.jobTitle}</label>
            <select id="jobTitle" className="field-input" required value={form.jobTitle}
              onChange={e => set('jobTitle', e.target.value)}>
              <option value="" disabled>{t.select}</option>
              {/* Values stay Turkish (what the admin panel stores); only the label is translated. */}
              {JOB_TITLES.map(v => <option key={v} value={v}>{lang === 'en' ? JOB_TITLES_EN[v] : v}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="organization" className="field-label">{t.organization}</label>
            <input id="organization" className="field-input" required autoComplete="organization" maxLength={160}
              placeholder={t.organizationPlaceholder} value={form.organization}
              onChange={e => set('organization', e.target.value)} />
          </div>
          {form.jobTitle === OTHER_TITLE && (
            <div className="sm:col-span-2">
              <label htmlFor="jobTitleOther" className="field-label">{t.jobTitleOther}</label>
              <input id="jobTitleOther" className="field-input" required maxLength={120} autoFocus
                value={form.jobTitleOther} onChange={e => set('jobTitleOther', e.target.value)} />
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">{t.daysLegend}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {DAYS.map(d => {
            const on = form.days.includes(d.value);
            return (
              <label key={d.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${on ? 'border-forum-blue bg-forum-mist' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                <input type="checkbox" className="h-4 w-4 accent-forum-blue" checked={on} onChange={() => toggleDay(d.value)} />
                <span>
                  <span className="block font-semibold text-forum-navy">{lang === 'en' ? d.labelEn : d.label}</span>
                  <span className="block text-sm text-slate-500">{lang === 'en' ? d.weekdayEn : d.weekday}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Honeypot – hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>{t.honeypot}<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website', e.target.value)} /></label>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-forum-blue" checked={form.consent}
          onChange={e => set('consent', e.target.checked)} />
        <span>{t.consent}</span>
      </label>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full py-3.5 text-base">
        {busy ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> {t.submitting}</> : t.submit}
      </button>
    </form>
  );
}

function ContactLabel({ htmlFor, label, action, fromOdoo, onChange }: {
  htmlFor: string;
  label: string;
  action: string;
  fromOdoo: boolean;
  onChange: () => void;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="field-label mb-0">{label}</label>
      {fromOdoo && (
        <button type="button" onClick={onChange} className="text-xs font-semibold text-forum-blue hover:underline">
          {action}
        </button>
      )}
    </div>
  );
}
