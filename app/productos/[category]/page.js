import Link from 'next/link';
import { getProducts, getProductsByCategory } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export async function generateStaticParams() {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }) {
  const category = decodeURIComponent(params.category);

  return {
    title: `${category} - Productos Afiliados | AffiliPro`,
    description: `Descubre los mejores productos de ${category} con análisis detallados y comparativas`,
    openGraph: {
      title: `${category} - AffiliPro`,
      description: `Descubre los mejores productos de ${category}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const category = decodeURIComponent(params.category);
  const products = await getProductsByCategory(category);

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

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>{category}</h1>
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
