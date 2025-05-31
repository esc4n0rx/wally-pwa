import { NextRequest, NextResponse } from 'next/server';

const WALLHAVEN_BASE_URL = process.env.WALLHAVEN_API_URL || 'https://wallhaven.cc/api/v1';
const WALLHAVEN_API_KEY = process.env.WALLHAVEN_API_KEY;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext 
) {
  try {

    const { id } = await context.params;

    if (!WALLHAVEN_BASE_URL || WALLHAVEN_BASE_URL === 'undefined') {
      throw new Error('WALLHAVEN_API_URL não está configurado');
    }

    const wallhavenUrl = new URL(`${WALLHAVEN_BASE_URL}/w/${id}`);
    
    if (WALLHAVEN_API_KEY && WALLHAVEN_API_KEY !== 'undefined') {
      wallhavenUrl.searchParams.append('apikey', WALLHAVEN_API_KEY);
    }

    console.log('Fazendo requisição para:', wallhavenUrl.toString());

    const response = await fetch(wallhavenUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Wally-PWA/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      throw new Error(`Wallhaven API Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    const origin = getOrigin(request);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=300', 
      },
    });

  } catch (error) {
    console.error('Erro na API proxy do Wallhaven:', error);
    
    const origin = getOrigin(request);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar wallpaper',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        config: {
          baseUrl: WALLHAVEN_BASE_URL,
          hasApiKey: !!WALLHAVEN_API_KEY
        }
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
  ].filter(Boolean) as string[];

  const origin = request.headers.get('origin');
  return allowedOrigins.includes(origin || '') ? origin! : allowedOrigins[0];
}

export async function OPTIONS(request: NextRequest) {
  const origin = getOrigin(request);
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}