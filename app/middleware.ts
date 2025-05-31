import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/api/wallhaven')) {
    try {
      const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);
      
      if (!success) {
        return new NextResponse('Too Many Requests', { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          }
        });
      }

      const response = NextResponse.next();
      
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
      
      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/wallhaven/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};