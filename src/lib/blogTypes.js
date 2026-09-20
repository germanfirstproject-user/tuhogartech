/**
 * Tipos de artículo del blog.
 *
 * Salen de la columna «Formato de contenido sugerido» del plan de keywords
 * (Keywords_SEO_TuHogarTech.xlsx), agrupando sus nueve formatos en los cuatro
 * que un lector distingue de un vistazo. El cuarto, `guia-compra`, no estaba
 * en la petición inicial pero es el grupo más grande del plan (2.828 keywords,
 * 541 de prioridad alta), así que se filtra aparte en vez de mezclarse con las
 * comparativas.
 *
 * El valor vive en `blogs.post_type`, con un CHECK que acepta solo estos
 * cuatro slugs o NULL (artículo sin clasificar).
 */
export const BLOG_TYPES = [
  {
    slug: 'comparativa',
    label: 'Comparativas',
    // "Cara a cara X vs Y con veredicto" + "Listado «los mejores…» con tabla"
    description: 'Varios modelos concretos enfrentados, con veredicto.',
  },
  {
    slug: 'guia-compra',
    label: 'Guías de compra',
    // "Guía de compra de la categoría" + "Guía de compra por caso de uso"
    description: 'Qué mirar para elegir dentro de una categoría.',
  },
  {
    slug: 'explicativo',
    label: 'Explicativos',
    // "Artículo pilar explicativo" + "Guía práctica o tutorial"
    description: 'Qué es algo, por qué pasa o cómo se usa.',
  },
  {
    slug: 'ficha-producto',
    label: 'Un producto a fondo',
    // "Ficha de análisis del modelo con alternativas" + "Análisis a fondo"
    description: 'Las características de un producto en particular.',
  },
];

export const BLOG_TYPE_SLUGS = BLOG_TYPES.map((t) => t.slug);

/** Devuelve el tipo si el slug es uno de los válidos; si no, null. */
export function resolveBlogType(slug) {
  if (!slug) return null;
  return BLOG_TYPES.find((t) => t.slug === slug) || null;
}

/** Etiqueta legible de un tipo, para pintarla en la tarjeta del artículo. */
export function blogTypeLabel(slug) {
  return resolveBlogType(slug)?.label || '';
}
