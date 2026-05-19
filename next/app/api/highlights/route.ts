// Browser -> Next route handler -> upstream proxy. Thin wrapper over the
// shared fetchHighlights helper in lib/highlights so Server Components can
// seed initial data at SSR time without going via HTTP-to-self.

import { NextRequest, NextResponse } from 'next/server';
import { fetchHighlights, HighlightsUpstreamError } from '@/lib/highlights';

export async function GET(request: NextRequest): Promise<Response> {
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');
  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'startDate and endDate query params are required' },
      { status: 400 },
    );
  }

  try {
    const body = await fetchHighlights(startDate, endDate);
    return NextResponse.json(body);
  } catch (err) {
    const status = err instanceof HighlightsUpstreamError ? err.statusCode : 502;
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json(
      { error: `Upstream highlights fetch failed: ${message}` },
      { status },
    );
  }
}
