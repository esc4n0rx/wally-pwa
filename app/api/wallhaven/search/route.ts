import { NextRequest, NextResponse } from 'next/server';
import { searchParamsSchema } from '@/lib/validation';
import { apiCache } from '@/lib/cache';
import { sanitizeUrl } from '@/lib/url-utils';

const WALLHAVEN_BASE_URL = process.env.WALLHAVEN_API_URL || 'https://wallhaven.cc/api/v1';
const WALLHAVEN_API_KEY = process.env.WALLHAVEN_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);
    const validatedParams = searchParamsSchema.parse(params);
    const cacheKey = `search:${JSON.stringify(validatedParams)}`;
    
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: {
          'X-Cache': 'HIT',
          'Access-Control-Allow-Origin': getOrigin(request),
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
        },
      });
    }

    const wallhavenUrl = new URL(`${WALLHAVEN_BASE_URL}/search`);
    
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined) {
        wallhavenUrl.searchParams.append(key, value.toString());
      }
    });
    
    if (WALLHAVEN_API_KEY) {
      wallhavenUrl.searchParams.append('apikey', WALLHAVEN_API_KEY);
    }

    console.log('Fazendo requisição para:', wallhavenUrl.toString());

    const response = await fetch(wallhavenUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Wally-PWA/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      throw new Error(`Wallhaven API Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.data) {
      data.data = data.data.map((wallpaper: any) => ({
        ...wallpaper,
        path: wallpaper.path ? sanitizeUrl(wallpaper.path) : wallpaper.path,
        thumbs: wallpaper.thumbs ? {
          large: wallpaper.thumbs.large ? sanitizeUrl(wallpaper.thumbs.large) : wallpaper.thumbs.large,
          original: wallpaper.thumbs.original ? sanitizeUrl(wallpaper.thumbs.original) : wallpaper.thumbs.original,
          small: wallpaper.thumbs.small ? sanitizeUrl(wallpaper.thumbs.small) : wallpaper.thumbs.small,
        } : wallpaper.thumbs,
      }));
    }
    
    apiCache.set(cacheKey, data, 300000);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'X-Cache': 'MISS',
        'Access-Control-Allow-Origin': getOrigin(request),
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('Erro na API proxy do Wallhaven:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Parâmetros inválidos',
          details: error.message,
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': getOrigin(request),
          },
        }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar wallpapers',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': getOrigin(request),
        },
      }
    );
  }
}

function getOrigin(request: NextRequest): string {
  const allowedOrigins = [
    'https://wally.app',
    'https://www.wally.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean);

  const origin = request.headers.get('origin');
  return allowedOrigins.includes(origin) && origin ? origin : (allowedOrigins[0] || '');
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': getOrigin(request),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}