import Link from 'next/link';
import { getProducts, getProductById, getProductSeo, getRelatedProducts, getBlogsReferencingProduct, getFeaturedProducts, getCategoryByName } from '@/lib/supabase';
import { categoryToSlug } from '@/lib/utils';
import { ArrowLeft, Package, Star, Users } from 'lucide-react';
import ProductVisitTracker from '@/components/ProductVisitTracker';
import ProductActions from './ProductActions';
import ProductCTA from './ProductCTA';
import Carousel from '@/components/Carousel';
import BlogCard from '@/components/BlogCard';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import styles from './page.module.css';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getProducts();
  const products = result.success ? result.data : [];
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const result = await getProductById(params.id);
  const product = result.success ? result.data : null;

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  // Obtener SEO personalizado si existe
  const seoResult = await getProductSeo(params.id);
  const seo = seoResult.success ? seoResult.data : null;

  return {
    title: seo?.seo_title || `${product.title} - Tu Hogar Tech`,
    description: seo?.seo_description || product.description || `${product.title} por ${product.brand || 'N/A'}${product.price != null ? `. Precio: ${product.price}€` : ''}${product.rating ? `. Valoración: ${product.rating}/5` : ''}.`,
    keywords: seo?.seo_keywords || `${product.title}, ${product.brand}, ${product.category}`,
    robots: seo?.meta_robots || 'index, follow',
    openGraph: {
      title: seo?.og_title || `${product.title} | Tu Hogar Tech`,
      description: seo?.og_description || product.description || `${product.title} - ${product.brand || 'N/A'}`,
      images: seo?.og_image ? [{ url: seo.og_image }] : product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: seo?.twitter_card || 'summary_large_image',
      title: seo?.twitter_title || seo?.og_title || product.title,
      description: seo?.twitter_description || seo?.og_description || product.description,
      images: seo?.twitter_image ? [seo.twitter_image] : seo?.og_image ? [seo.og_image] : product.images?.[0] ? [product.images[0]] : [],
    },
    alternates: {
      canonical: seo?.canonical_url || `https://tuhogartech.com/producto/${params.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const result = await getProductById(params.id);
  const product = result.success ? result.data : null;

  if (!product) {
    return (
      <div className={styles.emptyState}>
        <h1 className={styles.emptyStateTitle}>Producto no encontrado</h1>
        <Link href="/productos" style={{ marginTop: 'var(--space-4)' }}>
          <button className={styles.primaryButton}>Volver a Productos</button>
        </Link>
      </div>
    );
  }

  // Obtener datos relacionados
  const [relatedResult, blogsResult, featuredResult, categoryResult] = await Promise.all([
    getRelatedProducts(params.id, product.category, 4),
    getBlogsReferencingProduct(params.id, product.title, 4),
    getFeaturedProducts(),
    getCategoryByName(product.category)
  ]);

  const relatedProducts = relatedResult.success ? relatedResult.data : [];
  const referencingBlogs = blogsResult.success ? blogsResult.data : [];
  const featuredProducts = featuredResult.success ? featuredResult.data : [];
  const categoryData = categoryResult.success ? categoryResult.data : null;
  
  // Usar el slug real de la BD, o generarlo como fallback
  const categorySlug = categoryData?.slug || categoryToSlug(product.category);

  // Schema.org - Product
  //
  // Sin aggregateRating ni offers a propósito:
  //  - Las valoraciones son de Amazon, no reseñas recogidas en esta web.
  //    Marcarlas como calificación propia incumple las directrices de Google
  //    para fragmentos de reseña y expone a una acción manual por marcado
  //    estructurado con spam. Las estrellas se siguen mostrando en pantalla,
  //    atribuidas a Amazon, pero no se declaran al buscador.
  //  - No vendemos el producto: el vendedor es Amazon. Declarar una oferta
  //    propia con su precio sería inexacto.
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images || [],
    "description": product.description || product.title,
    "brand": product.brand ? {
      "@type": "Brand",
      "name": product.brand
    } : undefined,
    "sku": product.asin || product.id
  };

  // Schema.org - BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tuhogartech.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Productos",
        "item": "https://tuhogartech.com/productos"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://tuhogartech.com/categoria/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": `https://tuhogartech.com/producto/${params.id}`
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className={styles.main}>
        <ProductVisitTracker productId={params.id} product={product} />
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/productos" className={styles.breadcrumbLink}>
            Productos
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link
            href={`/categoria/${categorySlug}`}
            className={styles.breadcrumbLink}
          >
            {product.category}
          </Link>
        </div>

        {/* Contenido Principal */}
        <div className={styles.content}>
          {/* Image Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className={styles.mainImageImg}
                />
              ) : (
                <div className={styles.mainImagePlaceholder}>Sin imagen</div>
              )}
            </div>

            {/* Galería de imágenes */}
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.slice(1).map((img, idx) => (
                  <div key={idx} className={styles.thumbnail}>
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 2}`}
                      className={styles.thumbnailImg}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className={styles.infoSection}>
            {/* Categoría */}
            <Link
              href={`/categoria/${categorySlug}`}
              className={styles.breadcrumbLink}
              style={{ alignSelf: 'flex-start' }}
            >
              ← {product.category}
            </Link>

            {/* Header */}
            <div className={styles.header}>
              {product.brand && (
                <p className={styles.brand}>Marca: {product.brand}</p>
              )}
              <h1 className={styles.title}>{product.title}</h1>

              {/* Rating */}
              {product.rating && (
                <div className={styles.rating}>
                  <div className={styles.ratingValue}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} style={{ color: i < Math.round(product.rating) ? 'var(--color-star)' : 'var(--color-border-dark)' }}>
                          ★
                        </span>
                      ))}
                  </div>
                  <div className={styles.ratingText}>
                    <span className={styles.ratingScore}>{product.rating}/5</span>
                    {product.reviews_count != null && product.reviews_count > 0 && (
                      <span className={styles.ratingCount}>
                        ({product.reviews_count.toLocaleString('es-ES')} reseñas en Amazon)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className={styles.priceSection}>
              {product.price != null && (
                <div className={styles.priceContainer}>
                  <p className={styles.priceLabel}>Precio:</p>
                  <h2 className={styles.price}>{product.price}€</h2>
                </div>
              )}

              <div className={styles.metaInfo}>
                <span className={product.stock === 'in_stock' ? styles.stockIn : styles.stockOut} style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  display: 'inline-block'
                }}>
                  {product.stock === 'in_stock' ? '✓ En stock' : 'Agotado'}
                </span>
                {product.currency && (
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    Moneda: {product.currency}
                  </span>
                )}
              </div>

              {/* Botón de compra */}
              <ProductActions product={product} styles={styles} />
              
              {/* Amazon Price Disclaimer */}
              <AmazonDisclaimer variant="price" />
            </div>

            {/* Metadata compacta */}
            {(product.asin || product.subcategory) && (
              <div className={styles.compactMeta}>
                {product.asin && (
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    ASIN: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{product.asin}</span>
                  </span>
                )}
                {product.subcategory && (
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Subcategoría: <span style={{ fontWeight: 'bold' }}>{product.subcategory}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        {product.description && (
          <div className={styles.description}>
            <h2 className={styles.descriptionTitle}>Descripción</h2>
            <p className={styles.descriptionText}>{product.description}</p>
          </div>
        )}

        {/* Características */}
        {product.features && product.features.length > 0 && (
          <div className={styles.featuresSection}>
            <h2 className={styles.featuresTitle}>Características Principales</h2>
            <ul className={styles.featuresList}>
              {product.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span className={styles.featureText}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pros y Contras */}
        {(product.pros || product.cons) && (
          <div className={styles.prosConsSection}>
            {/* Pros */}
            {product.pros && product.pros.length > 0 && (
              <div className={styles.prosColumn}>
                <h2 className={styles.prosTitle}>
                  <span className={styles.prosIcon}>✓</span>
                  Ventajas
                </h2>
                <ul className={styles.prosList}>
                  {product.pros.map((pro, idx) => (
                    <li key={idx} className={styles.prosItem}>
                      <span className={styles.prosBullet}>+</span>
                      <span className={styles.prosText}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contras */}
            {product.cons && product.cons.length > 0 && (
              <div className={styles.consColumn}>
                <h2 className={styles.consTitle}>
                  <span className={styles.consIcon}>✗</span>
                  Desventajas
                </h2>
                <ul className={styles.consList}>
                  {product.cons.map((con, idx) => (
                    <li key={idx} className={styles.consItem}>
                      <span className={styles.consBullet}>−</span>
                      <span className={styles.consText}>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section style={{ 
            marginBottom: 'var(--space-12)',
            padding: 'var(--space-8)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'bold', 
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                width: '4px',
                height: '2rem',
                background: 'var(--color-primary)',
                borderRadius: '2px'
              }}></span>
              Más en {product.category}
            </h2>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              marginLeft: '1.5rem'
            }}>
              Otros productos que podrían interesarte
            </p>
            <Carousel items={relatedProducts} type="product" />
          </section>
        )}

        {/* Blogs que mencionan este producto */}
        {referencingBlogs.length > 0 && (
          <section style={{ 
            marginBottom: 'var(--space-12)',
            padding: 'var(--space-8)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'bold', 
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                width: '4px',
                height: '2rem',
                background: 'var(--color-primary)',
                borderRadius: '2px'
              }}></span>
              Artículos Relacionados
            </h2>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              marginLeft: '1.5rem'
            }}>
              Lee más sobre este producto en nuestro blog
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: 'var(--space-6)' 
            }}>
              {referencingBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        {/* Productos Destacados */}
        {featuredProducts.length > 0 && (
          <section style={{ 
            marginBottom: 'var(--space-12)',
            padding: 'var(--space-8)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'bold', 
              marginBottom: 'var(--space-2)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                width: '4px',
                height: '2rem',
                background: 'var(--color-primary)',
                borderRadius: '2px'
              }}></span>
              Productos destacados
            </h2>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              marginLeft: '1.5rem'
            }}>
              Los mejores productos seleccionados para ti
            </p>
            <Carousel items={featuredProducts} type="product" />
          </section>
        )}

        {/* Amazon Affiliate Disclaimer */}
        <AmazonDisclaimer />

        {/* CTA Final */}
        <ProductCTA product={product} />
      </div>
    </main>
    </>
  );
}
