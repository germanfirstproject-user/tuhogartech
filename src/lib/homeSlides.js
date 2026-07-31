/**
 * Construye las diapositivas del carrusel de la portada a partir del contenido
 * real de la web, para que nunca apunten a una página vacía ni haya que
 * mantenerlas a mano cuando cambia el catálogo.
 */

// Portadas propias por categoría. La clave es el slug de la tabla categories.
const COVERS = {
  'bateras-y-energa': '/hero/hub-energia.webp',
  'smart-home': '/hero/hub-smart-home.webp',
  streaming: '/hero/hub-streaming.webp',
  almacenamiento: '/hero/hub-almacenamiento.webp',
};

const COVER_FALLBACK = '/hero/hub-guias.webp';

// Gancho editorial por categoría: qué encuentra ahí quien entra.
const PITCHES = {
  'bateras-y-energa': {
    kicker: 'Energía portátil',
    title: 'Baterías y estaciones de energía',
    text: 'Desde una power bank de bolsillo hasta un respaldo de 6 kWh para toda la casa. Con la capacidad real en Wh y qué se puede enchufar de verdad a cada una.',
  },
  'smart-home': {
    kicker: 'Hogar conectado',
    title: 'Domótica que funciona sin dolores de cabeza',
    text: 'Enchufes, bombillas, termostatos y cerraduras. Explicamos cuáles necesitan hub, cuáles se atan a un ecosistema y cuáles funcionan con Matter.',
  },
  streaming: {
    kicker: 'Crear y emitir',
    title: 'Equipo para streaming y vídeo',
    text: 'Webcams, capturadoras y micrófonos analizados por lo que de verdad importa: cómo se ve con poca luz y cómo suena la voz en una grabación.',
  },
  almacenamiento: {
    kicker: 'Guardar tus datos',
    title: 'NAS y discos para tu nube privada',
    text: 'Servidores NAS, discos CMR y SSD externos, con el detalle que se suele omitir: qué disco aguanta un RAID y cuánto ancho de banda necesitas.',
  },
};

const CATEGORY_ORDER = ['bateras-y-energa', 'smart-home', 'streaming', 'almacenamiento'];

/**
 * @param categories  Categorías con conteo, de getCategoriesWithCounts().
 * @param blogs       Últimas entradas publicadas.
 * @param settings    Fila de site_settings. Si hay hero_image_1..4 subidas
 *                    desde el panel de administración, sustituyen en orden a
 *                    las portadas por defecto, así que se pueden cambiar sin
 *                    tocar el código.
 */
export function buildContentSlides(categories = [], blogs = [], settings = null) {
  const bySlug = new Map(categories.map((cat) => [cat.slug, cat]));
  const overrides = [
    settings?.hero_image_1,
    settings?.hero_image_2,
    settings?.hero_image_3,
    settings?.hero_image_4,
  ];
  const slides = [];

  for (const slug of CATEGORY_ORDER) {
    const category = bySlug.get(slug);
    const pitch = PITCHES[slug];
    if (!category || !pitch) continue;

    slides.push({
      href: `/categoria/${slug}`,
      image: COVERS[slug] || COVER_FALLBACK,
      kicker: pitch.kicker,
      title: pitch.title,
      text: pitch.text,
      cta: `Ver los ${category.count} productos`,
    });
  }

  // La guía más reciente cierra el carrusel; si aún no hay ninguna publicada,
  // se enlaza el blog como sección.
  const latest = blogs[0];
  slides.push(
    latest
      ? {
          href: `/blog/${latest.slug || latest.id}`,
          image: latest.featured_image || COVER_FALLBACK,
          kicker: 'Guías y análisis',
          title: latest.title,
          text:
            latest.excerpt ||
            'Comparativas y guías de compra escritas con criterio, sin repetir la ficha del fabricante.',
          cta: 'Leer la guía',
        }
      : {
          href: '/blog',
          image: COVER_FALLBACK,
          kicker: 'Guías y análisis',
          title: 'Comparativas y guías de compra',
          text: 'Análisis escritos con criterio propio, sin repetir la ficha del fabricante ni inflar cifras.',
          cta: 'Ver todas las guías',
        }
  );

  // Las imágenes subidas al panel mandan sobre las portadas por defecto.
  return slides.map((slide, i) => {
    const custom = overrides[i];
    return custom ? { ...slide, image: custom } : slide;
  });
}
