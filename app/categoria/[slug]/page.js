import Link from 'next/link';
import {
  getCategoryBySlug,
  getCategories,
  getProductsByCategory,
  getFeaturedProductIds,
} from '@/lib/supabase';
import ProductsGrid from '@/components/ProductsGrid';
import styles from '../page.module.css';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import CategoryAmazonCTA from '@/components/CategoryAmazonCTA';

// Revalidar cada 5 minutos (300 segundos)
export const revalidate = 300;

export async function generateStaticParams() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const result = await getCategoryBySlug(params.slug);
  const category = result.success ? result.data : null;

  if (!category) {
    return {
      title: 'Categoría no encontrada',
      description: 'La categoría que buscas no existe',
    };
  }

  return {
    title: category.seo_title || `${category.name} - Tu Hogar Tech`,
    description: category.seo_description || category.description || `Explora productos de ${category.name}`,
    keywords: category.seo_keywords || category.name,
    openGraph: {
      // El panel tiene campos OG propios para la categoría; antes se ignoraban
      // y siempre se usaba el título SEO.
      title: category.og_title || category.seo_title || category.name,
      description:
        category.og_description || category.seo_description || category.description,
      type: 'website',
      ...(category.og_image ? { images: [category.og_image] } : {}),
    },
    alternates: {
      canonical: `https://tuhogartech.com/categoria/${params.slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const result = await getCategoryBySlug(params.slug);
  const category = result.success ? result.data : null;

  if (!category) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Categoría no encontrada</h1>
          <p className={styles.description}>La categoría que buscas no existe o ha sido movida</p>
          <Link href="/productos" className={styles.button}>Volver a Productos</Link>
        </div>
      </main>
    );
  }

  // Obtener productos de esta categoría
  const [productsResult, destacadosResult] = await Promise.all([
    getProductsByCategory(category.name, 1, 100),
    getFeaturedProductIds(),
  ]);
  const products = productsResult.success ? productsResult.data : [];
  const idsDestacados = destacadosResult.success ? destacadosResult.data : [];

  return (
    <main className={styles.categoryPage}>
      <div className={styles.header}>
        <h1 className={styles.categoryTitle}>{category.name}</h1>
        {category.description && (
          <p className={styles.categoryDescription}>{category.description}</p>
        )}
      </div>

      {/* Antes del listado: quien busca una categoría entera suele querer ver
          el surtido, no una ficha concreta. */}
      <CategoryAmazonCTA category={category} />

      {products.length > 0 ? (
        <div className={styles.productsSection}>
          {/* El listado necesita su propio encabezado: sin él la página pasaba
              del h1 de la categoría a los h3 de cada tarjeta, saltándose un
              nivel, y no tenía ningún h2. */}
          <div className={styles.listadoHeader}>
            <h2 className={styles.listadoTitulo}>
              Todos los productos de {category.name}
            </h2>
            <p className={styles.listadoNota}>
              {products.length === 1
                ? '1 producto analizado, con sus características y su valoración en Amazon'
                : `${products.length} productos analizados, con sus características y su valoración en Amazon`}
            </p>
          </div>

          <ProductsGrid products={products} idsDestacados={idsDestacados} />
        </div>
      ) : (
        <div className={styles.emptyProducts}>
          <p>No hay productos disponibles en esta categoría todavía.</p>
          <Link href="/productos" className={styles.button}>Ver todos los productos</Link>
        </div>
      )}

      {products.length > 0 && <AmazonDisclaimer />}
    </main>
  );
}

