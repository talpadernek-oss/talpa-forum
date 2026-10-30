import 'server-only';
import { NextRequest } from 'next/server';

// Best-effort per-instance limit; slows down enumeration / guessing without extra infrastructure.
const hits = new Map<string, number[]>();

export const clientIp = (req: NextRequest) => req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';

/** Records a hit for `bucket` + client IP and reports whether it is over `max` within `windowMs`. */
export function rateLimited(bucket: string, req: NextRequest, max = 10, windowMs = 10 * 60 * 1000) {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
