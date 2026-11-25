import { NextRequest, NextResponse } from 'next/server';
import { SITE_HOSTS } from '@/lib/constants';

/**
 * One deployment, two domains: the English domain shows the English page at its root,
 * and each language page is only reachable on its own domain.
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();
  const { pathname } = req.nextUrl;

  if (host === SITE_HOSTS.en) {
    // Address bar keeps "/", content comes from /en.
    if (pathname === '/') return NextResponse.rewrite(new URL('/en', req.url));
    if (pathname === '/en') return NextResponse.redirect(`https://${SITE_HOSTS.en}/`, 308);
  }
  if (host === SITE_HOSTS.tr && pathname === '/en') {
    return NextResponse.redirect(`https://${SITE_HOSTS.en}/`, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/en'] };
