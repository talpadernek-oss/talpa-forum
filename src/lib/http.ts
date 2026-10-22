import { NextRequest, NextResponse } from 'next/server';

export const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ success: true, ...data });

export const fail = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

export const unauthorized = () => fail('Oturumunuz sona ermiş. Lütfen yeniden giriş yapınız.', 401);

export async function readBody<T = any>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}
