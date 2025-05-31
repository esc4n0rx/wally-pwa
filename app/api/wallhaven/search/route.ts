// app/api/wallhaven/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

const WALLHAVEN_BASE_URL = process.env.NEXT_PUBLIC_WALLHAVEN_API_URL || 'https://wallhaven.cc/api/v1';
const WALLHAVEN_API_KEY = process.env.WALLHAVEN_API_KEY; // Remover NEXT_PUBLIC_ para manter no servidor

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    if (!WALLHAVEN_BASE_URL || WALLHAVEN_BASE_URL === 'undefined') {
      throw new Error('WALLHAVEN_API_URL não está configurado');
    }
    
    const wallhavenUrl = new URL(`${WALLHAVEN_BASE_URL}/search`);
    
    // Transferir todos os parâmetros de busca
    searchParams.forEach((value, key) => {
      wallhavenUrl.searchParams.append(key, value);
    });
    
    // Adicionar API key se disponível (apenas no servidor)
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
      // Cache por 5 minutos
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      throw new Error(`Wallhaven API Error: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

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
        details: error instanceof Error ? error.message : 'Erro desconhecido',
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