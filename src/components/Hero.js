import Link from 'next/link';
import styles from './Hero.module.css';

/**
 * Portada editorial de la home.
 *
 * Deliberadamente sin fotografía de fondo ni superposición oscura: esa
 * combinación es la que hace que una home parezca una plantilla. En su lugar,
 * jerarquía tipográfica sobre el papel de la marca y un índice con las
 * categorías reales, que además es contenido navegable.
 */
export default function Hero({ stats, categories = [], product = null, productLabel = 'Destacado' }) {
  const topCategories = categories.slice(0, 6);

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.lead}>
          <p className={styles.eyebrow}>Análisis independientes</p>

          <h1 className={styles.title}>
            Tecnología para casa,
            <br />
            <span className={styles.titleAccent}>contada sin exagerar</span>
          </h1>

          <p className={styles.subtitle}>
            Fichas con especificaciones reales, ventajas concretas e
            inconvenientes que otros no cuentan. Sin lúmenes inflados ni
            capacidades inventadas.
          </p>

          <div className={styles.actions}>
            <Link href="/productos" className={styles.buttonPrimary}>
              Ver todos los productos
            </Link>
            <Link href="/blog" className={styles.buttonGhost}>
              Leer las guías
            </Link>
          </div>

          {stats?.productsCount > 0 && (
            <p className={styles.meta}>
              <strong>{stats.productsCount}</strong> productos analizados en{' '}
              <strong>{stats.categoriesCount}</strong> categorías
            </p>
          )}
        </div>

        <div className={styles.aside}>
          {product && (
            <Link href={`/producto/${product.id}`} className={styles.card}>
              <div className={styles.cardMedia}>
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className={styles.cardImage}
                    /* Es lo primero que se ve: se carga con prioridad */
                    fetchPriority="high"
                  />
                )}
                <span className={styles.cardBadge}>{productLabel}</span>
              </div>

              <div className={styles.cardBody}>
                {product.brand && <p className={styles.cardBrand}>{product.brand}</p>}
                <p className={styles.cardTitle}>{product.title}</p>

                {product.rating && (
                  <p className={styles.cardRating}>
                    <span className={styles.cardStars} aria-hidden="true">
                      {'★'.repeat(Math.round(product.rating))}
                      <span className={styles.cardStarsOff}>
                        {'★'.repeat(5 - Math.round(product.rating))}
                      </span>
                    </span>
                    <span className={styles.cardScore}>{product.rating}</span>
                    <span className={styles.cardSource}>en Amazon</span>
                  </p>
                )}

                <span className={styles.cardCta}>
                  Ver análisis
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {topCategories.length > 0 && (
          <nav className={styles.index} aria-label="Categorías principales">
            <p className={styles.indexLabel}>Explorar por categoría</p>
            <ul className={styles.indexList}>
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} className={styles.indexItem}>
                    <span className={styles.indexName}>{cat.name}</span>
                    <span className={styles.indexCount}>{cat.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/productos" className={styles.indexAll}>
              Ver todas las categorías
            </Link>
          </nav>
          )}
        </div>
      </div>
    </section>
  );
}
