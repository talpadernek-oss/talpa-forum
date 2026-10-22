'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { DAYS, JOB_TITLES, OTHER_TITLE, type DayValue } from '@/lib/constants';

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

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setForm(f => ({ ...f, [key]: value }));

  const toggleDay = (d: DayValue) =>
    set('days', form.days.includes(d) ? form.days.filter(x => x !== d) : [...form.days, d]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.days.length) return setError('Lütfen katılacağınız günü seçiniz.');
    if (!form.consent) return setError('Devam etmek için aydınlatma metnini onaylayınız.');

    setBusy(true);
    try {
      const { jobTitleOther, ...rest } = form;
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rest, jobTitle: form.jobTitle === OTHER_TITLE ? jobTitleOther : form.jobTitle })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Kayıt alınamadı.');
      setDoneName(form.fullName.trim());
      setForm(EMPTY);
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
        <legend className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-forum-blue">Kişisel bilgiler</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="field-label">Ad Soyad</label>
            <input id="fullName" className="field-input" required autoComplete="name" maxLength={120}
              value={form.fullName} onChange={e => set('fullName', e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="field-label">E-posta</label>
            <input id="email" type="email" className="field-input" required autoComplete="email" maxLength={120}
              placeholder="ornek@firma.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">Telefon</label>
            <input id="phone" type="tel" className="field-input" required autoComplete="tel" maxLength={30}
              placeholder="0532 123 45 67" value={form.phone} onChange={e => set('phone', e.target.value)} />
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
