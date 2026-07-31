import Link from 'next/link';
import AffiliateLink from './AffiliateLink';
import styles from './BlogProductCard.module.css';

/**
 * Tarjeta de producto intercalada en un artículo.
 *
 * Sustituye a los enlaces sueltos "Ver la ficha completa de…" que el texto ya
 * contenía. La acción principal es el enlace a Amazon, que es donde se
 * convierte; la secundaria lleva al análisis propio, para quien todavía está
 * decidiendo. Ambas salidas conviven porque cubren dos momentos distintos.
 */
export default function BlogProductCard({ product, compact = false }) {
  if (!product) return null;

  const image = product.images?.[0];
  const stars = product.rating ? Math.round(product.rating) : 0;

  return (
    <aside className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <Link href={`/producto/${product.id}`} className={styles.media} aria-hidden="true" tabIndex={-1}>
        {image && <img src={image} alt="" className={styles.image} loading="lazy" />}
      </Link>

      <div className={styles.body}>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}

        <h3 className={styles.title}>
          <Link href={`/producto/${product.id}`} className={styles.titleLink}>
            {product.title}
          </Link>
        </h3>

        {product.rating && (
          <p className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">
              {'★'.repeat(stars)}
              <span className={styles.starsOff}>{'★'.repeat(5 - stars)}</span>
            </span>
            <span className={styles.score}>{product.rating}</span>
            {product.reviews_count > 0 && (
              <span className={styles.count}>
                ({product.reviews_count.toLocaleString('es-ES')} reseñas en Amazon)
              </span>
            )}
          </p>
        )}

        <div className={styles.actions}>
          {product.affiliate_link && (
            <AffiliateLink
              href={product.affiliate_link}
              productId={product.id}
              productName={product.title}
              category={product.category}
              className={styles.buyButton}
            >
              Ver precio en Amazon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </AffiliateLink>
          )}

          <Link href={`/producto/${product.id}`} className={styles.detailLink}>
            Leer el análisis
          </Link>
        </div>
      </div>
    </aside>
  );
}
