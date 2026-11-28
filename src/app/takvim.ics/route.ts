import { NextRequest } from 'next/server';
import { icsFile } from '@/lib/calendar';

/** Calendar file linked from the confirmation e-mail (Outlook / Apple). `?lang=en` for English. */
export function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'tr';
  return new Response(icsFile(lang), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${lang === 'en' ? 'talpa-flight-safety-forum' : 'talpa-ucus-emniyet-forumu'}.ics"`,
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
