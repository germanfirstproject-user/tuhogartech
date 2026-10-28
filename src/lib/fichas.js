/**
 * Dirección de las fichas de producto: /resenas/{id}-{nombre}.
 *
 * El número va delante y es lo único que se usa para buscar la ficha. El
 * nombre detrás está para la persona que ve el enlace (en Google, al
 * compartirlo) y se saca del título, así que si el título cambia, la dirección
 * vieja sigue funcionando: la ficha la reconoce por el número y redirige con
 * un 308 a la buena.
 *
 * Hasta el 14-10-2026 las fichas vivían en /producto/{id}. Esa ruta redirige
 * aquí con un 301 (app/producto/[id]/route.js).
 */

export const PREFIJO_FICHA = '/resenas/';

// Palabras que alargan la dirección sin decir nada.
const VACIAS = new Set([
  'a', 'al', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'los', 'o',
  'para', 'por', 'que', 'sin', 'u', 'un', 'una', 'y',
]);

const MAX_LETRAS = 50;

/** «DIGITUS Cat5e 0.5 m: cable de red RJ45…» → «digitus-cat5e-0-5-m-cable-red-rj45». */
export function slugFicha(producto) {
  const palabras = String(producto?.title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ª|º/g, 'a')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((p) => p && !VACIAS.has(p));

  // Se corta por palabras enteras: «pulgad» queda peor que quitar la palabra.
  let slug = '';
  for (const p of palabras) {
    const siguiente = slug ? `${slug}-${p}` : p;
    if (siguiente.length > MAX_LETRAS) {
      // Un número sin su unidad («512» sin «wh») confunde más que ayuda.
      slug = slug.replace(/-\d+$/, '');
      break;
    }
    slug = siguiente;
  }
  return slug;
}

/**
 * Ruta relativa de la ficha: /resenas/223-synology-ds224-opinion.
 *
 * Desde el 28-10-2026 el trozo tras el número se guarda en `products.url_slug`
 * («synology-ds224-opinion»), porque la dirección ya no es el título entero
 * sino el modelo más «opinión». Si está vacío (fichas nuevas sin rellenar), se
 * saca del título como antes.
 */
export function rutaFicha(producto) {
  const slug = producto?.url_slug?.trim() || slugFicha(producto);
  return `${PREFIJO_FICHA}${producto.id}${slug ? `-${slug}` : ''}`;
}

/**
 * Número de ficha a partir del trozo de la dirección («356-digitus-…» o
 * «356»). Devuelve null si no empieza por un número: /resenas/loquesea no es
 * una ficha.
 */
export function idDeFicha(segmento) {
  const m = /^(\d+)(?:-|$)/.exec(String(segmento || ''));
  return m ? m[1] : null;
}
