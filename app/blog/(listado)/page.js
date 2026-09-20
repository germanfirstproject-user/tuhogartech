import Link from 'next/link';
import { getBlogs, getBlogFacets } from '@/lib/supabase';
import { categoryToSlug } from '@/lib/utils';
import { blogTypeLabel } from '@/lib/blogTypes';
import { resolverFiltros, calcularRecuentos } from '@/lib/blogFilters';
import BlogFilters from '@/components/BlogFilters';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

// Revalidar cada 10 minutos (600 segundos)
export const revalidate = 600;

const TITULO_BASE = 'Blog - Guías y consejos';
const DESCRIPCION_BASE = 'Guías de compra, análisis y consejos sobre productos.';

export async function generateMetadata({ searchParams }) {
  const facetas = await getBlogFacets();
  const filas = facetas.success ? facetas.data : [];
  const { categoria, tipo } = resolverFiltros(searchParams, filas);

  if (!categoria && !tipo) {
    return {
      title: TITULO_BASE,
      description: DESCRIPCION_BASE,
      alternates: { canonical: 'https://tuhogartech.com/blog' },
    };
  }

  // Una vista filtrada es un recorte del listado, no una página nueva: se
  // deja fuera del índice y se apunta el canónico al listado completo para
  // no competir contra él con contenido casi idéntico.
  const partes = [blogTypeLabel(tipo), categoria].filter(Boolean);

  return {
    title: `${partes.join(' · ')} - Blog`,
    description: DESCRIPCION_BASE,
    robots: { index: false, follow: true },
    alternates: { canonical: 'https://tuhogartech.com/blog' },
  };
}

export default async function BlogListPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 12;

  const facetas = await getBlogFacets();
  const filas = facetas.success ? facetas.data : [];

  const filtros = resolverFiltros(searchParams, filas);
  const { categoria, tipo } = filtros;
  const { categorias, tipos } = calcularRecuentos(filas, filtros);

  const result = await getBlogs(
    { status: 'published', category: categoria || undefined, postType: tipo || undefined },
    page,
    pageSize
  );
  const blogs = result.success ? result.data : [];
  const totalPages = result.totalPages || 1;
  const hayFiltros = Boolean(categoria || tipo);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.description}>
          Guías de compra, análisis y consejos sobre los mejores productos
        </p>
        {result.totalCount > 0 && (
          <p className={styles.count}>
            {result.totalCount} {result.totalCount === 1 ? 'artículo' : 'artículos'}
            {hayFiltros && ' con estos filtros'}
          </p>
        )}
      </div>

      <BlogFilters
        categorias={categorias}
        tipos={tipos}
        categoriaActiva={categoria ? categoryToSlug(categoria) : ''}
        tipoActivo={tipo}
      />

      {blogs.length > 0 ? (
        <>
          <div className={styles.blogsGrid}>
            {blogs.map((blog) => (
              <Link 
                href={`/blog/${blog.slug || blog.id}`} 
                key={blog.id}
                className={styles.blogCard}
                prefetch={true}
              >
                {blog.featured_image && (
                  <div className={styles.blogImageContainer}>
                    <img 
                      src={blog.featured_image} 
                      alt={blog.featured_image_alt || blog.title}
                      className={styles.blogImage}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className={styles.blogContent}>
                  <div className={styles.blogLabels}>
                    {blog.category && (
                      <span className={styles.blogCategory}>{blog.category}</span>
                    )}
                    {blog.post_type && (
                      <span className={styles.blogType}>{blogTypeLabel(blog.post_type)}</span>
                    )}
                  </div>
                  <h2 className={styles.blogTitle}>{blog.title}</h2>
                  {blog.excerpt && (
                    <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                  )}
                  <div className={styles.blogMeta}>
                    {blog.published_at && (
                      <span className={styles.blogDate}>
                        {new Date(blog.published_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    <span className={styles.blogAuthor}>Tu Hogar Tech</span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className={styles.blogTags}>
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={styles.blogTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/blog"
          />
        </>
      ) : (
        <div className={styles.empty}>
          <p>
            {hayFiltros
              ? 'No hay artículos que cumplan los dos filtros a la vez.'
              : 'No hay artículos publicados aún.'}
          </p>
          <Link href={hayFiltros ? '/blog' : '/'} className={styles.button}>
            {hayFiltros ? 'Ver todos los artículos' : 'Volver al inicio'}
          </Link>
        </div>
      )}
    </main>
  );
}
