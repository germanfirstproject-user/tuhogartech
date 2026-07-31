import { getSiteSettings, getFeaturedProducts, getTopRatedProducts, getRecentBlogs, getSiteStats, getCategoriesWithCounts } from '@/lib/supabase';
import Carousel from '@/components/Carousel';
import AdminLink from '@/components/AdminLink';
import Hero from '@/components/Hero';
import ContentCarousel from '@/components/ContentCarousel';
import { buildContentSlides } from '@/lib/homeSlides';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import styles from './page.module.css';

// Revalidar cada 5 minutos (300 segundos) - buen balance entre rendimiento y frescura
export const revalidate = 300;

export const metadata = {
  title: 'Análisis de tecnología para el hogar',
  description:
    'Fichas con especificaciones reales, ventajas concretas e inconvenientes honestos. Baterías, domótica, proyectores, NAS y streaming analizados sin cifras infladas.',
  alternates: { canonical: 'https://tuhogartech.com' },
};

export default async function HomePage() {
  // Cargar todos los datos en paralelo en el servidor (MUCHO más rápido)
  const [settingsResult, featuredResult, topRatedResult, blogsResult, statsResult, categoriesResult] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getTopRatedProducts(10),
    getRecentBlogs(10),
    getSiteStats(),
    getCategoriesWithCounts(),
  ]);

  const featuredProducts = featuredResult.success ? featuredResult.data : [];
  const topRatedProducts = topRatedResult.success ? topRatedResult.data : [];
  const recentBlogs = blogsResult.success ? blogsResult.data : [];
  const stats = statsResult.success ? statsResult.data : { productsCount: 0, categoriesCount: 0 };
  const categories = categoriesResult.success ? categoriesResult.data : [];

  const settings = settingsResult.success ? settingsResult.data : null;

  const contentSlides = buildContentSlides(categories, recentBlogs, settings);

  // Gancho visual de la portada: dos productos. Primero los que el admin haya
  // destacado y, si no llegan a dos, se completa con los mejor valorados, de
  // modo que la portada nunca quede coja.
  const featuredIds = new Set(featuredProducts.map((p) => p.id));
  const heroCandidates = [...featuredProducts, ...topRatedProducts];
  const heroPicks = [];
  const pickedIds = new Set();
  const pickedCategories = new Set();

  // Dos pasadas: la primera evita que los dos huecos caigan en la misma
  // categoría (dos power banks juntos venden peor que dos cosas distintas);
  // la segunda rellena sin esa restricción por si el catálogo no da para más.
  for (const evitarRepetirCategoria of [true, false]) {
    for (const product of heroCandidates) {
      if (heroPicks.length === 2) break;
      if (!product || pickedIds.has(product.id)) continue;
      if (evitarRepetirCategoria && pickedCategories.has(product.category)) continue;

      pickedIds.add(product.id);
      pickedCategories.add(product.category);
      heroPicks.push({
        product,
        // Si viene de una selección manual se dice; si no, la etiqueta informa
        // de la categoría, más útil que repetir "Mejor valorado" dos veces.
        label: featuredIds.has(product.id) ? 'Destacado' : product.category || 'Mejor valorado',
      });
    }
  }

  return (
    <main className={styles.main}>
      <Hero stats={stats} categories={categories} picks={heroPicks} />

      <ContentCarousel slides={contentSlides} />

      {/* Productos Destacados por el Admin */}
      {featuredProducts.length > 0 && (
        <section className={styles.carouselSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Productos destacados</h2>
            <p className={styles.sectionSubtitle}>Nuestra selección especial para ti</p>
          </div>
          <Carousel items={featuredProducts} type="product" />
        </section>
      )}

      {/* Productos Mejor Valorados */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Los mejor valorados</h2>
          <p className={styles.sectionSubtitle}>Los productos con las mejores calificaciones de nuestros usuarios</p>
        </div>
        {topRatedProducts.length > 0 ? (
          <Carousel items={topRatedProducts} type="product" />
        ) : (
          <div className={styles.emptyCarousel}>No hay productos disponibles</div>
        )}
      </section>

      {/* Blogs Recientes */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Guías y análisis recientes</h2>
          <p className={styles.sectionSubtitle}>Las últimas guías y análisis de productos</p>
        </div>
        {recentBlogs.length > 0 ? (
          <Carousel items={recentBlogs} type="blog" />
        ) : (
          <div className={styles.emptyCarousel}>No hay artículos disponibles</div>
        )}
      </section>

      {/* Amazon Affiliate Disclaimer */}
      <AmazonDisclaimer />

      {/* Admin Section - Solo visible si es admin */}
      <AdminLink />
    </main>
  );
}