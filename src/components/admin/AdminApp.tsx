'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  LogOut,
  Pencil,
  Trash2,
  Loader2,
  Users,
  UserCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { DAYS, JOB_TITLES, ROLES, roleLabel, type Registration, type RoleValue, type DayValue } from '@/lib/constants';

type ApiResult<T = {}> = { success: boolean; error?: string } & T;

async function api<T = {}>(url: string, init?: RequestInit): Promise<ApiResult<T> & { status: number }> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store'
  });
  const data = await res.json().catch(() => ({ success: false, error: 'Sunucuya ulaşılamadı.' }));
  return { ...data, status: res.status };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const dayShort = (days: DayValue[]) =>
  days.length === DAYS.length ? 'Her iki gün' : days.length ? days.map(d => `${d} Ara`).join(', ') : '—';

export default function AdminApp() {
  const [state, setState] = useState<'loading' | 'login' | 'ready'>('loading');
  const [items, setItems] = useState<Registration[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleValue>('all');
  const [editing, setEditing] = useState<Registration | 'new' | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    const res = await api<{ registrations: Registration[] }>('/api/admin/registrations');
    setRefreshing(false);
    if (res.status === 401) return setState('login');
    if (!res.success) return setError(res.error || 'Kayıtlar yüklenemedi.');
    setItems(res.registrations);
    setError('');
    setState('ready');
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upsertLocal = (r: Registration) =>
    setItems(list => (list.some(x => x.id === r.id) ? list.map(x => (x.id === r.id ? r : x)) : [r, ...list]));

  async function patch(r: Registration, body: Partial<Registration>) {
    const res = await api<{ registration: Registration }>(`/api/admin/registrations/${r.id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    if (res.status === 401) return setState('login');
    if (!res.success) return setError(res.error || 'Güncellenemedi.');
    upsertLocal(res.registration);
  }

  async function remove(r: Registration) {
    if (!confirm(`${r.fullName} kaydı silinsin mi? Bu işlem geri alınamaz.`)) return;
    const res = await api(`/api/admin/registrations/${r.id}`, { method: 'DELETE' });
    if (res.status === 401) return setState('login');
    if (!res.success) return setError(res.error || 'Silinemedi.');
    setItems(list => list.filter(x => x.id !== r.id));
  }

  async function logout() {
    await api('/api/admin/logout', { method: 'POST' });
    setItems([]);
    setState('login');
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return items.filter(r => {
      if (roleFilter !== 'all' && r.role !== roleFilter) return false;
      if (!q) return true;
      return [r.fullName, r.email, r.phone, r.jobTitle, r.organization, r.notes]
        .join(' ')
        .toLocaleLowerCase('tr')
        .includes(q);
    });
  }, [items, query, roleFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length, checkedIn: 0 };
    for (const r of items) {
      c[r.role] = (c[r.role] || 0) + 1;
      if (r.checkedIn) c.checkedIn++;
    }
    return c;
  }, [items]);

  if (state === 'loading')
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-forum-blue" aria-label="Yükleniyor" />
      </div>
    );

  if (state === 'login') return <Login onDone={load} />;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-forum-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/talpa-logo.svg" alt="" width={36} height={36} />
            <div className="leading-tight">
              <p className="font-bold">Kayıt Paneli</p>
              <p className="text-xs text-white/60">2. TALPA Uçuş Emniyet Forumu · 1–2 Aralık 2026</p>
            </div>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Stats – also act as role filters */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatButton active={roleFilter === 'all'} onClick={() => setRoleFilter('all')} label="Toplam" value={counts.all} icon={Users} />
          {ROLES.map(r => (
            <StatButton key={r.value} active={roleFilter === r.value} onClick={() => setRoleFilter(r.value)} label={r.label} value={counts[r.value] || 0} />
          ))}
          <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <UserCheck className="h-3.5 w-3.5" aria-hidden /> Giriş yaptı
            </p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-600">{counts.checkedIn}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input className="field-input pl-9" placeholder="İsim, e-posta, telefon, ünvan veya kurum ara…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setEditing('new')} className="btn-navy">
              <Plus className="h-4 w-4" aria-hidden /> Kişi Ekle
            </button>
            <button onClick={() => exportCsv(filtered)} className="btn-ghost" disabled={!filtered.length}>
              <Download className="h-4 w-4" aria-hidden /> Excel (CSV)
            </button>
            <button onClick={load} className="btn-ghost" aria-label="Yenile" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
            <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" aria-hidden /> {error}</span>
            <button onClick={() => setError('')} aria-label="Kapat"><X className="h-4 w-4" /></button>
          </p>
        )}

        <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Ad Soyad</th>
                  <th className="px-4 py-3">İletişim</th>
                  <th className="px-4 py-3">Ünvan / Kurum</th>
                  <th className="px-4 py-3">Gün</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-center">Giriş</th>
                  <th className="px-4 py-3">Kayıt</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => (
                  <tr key={r.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-forum-navy">{r.fullName}</p>
                      {r.notes && <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500" title={r.notes}>{r.notes}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {r.email ? <a href={`mailto:${r.email}`} className="block text-forum-blue hover:underline">{r.email}</a> : <span className="text-slate-400">—</span>}
                      {r.phone && <a href={`tel:${r.phone}`} className="block text-slate-600">{r.phone}</a>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800">{r.jobTitle || '—'}</p>
                      <p className="text-xs text-slate-500">{r.organization}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{dayShort(r.days)}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label="Rol"
                        value={r.role}
                        onChange={e => patch(r, { role: e.target.value as RoleValue })}
                        className={`cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-semibold ring-1 ${ROLES.find(x => x.value === r.role)?.badge}`}
                      >
                        {ROLES.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" aria-label="Etkinliğe giriş yaptı" className="h-4 w-4 cursor-pointer accent-emerald-600"
                        checked={r.checkedIn} onChange={e => patch(r, { checkedIn: e.target.checked })} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {fmtDate(r.createdAt)}
                      <span className={`mt-1 block w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${r.source === 'manual' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r.source === 'manual' ? 'Manuel' : 'Web formu'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button onClick={() => setEditing(r)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-forum-navy" aria-label="Düzenle">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(r)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label="Sil">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-slate-500">
                      {items.length ? 'Aramanızla eşleşen kayıt yok.' : 'Henüz kayıt yok.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">{filtered.length} / {items.length} kayıt gösteriliyor</p>
      </main>

      {editing && (
        <EditDialog
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={r => {
            upsertLocal(r);
            setEditing(null);
          }}
          onUnauthorized={() => setState('login')}
        />
      )}
    </div>
  );
}

function StatButton({ active, onClick, label, value, icon: Icon }: { active: boolean; onClick: () => void; label: string; value: number; icon?: typeof Users }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`rounded-xl p-4 text-left ring-1 transition ${active ? 'bg-forum-navy text-white ring-forum-navy' : 'bg-white ring-slate-200 hover:ring-forum-blue/50'}`}>
      <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${active ? 'text-white/70' : 'text-slate-500'}`}>
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />} {label}
      </p>
      <p className={`mt-1 text-2xl font-extrabold ${active ? 'text-white' : 'text-forum-navy'}`}>{value}</p>
    </button>
  );
}

/* ---------------- Login ---------------- */

function Login({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    setBusy(false);
    if (!res.success) return setError(res.error || 'Giriş yapılamadı.');
    onDone();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forum-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card">
        <Image src="/talpa-logo.svg" alt="" width={48} height={48} className="mx-auto" />
        <h1 className="mt-4 text-center text-xl font-extrabold text-forum-navy">Kayıt Paneli</h1>
        <p className="mt-1 text-center text-sm text-slate-500">2. TALPA Uçuş Emniyet Forumu</p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="u" className="field-label">Kullanıcı adı</label>
            <input id="u" className="field-input" autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="p" className="field-label">Şifre</label>
            <input id="p" type="password" className="field-input" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        {error && <p role="alert" className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-navy mt-6 w-full py-3">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Giriş Yap
        </button>
      </form>
    </div>
  );
}

/* ---------------- Add / edit dialog ---------------- */

function EditDialog({ initial, onClose, onSaved, onUnauthorized }: {
  initial: Registration | null;
  onClose: () => void;
  onSaved: (r: Registration) => void;
  onUnauthorized: () => void;
}) {
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    jobTitle: initial?.jobTitle ?? '',
    organization: initial?.organization ?? '',
    days: (initial?.days ?? DAYS.map(d => d.value)) as DayValue[],
    role: (initial?.role ?? 'katilimci') as RoleValue,
    notes: initial?.notes ?? '',
    checkedIn: initial?.checkedIn ?? false
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await api<{ registration: Registration }>(
      initial ? `/api/admin/registrations/${initial.id}` : '/api/admin/registrations',
      { method: initial ? 'PATCH' : 'POST', body: JSON.stringify(form) }
    );
    setBusy(false);
    if (res.status === 401) return onUnauthorized();
    if (!res.success) return setError(res.error || 'Kaydedilemedi.');
    onSaved(res.registration);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forum-ink/60 p-4 sm:items-center" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="dlg-title" className="w-full max-w-2xl rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="dlg-title" className="text-lg font-bold text-forum-navy">{initial ? 'Kaydı Düzenle' : 'Yeni Kişi Ekle'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Kapat"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="f-name">Ad Soyad *</label>
            <input id="f-name" className="field-input" required value={form.fullName} onChange={e => set('fullName', e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="f-email">E-posta</label>
            <input id="f-email" type="email" className="field-input" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="f-phone">Telefon</label>
            <input id="f-phone" type="tel" className="field-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="field-label" htmlFor="f-title">İş Ünvanı</label>
            <input id="f-title" className="field-input" list="job-titles" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="Seçin veya yazın" />
            <datalist id="job-titles">
              {JOB_TITLES.filter(t => t !== 'Diğer').map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div>
            <label className="field-label" htmlFor="f-org">Firma / Kurum</label>
            <input id="f-org" className="field-input" value={form.organization} onChange={e => set('organization', e.target.value)} />
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="field-label">Rol</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ROLES.map(r => (
                <label key={r.value} className={`flex cursor-pointer items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 transition ${form.role === r.value ? `${r.badge} ring-2` : 'bg-white text-slate-600 ring-slate-300 hover:bg-slate-50'}`}>
                  <input type="radio" name="role" className="sr-only" checked={form.role === r.value} onChange={() => set('role', r.value)} />
                  {r.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="sm:col-span-2">
            <legend className="field-label">Gün</legend>
            <div className="flex flex-wrap gap-4">
              {DAYS.map(d => (
                <label key={d.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4 accent-forum-blue" checked={form.days.includes(d.value)}
                    onChange={e => set('days', e.target.checked ? [...form.days, d.value] : form.days.filter(x => x !== d.value))} />
                  {d.label} ({d.weekday})
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="f-notes">Not</label>
            <textarea id="f-notes" rows={3} className="field-input" maxLength={1000} placeholder="Oturum, unvan detayı, ulaşım vb." value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-emerald-600" checked={form.checkedIn} onChange={e => set('checkedIn', e.target.checked)} />
            Etkinliğe giriş yaptı
          </label>
        </div>

        {error && <p role="alert" className="mx-6 mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="btn-ghost">Vazgeç</button>
          <button type="submit" disabled={busy} className="btn-navy">
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- CSV export ---------------- */

function exportCsv(rows: Registration[]) {
  // Semicolon + BOM so Excel (Turkish locale) opens it with columns and correct characters.
  const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Ad Soyad', 'E-posta', 'Telefon', 'İş Ünvanı', 'Firma / Kurum', 'Rol', '1 Aralık', '2 Aralık', 'Giriş Yaptı', 'Not', 'Kaynak', 'Kayıt Tarihi'];
  const lines = rows.map(r =>
    [
      r.fullName,
      r.email,
      r.phone,
      r.jobTitle,
      r.organization,
      roleLabel(r.role),
      r.days.includes('1') ? 'Evet' : 'Hayır',
      r.days.includes('2') ? 'Evet' : 'Hayır',
      r.checkedIn ? 'Evet' : 'Hayır',
      r.notes,
      r.source === 'manual' ? 'Manuel' : 'Web formu',
      fmtDate(r.createdAt)
    ].map(esc).join(';')
  );
  const blob = new Blob(['﻿' + [header.map(esc).join(';'), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ucus-emniyet-forumu-kayitlar-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
