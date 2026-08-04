import { getProducts, getCategories, getBlogs } from '@/lib/supabase';

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

  // Páginas fijas. Van primero y fuera del try para que el sitemap siga
  // siendo válido aunque la base de datos no responda durante la compilación.
  const estaticas = [
    { url: BASE, lastModified: ahora, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/productos`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.8 },
    // Prioridad alta para una página fija: es la que respalda la firma de
    // todos los artículos y a la que apunta el marcado de autoría.
    { url: `${BASE}/como-analizamos`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/aviso-legal`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacidad`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/terminos`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.2 },
  ];

  let dinamicas = [];

  try {
    const [productosRes, categoriasRes, blogsRes] = await Promise.all([
      getProducts(),
      getCategories(),
      getBlogs({ status: 'published' }, 0),
    ]);

    const productos = productosRes.success ? productosRes.data : [];
    const categorias = categoriasRes.success ? categoriasRes.data : [];
    const blogs = blogsRes.success ? blogsRes.data : [];

    dinamicas = [
      // Categorías. Se usa /categoria/{slug}, que es la ruta canónica:
      // /productos/{slug} existe pero solo redirige aquí.
      ...categorias
        .filter((c) => c.is_active)
        .map((c) => ({
          url: `${BASE}/categoria/${c.slug}`,
          lastModified: fecha(c.updated_at, c.created_at),
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

      // Fichas de producto: el grueso del sitio.
      ...productos.map((p) => ({
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
