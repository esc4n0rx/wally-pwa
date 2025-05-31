import { NextRequest, NextResponse } from 'next/server';

const WALLHAVEN_BASE_URL = process.env.NEXT_PUBLIC_WALLHAVEN_API_URL;
const WALLHAVEN_API_KEY = process.env.NEXT_PUBLIC_WALLHAVEN_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construir URL da API do Wallhaven
    const wallhavenUrl = new URL(`${WALLHAVEN_BASE_URL}/search`);
    
    // Transferir todos os parâmetros de busca
    searchParams.forEach((value, key) => {
      wallhavenUrl.searchParams.append(key, value);
    });
    
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
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('Erro na API proxy do Wallhaven:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar wallpapers',
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