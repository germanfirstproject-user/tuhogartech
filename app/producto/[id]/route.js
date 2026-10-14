import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/supabase';
import { rutaFicha, idDeFicha } from '@/lib/fichas';

/**
 * Dirección antigua de las fichas. Desde el 14-10-2026 viven en
 * /resenas/{id}-{nombre} (src/lib/fichas.js); aquí solo se redirige.
 *
 * Es un manejador de ruta y no una regla de next.config.mjs porque el destino
 * lleva el nombre del producto, que hay que sacar de la base: así el salto es
 * uno solo, y con 301, que es el código que Search Console espera para un
 * cambio de dirección.
 */
export async function GET(request, { params }) {
  const id = idDeFicha(params.id);
  const result = id ? await getProductById(id) : { success: false };
  const destino = result.success && result.data
    ? rutaFicha(result.data)
    : null;

  if (!destino) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.redirect(new URL(destino, request.url), 301);
}
