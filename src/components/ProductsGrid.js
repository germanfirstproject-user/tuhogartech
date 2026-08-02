'use client';

import Link from 'next/link';
import ProductVisual from './ProductVisual';
import FavoriteButton from '@/components/FavoriteButton';
import styles from './ProductsGrid.module.css';

/**
 * @param {string[]} idsDestacados - Productos marcados como destacados en el
 *   panel. Su tarjeta lleva distintivo, igual que en los carruseles de la
 *   portada, para que la selección se reconozca también dentro del listado.
 */
export default function ProductsGrid({ products, idsDestacados = [] }) {
  const destacados = new Set(idsDestacados);

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
                <ProductVisual product={product} />
                {destacados.has(product.id) && (
                  <span className={styles.badgeDestacado}>Destacado</span>
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
                    <span className={styles.ratingStar}>★</span>
                    <span className={styles.ratingScore}>{product.rating}/5</span>
                    {product.reviews_count != null && product.reviews_count > 0 && (
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
                  {product.price != null && (
                    <div className={styles.price}>{product.price}€</div>
                  )}
                </div>
              </div>
            </div>
          </Link>
          
          {/* Stock y Botón de favorito en la misma línea */}
          <div className={styles.actionBar}>
            <div className={product.stock === 'in_stock' ? styles.stockIn : styles.stockOut}>
              {product.stock === 'in_stock' ? 'En stock' : 'Agotado'}
            </div>
            <FavoriteButton productId={product.id} compact />
          </div>
        </div>
      ))}
    </div>
  );
}
