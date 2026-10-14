import { MIN_PRODUCTOS_INDEXABLE } from '@/lib/categorias';
import { getProducts, getCategories, getBlogs, getProductIdsNoIndexables, getSubcategoryPages } from '@/lib/supabase';

const BASE = 'https://tuhogartech.com';

// El sitemap se regenera cada hora. Es contenido que cambia poco y no merece
// una consulta a la base de datos por cada visita de un rastreador.
export const revalidate = 3600;

/** Fecha válida para <lastmod>, o la de hoy si el registro no trae ninguna. */
function fecha(...candidatas) {
  for (const valor of candidatas) {
    if (!valor) continue;
    const d = new Date(valor);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default async function sitemap() {
  const ahora = new Date();

  // Las páginas legales y la de metodología van sin <lastmod>: antes llevaban
  // la hora de cada regeneración, así que el sitemap decía que cambiaban cada
  // hora sin cambiar nunca. Google deja de fiarse de las fechas de un sitemap
  // así, también de las que sí son buenas (artículos y fichas).
  //
  // Páginas fijas. Van primero y fuera del try para que el sitemap siga
  // siendo válido aunque la base de datos no responda durante la compilación.
  const estaticas = [
    { url: BASE, lastModified: ahora, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/resenas`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.8 },
    // Prioridad alta para una página fija: es la que respalda la firma de
    // todos los artículos y a la que apunta el marcado de autoría.
    { url: `${BASE}/como-analizamos`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/aviso-legal`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  let dinamicas = [];

  try {
    const [productosRes, categoriasRes, blogsRes, noIndexRes, subcategoriasRes] = await Promise.all([
      getProducts(),
      getCategories(),
      getBlogs({ status: 'published' }, 0),
      getProductIdsNoIndexables(),
      getSubcategoryPages(),
    ]);

    // Fichas marcadas como noindex. Si la consulta falla se deja el conjunto
    // vacío: un sitemap de más es preferible a uno que se queda sin productos.
    const noIndexables = new Set(noIndexRes.success ? noIndexRes.data : []);

    const productos = productosRes.success ? productosRes.data : [];
    const categorias = categoriasRes.success ? categoriasRes.data : [];
    const blogs = blogsRes.success ? blogsRes.data : [];
    const subcategorias = subcategoriasRes.success ? subcategoriasRes.data : [];

    dinamicas = [
      // Categorías. Se usa /categoria/{slug}, que es la ruta canónica:
      // /productos/{slug} solo redirige aquí, desde next.config.mjs.
      ...categorias
        .filter((c) => c.is_active)
        .map((c) => ({
          url: `${BASE}/categoria/${c.slug}`,
          lastModified: fecha(c.updated_at, c.created_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        })),

      // Subcategorías con página propia. Solo la primera página de cada una:
      // las siguientes se descubren por sus enlaces de paginación.
      ...subcategorias.filter((s) => s.count >= MIN_PRODUCTOS_INDEXABLE).map((s) => ({
        url: `${BASE}/categoria/${s.category_slug}/${s.slug}`,
        lastModified: fecha(s.updated_at),
        changeFrequency: 'weekly',
        priority: 0.7,
      })),

      // Artículos: solo los publicados, y con el mismo slug que su canonical.
      ...blogs
        .filter((b) => b.status === 'published')
        .map((b) => ({
          url: `${BASE}/blog/${b.slug || b.id}`,
          lastModified: fecha(b.updated_at, b.published_at, b.created_at),
          changeFrequency: 'monthly',
          priority: 0.8,
        })),

      // Fichas de producto. Solo las indexables: hoy son las que algún
      // artículo enlaza, que son las únicas que llegan con enlaces propios.
      ...productos
        .filter((p) => !noIndexables.has(p.id))
        .map((p) => ({
          url: `${BASE}/producto/${p.id}`,
          lastModified: fecha(p.updated_at, p.created_at),
          changeFrequency: 'weekly',
          priority: 0.6,
        })),
    ];
  } catch (error) {
    console.error('Sitemap: no se pudo leer el contenido dinámico', error);
  }

  return [...estaticas, ...dinamicas];
}
