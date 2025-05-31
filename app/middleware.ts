import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Apenas aplicar CORS nas rotas da API
  if (request.nextUrl.pathname.startsWith('/api/wallhaven')) {
    const response = NextResponse.next();
    
    // Adicionar headers CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/wallhaven/:path*',
};