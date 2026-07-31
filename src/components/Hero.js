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
export default function Hero({ stats, categories = [] }) {
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
    </section>
  );
}
