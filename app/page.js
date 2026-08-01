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

const HOME_TITLE_POR_DEFECTO = 'Tu Hogar Tech — Análisis de tecnología para el hogar';
const HOME_DESCRIPCION_POR_DEFECTO =
  'Fichas con especificaciones reales, ventajas concretas e inconvenientes honestos. Baterías, domótica, proyectores, NAS y streaming analizados sin cifras infladas.';

/**
 * La home lee su SEO de site_settings, que es lo que edita el panel de
 * administración. Antes exportaba un `metadata` fijo que pisaba el `default`
 * del layout, así que los campos "Título SEO" y "Descripción SEO" de la home
 * no llegaban a la página.
 *
 * El título se marca como `absolute` para que no se le añada el sufijo de la
 * plantilla: en el panel hay un contador de 60 caracteres y con el sufijo la
 * cuenta no cuadraría con lo que ve Google.
 */
export async function generateMetadata() {
  const result = await getSiteSettings();
  const settings = result.success ? result.data : null;

  const title = settings?.home_title?.trim() || HOME_TITLE_POR_DEFECTO;
  const description = settings?.home_description?.trim() || HOME_DESCRIPCION_POR_DEFECTO;
  const keywords = settings?.home_keywords
    ?.split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title: settings?.home_og_title?.trim() || title,
      description: settings?.home_og_description?.trim() || description,
      ...(settings?.home_og_image ? { images: [settings.home_og_image] } : {}),
    },
    twitter: {
      title: settings?.home_twitter_title?.trim() || title,
      description: settings?.home_twitter_description?.trim() || description,
      ...(settings?.home_twitter_image ? { images: [settings.home_twitter_image] } : {}),
    },
    alternates: { canonical: 'https://tuhogartech.com' },
  };
}

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
  // Los dos primeros destacados que haya marcado el admin, respetando su orden
  // sin tocarlo: si se han elegido a mano, mandan tal cual.
  const heroPicks = featuredProducts
    .filter(Boolean)
    .slice(0, 2)
    .map((product) => ({ product, label: 'Destacado' }));

  // Solo si no llegan a dos se completa con los mejor valorados, para que la
  // portada nunca se quede coja. Ahí sí se evita repetir categoría y la
  // etiqueta muestra de qué sección viene.
  if (heroPicks.length < 2) {
    const pickedIds = new Set(heroPicks.map(({ product }) => product.id));
    const pickedCategories = new Set(heroPicks.map(({ product }) => product.category));

    for (const evitarRepetirCategoria of [true, false]) {
      for (const product of topRatedProducts) {
        if (heroPicks.length === 2) break;
        if (!product || pickedIds.has(product.id)) continue;
        if (evitarRepetirCategoria && pickedCategories.has(product.category)) continue;

        pickedIds.add(product.id);
        pickedCategories.add(product.category);
        heroPicks.push({ product, label: product.category || 'Mejor valorado' });
      }
    }
  }

  const idsEnPortada = new Set(heroPicks.map(({ product }) => product.id));
  const restoDestacados = featuredProducts.filter((p) => p && !idsEnPortada.has(p.id));

  return (
    <main className={styles.main}>
      <Hero stats={stats} categories={categories} picks={heroPicks} />

      <ContentCarousel slides={contentSlides} />

      {/* Resto de destacados: los dos primeros ya están en la portada y
          repetirlos justo debajo no aporta nada. */}
      {restoDestacados.length > 0 && (
        <section className={styles.carouselSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Más de la selección</h2>
            <p className={styles.sectionSubtitle}>
              Otros productos que recomendamos ahora mismo
            </p>
          </div>
          <Carousel items={restoDestacados} type="product" moduleName="home_mas_seleccion" />
        </section>
      )}

      {/* Productos Mejor Valorados */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Los mejor valorados</h2>
          <p className={styles.sectionSubtitle}>
            Los del catálogo con mejor nota en Amazon entre los que acumulan un
            número de reseñas suficiente
          </p>
        </div>
        {topRatedProducts.length > 0 ? (
          <Carousel items={topRatedProducts} type="product" moduleName="home_mejor_valorados" />
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
          <Carousel items={recentBlogs} type="blog" moduleName="home_guias_recientes" />
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