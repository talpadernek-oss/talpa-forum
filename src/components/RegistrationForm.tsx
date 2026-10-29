'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle, BadgeCheck, Info } from 'lucide-react';
import { DAYS, JOB_TITLES, OTHER_TITLE, type DayValue } from '@/lib/constants';

/** Masked values from /api/member/verify; the server fills in the real ones on submit. */
type Member = { name: string; email: string; phone: string; organization: string };

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

export default function RegistrationForm() {
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
    if (!/^\d{11}$/.test(tcNo)) return setMemberNote({ tone: 'error', text: 'T.C. Kimlik Numaranızı 11 hane olarak giriniz.' });

    setVerifying(true);
    try {
      const res = await fetch('/api/member/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tcNo })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Üyelik doğrulanamadı.');
      if (!data.isMember) {
        return setMemberNote({
          tone: 'warn',
          text: 'Bu T.C. Kimlik Numarası ile aktif bir TALPA üyeliği bulunamadı. Formu aşağıdan manuel olarak doldurabilirsiniz.'
        });
      }
      const m: Member = data.member;
      setMember(m);
      setForm(f => ({
        ...f,
        jobTitle: f.jobTitle || 'Pilot',
        organization: f.organization || m.organization
      }));
    } catch (err: any) {
      setMemberNote({ tone: 'error', text: err.message || 'Üyelik doğrulanamadı.' });
    } finally {
      setVerifying(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (isMember && !member) return setError('Lütfen önce üyeliğinizi doğrulayınız ya da “TALPA üyesiyim” seçimini kaldırınız.');
    if (!form.days.length) return setError('Lütfen katılacağınız günü seçiniz.');
    if (!form.consent) return setError('Devam etmek için aydınlatma metnini onaylayınız.');

    setBusy(true);
    try {
      const { jobTitleOther, ...rest } = form;
      const payload = { ...rest, jobTitle: form.jobTitle === OTHER_TITLE ? jobTitleOther : form.jobTitle };
      // Empty e-mail / phone tell the server to use the member's Odoo record.
      if (member) Object.assign(payload, { tcNo, fullName: '', email: useOdooEmail ? '' : form.email, phone: useOdooPhone ? '' : form.phone });
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Kayıt alınamadı.');
      setDoneName(data.name || form.fullName.trim());
      setForm(EMPTY);
      setIsMember(false);
      setTcNo('');
      resetMember();
    } catch (err: any) {
      setError(err.message || 'Kayıt alınamadı.');
    } finally {
      setBusy(false);
    }
  }

  if (doneName !== null) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" aria-hidden />
        <h3 className="mt-4 text-2xl font-extrabold text-forum-navy">Kaydınız alındı</h3>
        <p className="mt-3 max-w-md leading-relaxed text-slate-600">
          Sayın <strong className="text-forum-navy">{doneName}</strong>, 2. TALPA Uçuş Emniyet Forumu’na kaydınız için
          teşekkür ederiz. 1–2 Aralık 2026’da sizi aramızda görmekten memnuniyet duyacağız.
        </p>
        <button type="button" onClick={() => setDoneName(null)} className="btn-ghost mt-8">
          Başka bir kişi kaydet
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-200 sm:p-8">
      <fieldset>
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">TALPA üyeliği</legend>
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${isMember ? 'border-forum-blue bg-forum-mist' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
          <input type="checkbox" className="h-4 w-4 accent-forum-blue" checked={isMember}
            onChange={e => {
              setIsMember(e.target.checked);
              resetMember();
            }} />
          <span>
            <span className="block font-semibold text-forum-navy">TALPA üyesiyim</span>
            <span className="block text-sm text-slate-500">Üyeliğinizi doğrulayın, bilgileriniz otomatik doldurulsun.</span>
          </span>
        </label>

        {isMember && (
          <div className="mt-4">
            <label htmlFor="tcNo" className="field-label">T.C. Kimlik Numarası</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input id="tcNo" className="field-input sm:flex-1" inputMode="numeric" autoComplete="off" maxLength={11}
                placeholder="11 haneli T.C. Kimlik No" value={tcNo} readOnly={Boolean(member)}
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
                  Değiştir
                </button>
              ) : (
                <button type="button" className="btn-navy" disabled={verifying || tcNo.length !== 11} onClick={verifyMember}>
                  {verifying ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Doğrulanıyor…</> : 'Üyeliğimi doğrula ve bilgilerimi otomatik doldur'}
                </button>
              )}
            </div>

            {member && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>Üyeliğiniz doğrulandı, <strong>{member.name}</strong>. Bilgileriniz TALPA üye kaydınızdan dolduruldu.</span>
              </p>
            )}
            {memberNote && (
              <p role="alert" className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ring-1 ${memberNote.tone === 'warn' ? 'bg-amber-50 text-amber-800 ring-amber-200' : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>
                {memberNote.tone === 'warn' ? <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
                {memberNote.text}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              T.C. Kimlik Numaranız yalnızca üyelik doğrulaması için kullanılır, kaydınızla birlikte saklanmaz.
            </p>
          </div>
        )}
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">Kişisel bilgiler</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="field-label">Ad Soyad</label>
            {member ? (
              <input id="fullName" className="field-input bg-slate-50 text-slate-600" readOnly value={member.name} />
            ) : (
              <input id="fullName" className="field-input" required autoComplete="name" maxLength={120}
                value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            )}
          </div>
          <div>
            <ContactLabel htmlFor="email" label="E-posta" fromOdoo={useOdooEmail} onChange={() => setOwnEmail(true)} />
            {useOdooEmail ? (
              <input id="email" className="field-input bg-slate-50 text-slate-600" readOnly value={member!.email} />
            ) : (
              <input id="email" type="email" className="field-input" required autoComplete="email" maxLength={120}
                placeholder="ornek@firma.com" value={form.email} onChange={e => set('email', e.target.value)} />
            )}
          </div>
          <div>
            <ContactLabel htmlFor="phone" label="Telefon" fromOdoo={useOdooPhone} onChange={() => setOwnPhone(true)} />
            {useOdooPhone ? (
              <input id="phone" className="field-input bg-slate-50 text-slate-600" readOnly value={member!.phone} />
            ) : (
              <input id="phone" type="tel" className="field-input" required autoComplete="tel" maxLength={30}
                placeholder="0532 123 45 67" value={form.phone} onChange={e => set('phone', e.target.value)} />
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">Mesleki bilgiler</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="jobTitle" className="field-label">İş Ünvanı</label>
            <select id="jobTitle" className="field-input" required value={form.jobTitle}
              onChange={e => set('jobTitle', e.target.value)}>
              <option value="" disabled>Seçiniz</option>
              {JOB_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="organization" className="field-label">Çalıştığı Firma / Kurum</label>
            <input id="organization" className="field-input" required autoComplete="organization" maxLength={160}
              placeholder="Havayolu, kurum veya üniversite" value={form.organization}
              onChange={e => set('organization', e.target.value)} />
          </div>
          {form.jobTitle === OTHER_TITLE && (
            <div className="sm:col-span-2">
              <label htmlFor="jobTitleOther" className="field-label">Ünvanınız</label>
              <input id="jobTitleOther" className="field-input" required maxLength={120} autoFocus
                value={form.jobTitleOther} onChange={e => set('jobTitleOther', e.target.value)} />
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">Katılacağınız gün(ler)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {DAYS.map(d => {
            const on = form.days.includes(d.value);
            return (
              <label key={d.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${on ? 'border-forum-blue bg-forum-mist' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
                <input type="checkbox" className="h-4 w-4 accent-forum-blue" checked={on} onChange={() => toggleDay(d.value)} />
                <span>
                  <span className="block font-semibold text-forum-navy">{d.label}</span>
                  <span className="block text-sm text-slate-500">{d.weekday}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Honeypot – hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>Web sitesi<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => set('website', e.target.value)} /></label>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-forum-blue" checked={form.consent}
          onChange={e => set('consent', e.target.checked)} />
        <span>
          Paylaştığım kişisel verilerin, 6698 sayılı KVKK kapsamında yalnızca forumun organizasyonu ve bu etkinlikle ilgili
          bilgilendirme amacıyla TALPA tarafından işlenmesini kabul ediyorum.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full py-3.5 text-base">
        {busy ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Gönderiliyor…</> : 'Kaydı Tamamla'}
      </button>
    </form>
  );
}

function ContactLabel({ htmlFor, label, fromOdoo, onChange }: { htmlFor: string; label: string; fromOdoo: boolean; onChange: () => void }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="field-label mb-0">{label}</label>
      {fromOdoo && (
        <button type="button" onClick={onChange} className="text-xs font-semibold text-forum-blue hover:underline">
          Farklı {label.toLocaleLowerCase('tr-TR')} gir
        </button>
      )}
    </div>
  );
}
