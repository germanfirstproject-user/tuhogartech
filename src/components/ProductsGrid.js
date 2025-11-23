'use client';

import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import styles from './ProductsGrid.module.css';

export default function ProductsGrid({ products }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productWrapper}>
          <Link
            href={`/producto/${product.id}`}
            style={{ textDecoration: 'none', flex: 1 }}
          >
            <div className={styles.productCard}>
              {/* Imagen */}
              <div className={styles.imageContainer}>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.productImage}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span>Sin imagen</span>
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
                    {product.description.substring(0, 120)}
                    {product.description.length > 120 && '...'}
                  </p>
                )}

                {/* Footer */}
                <div className={styles.footer}>
                  <div className={styles.price}>{product.price}€</div>
                  <div className={product.stock === 'in_stock' ? styles.stockIn : styles.stockOut}>
                    {product.stock === 'in_stock' ? 'En stock' : 'Agotado'}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Botón de favorito fuera del Link */}
          <div className={styles.favoriteContainer}>
            <FavoriteButton productId={product.id} compact />
          </div>
        </div>
      ))}
    </div>
  );
}
