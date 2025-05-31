import { NextRequest, NextResponse } from 'next/server';
import { downloadRateLimit } from '@/lib/rate-limit';
import { sanitizeUrl } from '@/lib/url-utils';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await downloadRateLimit.limit(ip);
    
    if (!success) {
      return new NextResponse('Muitos downloads. Tente novamente em alguns minutos.', { 
        status: 429 
      });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    const sanitizedUrl = sanitizeUrl(imageUrl);

    const response = await fetch(sanitizedUrl, {
      headers: {
        'User-Agent': 'Wally-PWA/1.0',
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Falha ao baixar imagem: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('URL não aponta para uma imagem válida');
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Erro no download:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao baixar imagem',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}