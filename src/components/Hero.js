import TrackedLink from './TrackedLink';
import ProductVisual from './ProductVisual';
import styles from './Hero.module.css';

/**
 * Portada editorial de la home.
 *
 * Dos zonas: arriba el titular a lo ancho, con el argumento y las acciones a
 * su derecha; debajo una balda con las dos selecciones y el índice de
 * categorías. Sin fotografía de fondo ni superposición oscura, que es lo que
 * hace que una home parezca una plantilla.
 */
export default function Hero({ stats, categories = [], picks = [] }) {
  const topCategories = categories.slice(0, 6);
  const visiblePicks = picks.filter((pick) => pick?.product).slice(0, 2);

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* ---- Titular ---- */}
        <div className={styles.lead}>
          <p className={styles.eyebrow}>Selección y análisis independientes</p>

          <h1 className={styles.title}>
            Lo mejor en
            <br />
            tecnología para casa,
            <br />
            <span className={styles.titleAccent}>y por qué lo es</span>
          </h1>

          <div className={styles.leadSide}>
            <p className={styles.subtitle}>
              Partimos de los productos mejor valorados en Amazon, comparamos
              sus características una a una y contamos también lo que falla.
              Sin lúmenes inflados ni capacidades inventadas.
            </p>

            <div className={styles.actions}>
              <TrackedLink
                href="/productos"
                modulo="home_portada_boton_catalogo"
                className={styles.buttonPrimary}
              >
                Ver todos los productos
              </TrackedLink>
              <TrackedLink
                href="/blog"
                modulo="home_portada_boton_guias"
                className={styles.buttonGhost}
              >
                Leer las guías
              </TrackedLink>
            </div>

            {stats?.productsCount > 0 && (
              <p className={styles.meta}>
                <strong>{stats.productsCount}</strong> productos analizados en{' '}
                <strong>{stats.categoriesCount}</strong> categorías
              </p>
            )}
          </div>
        </div>

        {/* ---- Balda: selecciones + índice ---- */}
        <div className={styles.shelf}>
          {visiblePicks.length > 0 && (
            <div className={styles.picks}>
              <p className={styles.blockLabel}>Empieza por aquí</p>
              <div className={styles.picksGrid}>
                {visiblePicks.map(({ product, label }, i) => (
                  <PickCard
                    key={product.id}
                    product={product}
                    label={label}
                    priority={i === 0}
                    posicion={i + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {topCategories.length > 0 && (
            <nav className={styles.index} aria-label="Categorías principales">
              <p className={styles.blockLabel}>Explorar por categoría</p>
              <ul className={styles.indexList}>
                {topCategories.map((cat, i) => (
                  <li key={cat.slug}>
                    <TrackedLink
                      href={`/categoria/${cat.slug}`}
                      modulo="home_portada_categorias"
                      itemId={cat.slug}
                      itemName={cat.name}
                      posicion={i + 1}
                      className={styles.indexItem}
                    >
                      <span className={styles.indexName}>{cat.name}</span>
                      <span className={styles.indexCount}>{cat.count}</span>
                    </TrackedLink>
                  </li>
                ))}
              </ul>
              <TrackedLink
                href="/productos"
                modulo="home_portada_todas_categorias"
                className={styles.indexAll}
              >
                Ver todas las categorías
              </TrackedLink>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Tarjeta de selección de la portada.
 *
 * No reutiliza la tarjeta de catálogo a propósito: aquí lo que se defiende es
 * la valoración, así que la nota va en grande y a la altura del titular, no
 * como un detalle al pie.
 */
function PickCard({ product, label, priority = false, posicion = 1 }) {
  // Postgres devuelve `rating` como cadena ("4.7"), así que hay que convertirlo
  // antes de formatearlo o saldría con punto en vez de coma.
  const rating = Number(product.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;
  const stars = hasRating ? Math.round(rating) : 0;
  const score = hasRating
    ? rating.toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    : null;

  const reviews = Number(product.reviews_count);
  const hasReviews = Number.isFinite(reviews) && reviews > 0;

  return (
    <TrackedLink
      href={`/producto/${product.id}`}
      /* Cada hueco de la portada se mide por separado: interesa saber si el
         segundo destacado recibe algo o si toda la atención va al primero. */
      modulo={`home_portada_destacado_${posicion}`}
      itemId={product.id}
      itemName={product.title}
      posicion={posicion}
      className={styles.card}
    >
      <div className={styles.cardMedia}>
        <ProductVisual product={product} mostrarMarca={false} />
        {label && <span className={styles.cardBadge}>{label}</span>}
      </div>

      <div className={styles.cardBody}>
        {product.brand && <p className={styles.cardBrand}>{product.brand}</p>}
        <p className={styles.cardTitle}>{product.title}</p>

        {score && (
          <div className={styles.cardRating}>
            <span className={styles.cardScore}>{score}</span>
            <span className={styles.cardRatingText}>
              <span className={styles.cardStars} aria-hidden="true">
                {'★'.repeat(stars)}
                <span className={styles.cardStarsOff}>{'★'.repeat(5 - stars)}</span>
              </span>
              <span className={styles.cardReviews}>
                {hasReviews
                  ? `${reviews.toLocaleString('es-ES')} reseñas en Amazon`
                  : 'valoración en Amazon'}
              </span>
            </span>
          </div>
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
    </TrackedLink>
  );
}
