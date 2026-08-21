import { NextRequest, NextResponse } from 'next/server';
import { getNyxV3Upstream } from '@/modules/nyx-wallet/nyx-upstream';

const ALLOWED_NYX_ROUTES: Array<{ method: string; pattern: RegExp }> = [
  { method: 'POST', pattern: /^custody\/wallets$/ },
  { method: 'GET', pattern: /^custody\/wallets\/[^/]+\/share$/ },
  { method: 'GET', pattern: /^custody\/wallets\/[^/]+\/recovery-envelope$/ },
  { method: 'POST', pattern: /^custody\/wallets\/[^/]+\/recovery-envelope$/ },
  { method: 'POST', pattern: /^custody\/wallets\/[^/]+\/reshare$/ },
  { method: 'POST', pattern: /^account\/operations\/sponsorship$/ },
  { method: 'POST', pattern: /^account\/operations$/ },
  { method: 'GET', pattern: /^account\/operations\/[^/]+\/receipt$/ },
  { method: 'POST', pattern: /^webauthn\/register\/options$/ },
  { method: 'POST', pattern: /^webauthn\/register\/verify$/ },
];

function isAllowedPath(method: string, path: string): boolean {
  return ALLOWED_NYX_ROUTES.some(
    (route) => route.method === method && route.pattern.test(path),
  );
}

async function proxyNyx(request: NextRequest, pathParts: string[]): Promise<NextResponse> {
  const path = pathParts.join('/');
  const method = request.method.toUpperCase();

  if (!isAllowedPath(method, path)) {
    return NextResponse.json({ error: 'Route not allowed' }, { status: 404 });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return NextResponse.json({ error: 'Missing Authorization' }, { status: 401 });
  }

  const { baseUrl } = getNyxV3Upstream();
  const targetUrl = `${baseUrl}/${path}${request.nextUrl.search}`;
  const init: RequestInit = {
    method,
    headers: {
      Authorization: authorization,
      Accept: 'application/json',
      ...(method !== 'GET' && method !== 'HEAD'
        ? { 'Content-Type': request.headers.get('content-type') || 'application/json' }
        : {}),
    },
    cache: 'no-store',
  };

  if (method !== 'GET' && method !== 'HEAD') {
    const body = await request.text();
    if (body) init.body = body;
  }

  const upstream = await fetch(targetUrl, init);
  const text = await upstream.text();
  const contentType = upstream.headers.get('content-type') || 'application/json';

  return new NextResponse(text, {
    status: upstream.status,
    headers: { 'Content-Type': contentType },
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyNyx(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyNyx(request, path);
}
