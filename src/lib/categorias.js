import { extractProductIds } from '@/lib/blogProducts';

export const BASE_URL = 'https://tuhogartech.com';

/**
 * El layout ya añade « | Tu Hogar Tech» a cada título. Si el título guardado
 * en el panel también la lleva, Google recibe la marca dos veces y el título
 * pasa de los ~60 caracteres que enseña. Esto la quita si alguien vuelve a
 * escribirla a mano.
 */
export function tituloSinMarca(titulo) {
  if (!titulo) return titulo;
  return titulo.replace(/\s*[|\-–—·]\s*Tu\s*Hogar\s*Tech\s*$/i, '').trim();
}

/** Texto de introducción guardado con líneas en blanco entre párrafos. */
export function parrafos(texto) {
  if (!texto) return [];
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Artículos que enlazan a alguno de los productos dados, del que más enlaza
 * al que menos. Usa el mismo patrón que las tarjetas de producto del blog,
 * así que cuenta exactamente los enlaces que el lector ve.
 */
export function articulosQueMencionan(blogs, productIds, limite = 6) {
  const ids = new Set(productIds.map(String));
  if (!ids.size) return [];

  return blogs
    .map((blog) => ({
      blog,
      menciones: extractProductIds(blog.content).filter((id) => ids.has(id)).length,
    }))
    .filter((x) => x.menciones > 0)
    .sort((a, b) => b.menciones - a.menciones)
    .slice(0, limite)
    .map((x) => x.blog);
}

/** BreadcrumbList de schema.org a partir de [{ name, href }]. */
export function esquemaMigas(migas) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.name,
      item: `${BASE_URL}${m.href}`,
    })),
  };
}

/**
 * ItemList con las fichas del listado. Solo URL y nombre: no se declara
 * Product por lo mismo que en la ficha (sin oferta ni reseña propias).
 */
export function esquemaListado(nombre, productos, desde = 0) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: nombre,
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => ({
      '@type': 'ListItem',
      position: desde + i + 1,
      url: `${BASE_URL}/producto/${p.id}`,
      name: p.title,
    })),
  };
}
