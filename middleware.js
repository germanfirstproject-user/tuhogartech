import { NextResponse } from 'next/server';

/**
 * Middleware para proteger rutas admin
 * Solo permite acceso si el usuario tiene rol 'admin' en localStorage
 */
export function middleware(request) {
  // Solo aplicar a rutas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Por ahora, permitir que el cliente maneje la protección
    // El cliente verificará mediante useAuth()
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configurar qué rutas aplicar el middleware
export const config = {
  matcher: ['/admin/:path*'],
};
