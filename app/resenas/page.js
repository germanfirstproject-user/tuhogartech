import { Suspense } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './page.module.css';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export const metadata = {
  title: 'Reseñas - Tu Hogar Tech',
  description:
    'Todas nuestras reseñas de tecnología para casa, ordenadas por categoría. Qué hace bien cada aparato, qué hace mal y para quién vale.',
  alternates: { canonical: '/resenas' },
  openGraph: {
    title: 'Reseñas - Tu Hogar Tech',
    description:
      'Todas nuestras reseñas de tecnología para casa, ordenadas por categoría. Qué hace bien cada aparato, qué hace mal y para quién vale.',
  },
};

async function CategoriesContent() {
  const result = await getCategories();
  const allCategories = result.success ? result.data : [];
  
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
              <div className={styles.categoryCard}>
                {/* Imagen de fondo */}
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className={styles.categoryImage}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.categoryImagePlaceholder}>
                    <span className={styles.placeholderIcon}>📦</span>
                  </div>
                )}

                {/* Overlay */}
                <div className={styles.categoryOverlay}>
                  <h2 className={styles.categoryTitle}>
                    {category.name}
                  </h2>
                  <p className={styles.categoryCount}>
                    {category.product_count} {category.product_count === 1 ? 'reseña' : 'reseñas'}
                  </p>
                  {category.description && (
                    <p className={styles.categoryDescription}>
                      {category.description}
                    </p>
                  )}
                </div>
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
