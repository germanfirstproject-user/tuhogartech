import Link from 'next/link';
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];
  
  // Solo generar rutas para categorías activas con productos
  const activeCategories = categories.filter(cat => cat.is_active && cat.product_count > 0);

  return activeCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const categoryResult = await getCategoryBySlug(params.category);
  const category = categoryResult.success ? categoryResult.data : null;

  if (!category) {
    return {
      title: 'Categoría no encontrada - AffiliPro',
      description: 'La categoría solicitada no existe',
    };
  }

  return {
    title: category.seo_title || `${category.name} - Productos Afiliados | AffiliPro`,
    description: category.seo_description || `Descubre los mejores productos de ${category.name} con análisis detallados y comparativas`,
    openGraph: {
      title: category.seo_title || `${category.name} - AffiliPro`,
      description: category.seo_description || `Descubre los mejores productos de ${category.name}`,
      images: category.image_url ? [{ url: category.image_url }] : [],
    },
  };
}

export default async function CategoryPage({ params }) {
  const categoryResult = await getCategoryBySlug(params.category);
  const category = categoryResult.success ? categoryResult.data : null;
  
  if (!category) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h1>Categoría no encontrada</h1>
            <Link href="/productos" className={styles.backLink}>
              Volver a productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const result = await getProductsByCategory(category.name);
  const products = result.success ? result.data : [];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/productos" className={styles.breadcrumbLink}>
            <ArrowLeft className="w-4 h-4" />
            Volver a Productos
          </Link>
        </div>

        {/* Header con imagen de categoría */}
        {category.image_url && (
          <div className={styles.categoryBanner}>
            <img 
              src={category.image_url} 
              alt={category.name}
              className={styles.bannerImage}
            />
            <div className={styles.bannerOverlay} />
          </div>
        )}

        <div className={styles.header}>
          <h1 className={styles.mainTitle}>{category.name}</h1>
          {category.description && (
            <p className={styles.categoryDescription}>{category.description}</p>
          )}
          <p className={styles.subtitle}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Productos */}
        <div className={styles.productsGrid}>
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/producto/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.productCard}>
                  {/* Imagen */}
                  <div className={styles.imageContainer}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className={styles.productImage}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                        <span className={styles.imagePlaceholder}>Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className={styles.content}>
                    {/* Brand */}
                    {product.brand && (
                      <p className={styles.brand}>{product.brand}</p>
                    )}

                    {/* Título */}
                    <h3 className={styles.productTitle}>
                      {product.title}
                    </h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className={styles.ratingContainer}>
                        <span className={styles.ratingValue}>⭐</span>
                        <span className={styles.ratingScore}>{product.rating}/5</span>
                        {product.reviews_count > 0 && (
                          <span className={styles.ratingCount}>
                            ({product.reviews_count.toLocaleString('es-ES')} reseñas)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Descripción */}
                    {product.description && (
                      <p className={styles.description}>
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className={styles.priceSection}>
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>
                          {product.price}€
                        </span>
                        {product.stock === 'in_stock' && (
                          <span className={styles.stockBadge}>
                            En stock
                          </span>
                        )}
                      </div>

                      <button className={styles.button}>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateTitle}>
                No hay productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
