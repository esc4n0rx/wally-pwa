
import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/api/wallhaven')) {
    try {
      const ip = request.headers.get('x-forwarded-for') ?? 
                 request.headers.get('x-real-ip') ?? 
                 '127.0.0.1';
      
      if (ratelimit && typeof ratelimit.limit === 'function') {
        const { success, limit, reset, remaining } = await ratelimit.limit(ip);
        
        if (!success) {
          return new NextResponse('Too Many Requests', { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit?.toString() || '100',
              'X-RateLimit-Remaining': remaining?.toString() || '0',
              'X-RateLimit-Reset': reset ? new Date(reset).toISOString() : new Date().toISOString(),
              'Retry-After': '3600',
            }
          });
        }

        const response = NextResponse.next();
        
        response.headers.set('X-RateLimit-Limit', limit?.toString() || '100');
        response.headers.set('X-RateLimit-Remaining', remaining?.toString() || '0');
        response.headers.set('X-RateLimit-Reset', reset ? new Date(reset).toISOString() : new Date().toISOString());
        
        return response;
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue sem rate limiting em caso de erro
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/wallhaven/:path*',
  ],
};