import 'server-only';
import fs from 'fs';
import path from 'path';
import { put, get, list, del } from '@vercel/blob';

/**
 * Key/value + file storage.
 * - On Vercel: private Vercel Blob store. Newer store connections authenticate
 *   with OIDC and only set BLOB_STORE_ID; older ones set BLOB_READ_WRITE_TOKEN.
 * - Locally: files under ./data/store (git-ignored).
 * Every key lives under the `forum/` prefix so the store can be shared.
 */

export const BLOB_ENABLED = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const PREFIX = 'forum/';
const LOCAL_ROOT = path.join(process.cwd(), 'data', 'store');

const fullKey = (key: string) => `${PREFIX}${key.replace(/^\/+/, '')}`;

function localPath(key: string): string {
  // Vercel's filesystem is read-only, so the local fallback can only hide a missing store there.
  if (process.env.VERCEL)
    throw new Error('Blob deposu bağlı değil: BLOB_READ_WRITE_TOKEN veya BLOB_STORE_ID tanımlı değil (önek kullanılmamalı).');
  const p = path.join(LOCAL_ROOT, fullKey(key));
  if (!p.startsWith(LOCAL_ROOT)) throw new Error('Geçersiz anahtar.');
  return p;
}

/* ---------------- JSON documents ---------------- */

export async function readJson<T>(key: string): Promise<T | null> {
  if (BLOB_ENABLED) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await get(fullKey(key), { access: 'private', useCache: false });
        if (!res || res.statusCode !== 200 || !res.stream) return null;
        return JSON.parse(await new Response(res.stream).text()) as T;
      } catch (e: any) {
        if (e?.name === 'BlobNotFoundError' || /not found/i.test(e?.message || '')) return null;
        if (attempt === 1) throw e;
      }
    }
    return null;
  }
  try {
    const p = localPath(key);
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
  } catch {
    return null;
  }
}

export async function writeJson(key: string, data: unknown): Promise<void> {
  if (BLOB_ENABLED) {
    await put(fullKey(key), JSON.stringify(data), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json'
    });
    return;
  }
  const p = localPath(key);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}

export async function deleteKey(key: string): Promise<void> {
  await deleteObject(fullKey(key));
}

/** Keys (without the global prefix) below `prefix`. */
export async function listKeys(prefix: string): Promise<string[]> {
  if (BLOB_ENABLED) {
    const keys: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: fullKey(prefix), cursor, limit: 1000 });
      keys.push(...page.blobs.map(b => b.pathname.slice(PREFIX.length)));
      cursor = page.cursor;
    } while (cursor);
    return keys;
  }
  const dir = localPath(prefix);
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else out.push(path.relative(path.join(LOCAL_ROOT, PREFIX), p).split(path.sep).join('/'));
    }
  };
  walk(dir);
  return out;
}

export async function readAllJson<T>(prefix: string, concurrency = 20): Promise<T[]> {
  const keys = (await listKeys(prefix)).filter(k => k.endsWith('.json'));
  const out: T[] = [];
  for (let i = 0; i < keys.length; i += concurrency) {
    const chunk = await Promise.all(keys.slice(i, i + concurrency).map(k => readJson<T>(k).catch(() => null)));
    for (const item of chunk) if (item) out.push(item);
  }
  return out;
}

async function deleteObject(pathname: string): Promise<void> {
  if (BLOB_ENABLED) {
    try {
      await del(pathname);
    } catch (e) {
      console.warn('Blob delete failed:', pathname, e);
    }
    return;
  }
  const p = path.join(LOCAL_ROOT, pathname);
  if (p.startsWith(LOCAL_ROOT) && fs.existsSync(p)) fs.rmSync(p, { force: true });
}
