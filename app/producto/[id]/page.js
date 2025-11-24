import Link from 'next/link';
import { getProducts, getProductById, getProductSeo, getRelatedProducts, getBlogsReferencingProduct, getFeaturedProducts, getCategoryByName } from '@/lib/supabase';
import { categoryToSlug } from '@/lib/utils';
import { ArrowLeft, Package, Star, Users } from 'lucide-react';
import ProductVisitTracker from '@/components/ProductVisitTracker';
import FavoriteButton from '@/components/FavoriteButton';
import Carousel from '@/components/Carousel';
import BlogCard from '@/components/BlogCard';
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
    title: seo?.seo_title || `${product.title} - AffiliPro`,
    description: seo?.seo_description || product.description || `${product.title} por ${product.brand || 'N/A'}. Precio: ${product.price}€. Valoración: ${product.rating}/5.`,
    keywords: seo?.seo_keywords || `${product.title}, ${product.brand}, ${product.category}`,
    robots: seo?.meta_robots || 'index, follow',
    openGraph: {
      title: seo?.og_title || `${product.title} | AffiliPro`,
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
      canonical: seo?.canonical_url || `https://tupagina.com/producto/${params.id}`,
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
    "sku": product.asin || product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://tupagina.com/producto/${params.id}`,
      "priceCurrency": product.currency || "EUR",
      "price": product.price,
      "availability": product.stock === 'in_stock' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "AffiliPro"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews_count || 1
    } : undefined
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
        "item": "https://tupagina.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Productos",
        "item": "https://tupagina.com/productos"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://tupagina.com/categoria/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": `https://tupagina.com/producto/${params.id}`
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
        <ProductVisitTracker productId={params.id} />
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
                <div className={styles.mainImagePlaceholder}>📦</div>
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
                        <span key={i} style={{ color: i < Math.round(product.rating) ? '#fbbf24' : '#d1d5db' }}>
                          ★
                        </span>
                      ))}
                  </div>
                  <div className={styles.ratingText}>
                    <span className={styles.ratingScore}>{product.rating}/5</span>
                    {product.reviews_count > 0 && (
                      <span className={styles.ratingCount}>
                        ({product.reviews_count.toLocaleString('es-ES')} reseñas)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className={styles.priceSection}>
              <div className={styles.priceContainer}>
                <p className={styles.priceLabel}>Precio</p>
                <h2 className={styles.price}>{product.price}€</h2>
              </div>

              {product.currency && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0' }}>
                  Moneda: {product.currency}
                </p>
              )}

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <span className={product.stock === 'in_stock' ? styles.stockIn : styles.stockOut} style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  display: 'inline-block'
                }}>
                  {product.stock === 'in_stock' ? '✓ En stock' : 'Agotado'}
                </span>
              </div>

              {/* Botón de compra */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {product.affiliate_link && (
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', flex: '1' }}
                  >
                    <button className={styles.primaryButton} style={{ width: '100%' }}>
                      Comprar en Amazon
                    </button>
                  </a>
                )}
                <FavoriteButton productId={product.id} />
              </div>
            </div>

            {/* ASIN */}
            {product.asin && (
              <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  ASIN: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{product.asin}</span>
                </p>
              </div>
            )}

            {/* Subcategoría */}
            {product.subcategory && (
              <div style={{ padding: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Subcategoría: <span style={{ fontWeight: 'bold' }}>{product.subcategory}</span>
                </p>
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

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section style={{ 
            marginBottom: 'var(--space-12)',
            padding: 'var(--space-8)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e5e7eb'
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
              Productos Relacionados de {product.category}
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
            background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e9d5ff'
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
                background: '#8b5cf6',
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
            background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #fde68a'
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
                background: '#f59e0b',
                borderRadius: '2px'
              }}></span>
              ⭐ Productos Destacados
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

        {/* CTA Final */}
        <div style={{
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          textAlign: 'center',
          marginBottom: 'var(--space-12)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-4)', margin: 0 }}>
            {product.title}
          </h3>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', margin: 'var(--space-4) 0' }}>
            Precio: <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {product.price}€
            </span>
          </p>
          {product.affiliate_link && (
            <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className={styles.primaryButton}>
                Ir a Amazon - Comprar Ahora
              </button>
            </a>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
