import { Suspense } from 'react';
import Link from 'next/link';
import { getCategories, getBlogs } from '@/lib/supabase';
import BlogCard from '@/components/BlogCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

// Caché de 24 horas: el panel de administración la renueva al guardar (/api/revalidar)
export const revalidate = 86400;

// Sin la marca: la añade la plantilla de app/layout.js. Con ella puesta aquí
// también, el título salía «Reseñas - Tu Hogar Tech | Tu Hogar Tech».
export const metadata = {
  title: 'Reseñas de tecnología para casa',
  description:
    'Todas nuestras reseñas de tecnología para casa, ordenadas por categoría. Qué hace bien cada aparato, qué hace mal y para quién vale.',
  alternates: { canonical: '/resenas' },
  openGraph: {
    title: 'Reseñas de tecnología para casa | Tu Hogar Tech',
    description:
      'Todas nuestras reseñas de tecnología para casa, ordenadas por categoría. Qué hace bien cada aparato, qué hace mal y para quién vale.',
  },
};

async function CategoriesContent() {
  const [result, blogsResult] = await Promise.all([
    getCategories(),
    getBlogs({ status: 'published' }, 1, 6),
  ]);
  const allCategories = result.success ? result.data : [];
  const recientes = blogsResult.success ? blogsResult.data : [];
  
  // Filtrar solo categorías activas con productos
  const categories = allCategories
    .filter(cat => cat.is_active && cat.product_count > 0)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Todas las reseñas</h1>
        <p className={styles.subtitle}>
          {categories.length} categorías de tecnología para casa, analizadas una a una
        </p>
      </div>

      {/* Grid de Categorías */}
      <div className={styles.categoriesGrid}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link
              key={category.id}
              /* Directo a la ruta canónica: /productos/{slug} solo redirige
                 aquí desde next.config.cjs, y hacer pasar por el salto gasta
                 presupuesto de rastreo. */
              href={`/categoria/${category.slug}`}
              className={styles.categoryLink}
              prefetch={true}
            >
              {/* Solo la foto entera y el nombre debajo: el resto se ve
                  al entrar en la categoría. */}
              <div className={styles.categoryCard}>
                <div className={styles.categoryMedia}>
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt=""
                      className={styles.categoryImage}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.categoryImagePlaceholder} aria-hidden="true" />
                  )}
                </div>
                <h2 className={styles.categoryTitle}>{category.name}</h2>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Todavía no hay reseñas publicadas
            </p>
          </div>
        )}
      </div>

      {/* Debajo de las categorías, lo último publicado: quien llega al
          listado completo suele estar comparando, y ahí las guías ayudan más
          que otra fila de tarjetas. */}
      {recientes.length > 0 && (
        <section className={styles.recientes} aria-labelledby="articulos-recientes">
          <div className={styles.recientesCabecera}>
            <h2 id="articulos-recientes" className={styles.recientesTitulo}>
              Artículos recientes
            </h2>
            <Link href="/blog" className={styles.recientesTodos}>
              Ver todas las guías
            </Link>
          </div>
          <div className={styles.recientesLista}>
            {recientes.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ResenasPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Suspense fallback={<LoadingSpinner />}>
          <CategoriesContent />
        </Suspense>
      </div>
    </main>
  );
}
