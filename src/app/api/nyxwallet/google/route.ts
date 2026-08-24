import { NextResponse } from 'next/server';
import { getNyxV3Upstream } from '@/modules/nyx-wallet/nyx-upstream';

export async function GET() {
  const { baseUrl, apiKey } = getNyxV3Upstream();

  if (!apiKey) {
    return NextResponse.json({ error: 'Nyx V3 API key is not configured' }, { status: 500 });
  }

  const googleAuthUrl = `${baseUrl}/auth/google?apiKey=${encodeURIComponent(apiKey)}&source=indahouse-admin`;
  return NextResponse.redirect(googleAuthUrl);
}
