/**
 * Identidad visual de un producto sin usar fotografías de Amazon.
 *
 * Hay dos visuales distintos, para que no se confundan en la web:
 * - Producto: lámina técnica clara (retícula fina, icono en tinta morada,
 *   marca en el pie). Dentro de una categoría, cada ficha recibe una trama y
 *   un tono propios derivados de su id.
 * - Subcategoría: bloque morado oscuro a sangre con el icono en blanco y un
 *   mosaico del mismo icono, porque lleva el texto encima.
 *
 * Todo es determinista: el mismo producto se ve siempre igual, y no hace
 * falta guardar nada ni generar archivos.
 */

// Cada categoría conserva su icono. El color ya no cambia por categoría: el
// sistema de diseño usa un solo morado, y lo que distingue una ficha de otra
// es el icono, la trama y el rótulo de la marca.
const CATEGORIAS = {
  'Baterías y energía': { icono: 'energia' },
  'Smart Home': { icono: 'casa' },
  'Streaming': { icono: 'streaming' },
  'Almacenamiento': { icono: 'disco' },
  'Impresoras de etiquetas': { icono: 'etiquetas' },
  'Proyectores': { icono: 'proyector' },
  'Cultivo inteligente': { icono: 'planta' },
  'Seguridad Inteligente': { icono: 'escudo' },
  'Escáner': { icono: 'escaner' },
  'Papel': { icono: 'papel' },
  'Conectividad | Docking': { icono: 'conector' },
  'Realidad virtual': { icono: 'vr' },
  'Ordenadores': { icono: 'portatil' },
  'Cámara instantánea': { icono: 'camara' },
  'Impresoras portátiles': { icono: 'impresora' },
  'Plotters': { icono: 'plotter' },
  'Comederos automáticos': { icono: 'comedero' },
  'Sistemas de alimentación': { icono: 'bateria' },
  'Sistemas de sonido': { icono: 'altavoz' },
};

const MORADO = '#4a2a8c';
const POR_DEFECTO = { icono: 'caja' };

/* ---------- Color ---------- */

function hexAHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

const hsl = ({ h, s, l }, ds = 0, dl = 0) =>
  `hsl(${h.toFixed(1)} ${Math.min(100, Math.max(0, s + ds)).toFixed(1)}% ${Math.min(100, Math.max(0, l + dl)).toFixed(1)}%)`;

/* ---------- Variación por producto ---------- */

/** Hash estable: el mismo id da siempre el mismo resultado, aquí y en servidor. */
function hash(texto) {
  let h = 2166136261;
  for (const caracter of String(texto)) {
    h ^= caracter.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// Cuatro tintas del morado de la web, de la más oscura a la más clara.
const TONOS = [
  { ds: 0, dl: 0 },
  { ds: -8, dl: 10 },
  { ds: 4, dl: -6 },
  { ds: -14, dl: 18 },
];

export const NUM_TRAMAS = 4;

/**
 * Devuelve todo lo que necesita el componente para pintar la ficha.
 *
 * @param {Object} product - Necesita `category` e `id`; `brand` es opcional.
 */
export function visualDeProducto(product) {
  const base = CATEGORIAS[product?.category] || POR_DEFECTO;
  const h = hash(product?.id ?? product?.asin ?? product?.title ?? 'sin-id');
  const hslBase = hexAHsl(MORADO);
  const tono = TONOS[h % TONOS.length];

  return {
    icono: base.icono,
    color: hsl(hslBase, tono.ds, tono.dl),
    trama: (h >> 3) % NUM_TRAMAS,
    rotacion: ((h >> 6) % 4) * 90,
    semilla: h % 1000,
  };
}

/** Visual de una subcategoría: siempre oscuro, con el mosaico desplazado. */
export function visualDeSubcategoria(clave, categoria) {
  const base = CATEGORIAS[categoria] || POR_DEFECTO;
  const h = hash(clave);
  return { icono: base.icono, desfase: h % 5, inclinado: (h >> 4) % 2 === 1 };
}

/** Solo el color de una categoría, para cabeceras y listados. */
export function colorDeCategoria() {
  return MORADO;
}

export function iconoDeCategoria(nombre) {
  return (CATEGORIAS[nombre] || POR_DEFECTO).icono;
}
