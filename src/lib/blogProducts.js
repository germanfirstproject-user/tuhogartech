/**
 * Detecta los productos que menciona un artículo y parte su HTML para poder
 * intercalar tarjetas de producto reales.
 *
 * El texto de los artículos no se toca: se aprovechan los enlaces a
 * /producto/{id} que ya contienen. Un enlace suelto en su propio párrafo se
 * considera una llamada a la acción y se sustituye por una tarjeta; los
 * enlaces dentro de un texto corrido se dejan como están.
 */

const PRODUCT_HREF = /\/producto\/([A-Za-z0-9-]+)/g;

// Párrafo cuyo único contenido es un enlace a una ficha de producto.
const STANDALONE_LINK =
  /<p>\s*<a\s+href="\/producto\/([A-Za-z0-9-]+)"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi;

/** Todos los ids de producto citados, en orden de aparición y sin repetir. */
export function extractProductIds(content) {
  if (!content) return [];
  const ids = [];
  for (const match of content.matchAll(PRODUCT_HREF)) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }
  return ids;
}

/**
 * Parte el HTML en segmentos alternos de texto y tarjeta:
 *   [{ type: 'html', value }, { type: 'product', id }, ...]
 */
export function splitContentByProductCards(content) {
  if (!content) return [];

  const segments = [];
  let cursor = 0;

  for (const match of content.matchAll(STANDALONE_LINK)) {
    const before = content.slice(cursor, match.index);
    if (before.trim()) segments.push({ type: 'html', value: before });
    segments.push({ type: 'product', id: match[1] });
    cursor = match.index + match[0].length;
  }

  const rest = content.slice(cursor);
  if (rest.trim()) segments.push({ type: 'html', value: rest });

  return segments.length ? segments : [{ type: 'html', value: content }];
}
