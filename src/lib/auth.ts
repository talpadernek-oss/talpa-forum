import 'server-only';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'forum_admin';
const SESSION_HOURS = 10;

interface TokenPayload {
  sub: string;
  exp: number;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET ortam değişkeni tanımlı değil (en az 16 karakter).');
  return s;
}

const mac = (body: string) => crypto.createHmac('sha256', secret()).update(body).digest('base64url');

function sign(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${mac(body)}`;
}

function verify(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(mac(body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as TokenPayload;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function setAdminCookie(res: NextResponse, username: string) {
  res.cookies.set(COOKIE, sign({ sub: username, exp: Date.now() + SESSION_HOURS * 3600_000 }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 3600
  });
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export function getAdmin(req: NextRequest): string | null {
  return verify(req.cookies.get(COOKIE)?.value)?.sub ?? null;
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb) && a.length === b.length;
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || 'admin';
  const p = process.env.ADMIN_PASSWORD;
  if (!p) return false;
  return safeEqual(username.trim(), u) && safeEqual(password, p);
}
