import styles from './Skeletons.module.css';

// Skeleton para tarjeta de producto
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageBox} />
      <div className={styles.content}>
        <div className={styles.titleLine} />
        <div className={styles.shortLine} />
        <div className={styles.mediumLine} />
        <div className={styles.buttonBox} />
      </div>
    </div>
  );
}

// Skeleton para tarjeta de blog
export function BlogCardSkeleton() {
  return (
    <div className={styles.blogCard}>
      <div className={styles.imageLarge} />
      <div className={styles.content}>
        <div className={styles.badge} />
        <div className={styles.titleLine} />
        <div className={styles.mediumLine} />
        <div className={styles.shortLine} />
      </div>
    </div>
  );
}

// Skeleton para tarjeta de categoría
export function CategoryCardSkeleton() {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.imageBox} />
      <div className={styles.overlay}>
        <div className={styles.titleLine} />
        <div className={styles.shortLine} />
      </div>
    </div>
  );
}

// Grid de productos con skeletons
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Grid de blogs con skeletons
export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.blogGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Grid de categorías con skeletons
export function CategoryGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton para carousel
export function CarouselSkeleton() {
  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.carouselItem}>
            <div className={styles.imageBox} />
            <div className={styles.shortLine} style={{ marginTop: '1rem' }} />
            <div className={styles.mediumLine} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para página de detalle de producto
export function ProductDetailSkeleton() {
  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailGrid}>
        <div className={styles.imageLarge} />
        <div className={styles.detailContent}>
          <div className={styles.titleLarge} />
          <div className={styles.mediumLine} />
          <div className={styles.mediumLine} />
          <div className={styles.buttonBox} style={{ marginTop: '2rem' }} />
        </div>
      </div>
    </div>
  );
}

// Loading general
export function LoadingSpinner({ size = 'medium', text = 'Cargando...' }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
}
