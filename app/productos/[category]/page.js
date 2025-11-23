import Link from 'next/link';
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import ProductsGrid from '@/components/ProductsGrid';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];
  
  // Solo generar rutas para categorías activas con productos
  const activeCategories = categories.filter(cat => cat.is_active && cat.product_count > 0);

  return activeCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const categoryResult = await getCategoryBySlug(params.category);
  const category = categoryResult.success ? categoryResult.data : null;

  if (!category) {
    return {
      title: 'Categoría no encontrada - AffiliPro',
      description: 'La categoría solicitada no existe',
    };
  }

  // Usar campos SEO de la base de datos o valores por defecto
  const title = category.seo_title || `${category.name} - Productos Afiliados | AffiliPro`;
  const description = category.seo_description || `Descubre los mejores productos de ${category.name} con análisis detallados y comparativas`;
  const keywords = category.seo_keywords || `${category.name}, productos, compras, ofertas, amazon`;

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: category.og_title || category.seo_title || `${category.name} - AffiliPro`,
      description: category.og_description || category.seo_description || `Descubre los mejores productos de ${category.name}`,
      images: category.og_image ? [{ url: category.og_image }] : category.image_url ? [{ url: category.image_url }] : [],
      type: 'website',
      siteName: 'AffiliPro',
    },
    twitter: {
      card: 'summary_large_image',
      title: category.og_title || category.seo_title || `${category.name}`,
      description: category.og_description || category.seo_description || description,
      images: category.og_image ? [category.og_image] : category.image_url ? [category.image_url] : [],
    },
    alternates: {
      canonical: `https://tupagina.com/productos/${params.category}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 12;

  const categoryResult = await getCategoryBySlug(params.category);
  const category = categoryResult.success ? categoryResult.data : null;
  
  if (!category) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <h1>Categoría no encontrada</h1>
            <Link href="/productos" className={styles.backLink}>
              Volver a productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const result = await getProductsByCategory(category.name, page, pageSize);
  const products = result.success ? result.data : [];
  const totalPages = result.totalPages || 1;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/productos" className={styles.breadcrumbLink}>
            <ArrowLeft className="w-4 h-4" />
            Volver a Productos
          </Link>
        </div>

        {/* Header con imagen de categoría */}
        {category.image_url && (
          <div className={styles.categoryBanner}>
            <img 
              src={category.image_url} 
              alt={category.name}
              className={styles.bannerImage}
              loading="eager"
            />
            <div className={styles.bannerOverlay} />
          </div>
        )}

        <div className={styles.header}>
          <h1 className={styles.mainTitle}>{category.name}</h1>
          {category.description && (
            <p className={styles.categoryDescription}>{category.description}</p>
          )}
          <p className={styles.subtitle}>
            {result.totalCount || products.length} {products.length === 1 ? 'producto' : 'productos'} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Productos */}
        {products.length > 0 ? (
          <>
            <ProductsGrid products={products} />
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              baseUrl={`/productos/${params.category}`}
            />
          </>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateTitle}>
              No hay productos en esta categoría
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
