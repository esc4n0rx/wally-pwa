import { NextRequest, NextResponse } from 'next/server';

const WALLHAVEN_BASE_URL = process.env.NEXT_PUBLIC_WALLHAVEN_API_URL;
const WALLHAVEN_API_KEY = process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY;

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Construir URL da API do Wallhaven
    const wallhavenUrl = new URL(`${WALLHAVEN_BASE_URL}/w/${id}`);
    
    // Adicionar API key se disponível
    if (WALLHAVEN_API_KEY) {
      wallhavenUrl.searchParams.append('apikey', WALLHAVEN_API_KEY);
    }

    // Fazer requisição para o Wallhaven
    const response = await fetch(wallhavenUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Wally-PWA/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Wallhaven API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Retornar dados com headers CORS apropriados
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=300', // Cache por 1 hora
      },
    });

  } catch (error) {
    console.error('Erro na API proxy do Wallhaven:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar wallpaper',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Handler para requisições OPTIONS (preflight)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}