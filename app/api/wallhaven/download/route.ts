import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    // Fazer requisição para a imagem original
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Wally-PWA/1.0',
        'Referer': 'https://wallhaven.cc/',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${response.status}`);
    }

    const imageData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Retornar a imagem com headers apropriados
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 ano
      },
    });

  } catch (error) {
    console.error('Erro no download da imagem:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao baixar imagem',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}