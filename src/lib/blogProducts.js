/**
 * Detecta los productos que menciona un artículo y parte su HTML para poder
 * intercalar tarjetas de producto reales.
 *
 * El texto de los artículos no se toca: se aprovechan los enlaces a la ficha
 * que ya contienen, /resenas/{id}-{nombre} (o /producto/{id}, la dirección de
 * antes del 14-10-2026, que puede seguir en algún borrador). Solo cuenta el
 * número: el nombre de detrás es decorativo (ver src/lib/fichas.js).
 *
 * Un enlace suelto en su propio párrafo se considera una llamada a la acción y
 * se sustituye por una tarjeta; los enlaces dentro de un texto corrido se
 * dejan como están.
 */

const PRODUCT_HREF = /\/(?:resenas|producto)\/(\d+)/g;

// Párrafo cuyo único contenido es un enlace a una ficha de producto.
const STANDALONE_LINK =
  /<p>\s*<a\s+href="\/(?:resenas|producto)\/(\d+)(?:-[a-z0-9-]*)?"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi;

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

// Botón de Amazon dentro del texto, sobre todo en las tablas comparativas:
//   <a href="/resenas/337-hp-designjet-t250" data-amazon>Ver en Amazon</a>
// Se escribe apuntando a la ficha para que, si el producto no tiene enlace de
// afiliado (o desaparece), siga siendo un enlace útil y no uno roto.
const AMAZON_BUTTON =
  /<a\s+href="\/(?:resenas|producto)\/(\d+)(?:-[a-z0-9-]*)?"\s+data-amazon\s*>([\s\S]*?)<\/a>/gi;

const escaparAtributo = (texto) =>
  String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Sustituye los marcadores `data-amazon` por el enlace de afiliado del
 * producto, con la marca «Enlace de afiliado» pegada, que Amazon exige junto a
 * cada enlace (ver AvisoAfiliado.js). El texto de la marca es el mismo.
 *
 * Si el producto no se ha podido cargar o no tiene enlace, el marcador se
 * queda como enlace normal a la ficha.
 */
export function insertAmazonButtons(html, productsById) {
  if (!html) return html;
  return html.replace(AMAZON_BUTTON, (original, id, texto) => {
    const producto = productsById?.[id];
    if (!producto?.affiliate_link) return original.replace(/\s+data-amazon\s*>/, '>');
    return (
      `<a href="${escaparAtributo(producto.affiliate_link)}" target="_blank" rel="noopener noreferrer sponsored"` +
      ` data-amazon-boton data-producto="${escaparAtributo(id)}"` +
      ` data-titulo="${escaparAtributo(producto.title)}"` +
      ` data-categoria="${escaparAtributo(producto.category)}"` +
      ` data-marca="${escaparAtributo(producto.brand)}">${texto}</a>` +
      `<span data-afiliado>Enlace de afiliado</span>`
    );
  });
}
