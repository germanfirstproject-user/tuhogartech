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
    <div className={styles.productDetailPage}>
      <div className={styles.detailContainer}>
        {/* Breadcrumb Skeleton */}
        <div className={styles.breadcrumbSkeleton}>
          <div className={styles.shortLine} style={{ width: '80px' }} />
          <div className={styles.separator} />
          <div className={styles.shortLine} style={{ width: '120px' }} />
        </div>

        {/* Main Content Grid */}
        <div className={styles.detailGrid}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageLarge} style={{ height: '500px', borderRadius: 'var(--radius-lg)' }} />
            {/* Thumbnails */}
            <div className={styles.thumbnailGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.thumbnail} />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className={styles.detailContent}>
            {/* Category badge */}
            <div className={styles.badge} style={{ width: '100px', marginBottom: '1rem' }} />
            
            {/* Brand */}
            <div className={styles.shortLine} style={{ width: '150px', marginBottom: '0.5rem' }} />
            
            {/* Title */}
            <div className={styles.titleLarge} style={{ marginBottom: '1rem' }} />
            
            {/* Rating */}
            <div className={styles.ratingBox} />
            
            {/* El esqueleto ya no reserva hueco para precio ni disponibilidad:
                dibujaba una sombra de algo que después no aparece. */}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <div className={styles.buttonBox} style={{ flex: 1 }} />
              <div className={styles.buttonSmall} />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className={styles.descriptionSection}>
          <div className={styles.titleLine} style={{ marginBottom: '1rem' }} />
          <div className={styles.mediumLine} />
          <div className={styles.mediumLine} />
          <div className={styles.shortLine} />
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <div className={styles.titleLine} style={{ marginBottom: '1rem' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.featureLine} />
          ))}
        </div>

        {/* Related Products Carousel */}
        <div className={styles.carouselSection}>
          <div className={styles.titleLine} style={{ marginBottom: '1rem' }} />
          <CarouselSkeleton />
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
