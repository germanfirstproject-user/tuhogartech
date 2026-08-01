/**
 * Identidad visual de un producto sin usar fotografías de Amazon.
 *
 * Cada categoría tiene su color y su icono, para orientarse de un vistazo en
 * un catálogo de 19 secciones. Dentro de una misma categoría, cada producto
 * recibe una variación de tono y una trama distintas, derivadas de su id: sin
 * eso, los 48 productos de "Baterías y energía" saldrían idénticos.
 *
 * Todo es determinista: el mismo producto se ve siempre igual, y no hace
 * falta guardar nada ni generar archivos.
 */

// Los ocho primeros son las categorías con más productos y llevan colores
// claramente distintos entre sí. El resto puede acercarse más sin molestar.
const CATEGORIAS = {
  'Baterías y energía': { icono: 'energia', color: '#8a5a13' },
  'Smart Home': { icono: 'casa', color: '#166355' },
  'Streaming': { icono: 'streaming', color: '#7a4a5e' },
  'Almacenamiento': { icono: 'disco', color: '#3f5d80' },
  'Impresoras de etiquetas': { icono: 'etiquetas', color: '#7a5240' },
  'Proyectores': { icono: 'proyector', color: '#5b4a7a' },
  'Cultivo inteligente': { icono: 'planta', color: '#4a7038' },
  'Seguridad Inteligente': { icono: 'escudo', color: '#a8433b' },
  'Escáner': { icono: 'escaner', color: '#2f6d63' },
  'Papel': { icono: 'papel', color: '#6b675c' },
  'Conectividad | Docking': { icono: 'conector', color: '#45657a' },
  'Realidad virtual': { icono: 'vr', color: '#6a4a86' },
  'Ordenadores': { icono: 'portatil', color: '#4a5a6b' },
  'Cámara instantánea': { icono: 'camara', color: '#96562f' },
  'Impresoras portátiles': { icono: 'impresora', color: '#6d5a3a' },
  'Plotters': { icono: 'plotter', color: '#556b4a' },
  'Comederos automáticos': { icono: 'comedero', color: '#8a6a3c' },
  'Sistemas de alimentación': { icono: 'bateria', color: '#5c6b7a' },
  'Sistemas de sonido': { icono: 'altavoz', color: '#7a4a45' },
};

const POR_DEFECTO = { icono: 'caja', color: '#6b675c' };

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

// Cuatro desplazamientos de tono dentro del color de la categoría.
const TONOS = [
  { ds: 0, dl: 0 },
  { ds: -6, dl: 8 },
  { ds: 6, dl: -5 },
  { ds: -10, dl: 14 },
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

  const hslBase = hexAHsl(base.color);
  const tono = TONOS[h % TONOS.length];

  return {
    icono: base.icono,
    // Color de la categoría, matizado para este producto en concreto
    color: hsl(hslBase, tono.ds, tono.dl),
    // Fondo muy claro del mismo tono: da color sin gritar
    fondo: hsl(hslBase, -18, 92 - hslBase.l * 0.06),
    trama: (h >> 3) % NUM_TRAMAS,
    rotacion: ((h >> 6) % 4) * 45,
    semilla: h % 1000,
  };
}

/** Solo el color de una categoría, para cabeceras y listados. */
export function colorDeCategoria(nombre) {
  return (CATEGORIAS[nombre] || POR_DEFECTO).color;
}

export function iconoDeCategoria(nombre) {
  return (CATEGORIAS[nombre] || POR_DEFECTO).icono;
}
