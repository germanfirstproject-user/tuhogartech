import Link from 'next/link';
import { getSiteSettings, getFeaturedProducts, getTopRatedProducts, getRecentBlogs, getSiteStats } from '@/lib/supabase';
import Carousel from '@/components/Carousel';
import AdminLink from '@/components/AdminLink';
import HeroCarousel from '@/components/HeroCarousel';
import AmazonDisclaimer from '@/components/AmazonDisclaimer';
import styles from './page.module.css';

// Revalidar cada 5 minutos (300 segundos) - buen balance entre rendimiento y frescura
export const revalidate = 300;

export const metadata = {
  title: 'Inicio - Los mejores productos',
  description: 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra',
};

export default async function HomePage() {
  // Cargar todos los datos en paralelo en el servidor (MUCHO más rápido)
  const [settingsResult, featuredResult, topRatedResult, blogsResult, statsResult] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getTopRatedProducts(10),
    getRecentBlogs(10),
    getSiteStats(),
  ]);

  const settings = settingsResult.success && settingsResult.data 
    ? {
        home_title: settingsResult.data.home_title || 'Encuentra los mejores productos',
        home_description: settingsResult.data.home_description || 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra',
        hero_image_1: settingsResult.data.hero_image_1,
        hero_image_1_mobile: settingsResult.data.hero_image_1_mobile,
        hero_image_2: settingsResult.data.hero_image_2,
        hero_image_2_mobile: settingsResult.data.hero_image_2_mobile,
        hero_image_2_link: settingsResult.data.hero_image_2_link,
        hero_image_2_alt: settingsResult.data.hero_image_2_alt,
        hero_image_3: settingsResult.data.hero_image_3,
        hero_image_3_mobile: settingsResult.data.hero_image_3_mobile,
        hero_image_3_link: settingsResult.data.hero_image_3_link,
        hero_image_3_alt: settingsResult.data.hero_image_3_alt,
        hero_image_4: settingsResult.data.hero_image_4,
        hero_image_4_mobile: settingsResult.data.hero_image_4_mobile,
        hero_image_4_link: settingsResult.data.hero_image_4_link,
        hero_image_4_alt: settingsResult.data.hero_image_4_alt,
      }
    : {
        home_title: 'Encuentra los mejores productos',
        home_description: 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra',
        hero_image_1: '',
        hero_image_1_mobile: '',
        hero_image_2: '',
        hero_image_2_mobile: '',
        hero_image_2_link: '',
        hero_image_2_alt: '',
        hero_image_3: '',
        hero_image_3_mobile: '',
        hero_image_3_link: '',
        hero_image_3_alt: '',
        hero_image_4: '',
        hero_image_4_mobile: '',
        hero_image_4_link: '',
        hero_image_4_alt: '',
      };

  const featuredProducts = featuredResult.success ? featuredResult.data : [];
  const topRatedProducts = topRatedResult.success ? topRatedResult.data : [];
  const recentBlogs = blogsResult.success ? blogsResult.data : [];
  const stats = statsResult.success ? statsResult.data : { productsCount: 0, categoriesCount: 0 };

  return (
    <main className={styles.main}>
      {/* Hero Carousel Section */}
      <HeroCarousel heroImages={settings} />

      {/* Combined Stats & Features Section */}
      <section className={styles.valueSection}>
        <div className={styles.valueContainer}>
          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCompact}>
              <span className={styles.statNumberCompact}>{stats.productsCount}+</span>
              <span className={styles.statLabelCompact}>Productos</span>
            </div>
            <div className={styles.statCompact}>
              <span className={styles.statNumberCompact}>{stats.categoriesCount}+</span>
              <span className={styles.statLabelCompact}>Categorías</span>
            </div>
          </div>
          
          {/* Features */}
          <div className={styles.featuresCompact}>
            <div className={styles.featureCompact}>
              <span className={styles.featureIconCompact}>✓</span>
              <span className={styles.featureTextCompact}>Reseñas honestas e imparciales</span>
            </div>
            <div className={styles.featureCompact}>
              <span className={styles.featureIconCompact}>📊</span>
              <span className={styles.featureTextCompact}>Comparativas detalladas</span>
            </div>
            <div className={styles.featureCompact}>
              <span className={styles.featureIconCompact}>💰</span>
              <span className={styles.featureTextCompact}>Mejores ofertas actualizadas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados por el Admin */}
      {featuredProducts.length > 0 && (
        <section className={styles.carouselSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>✨ Productos Destacados</h2>
            <p className={styles.sectionSubtitle}>Nuestra selección especial para ti</p>
          </div>
          <Carousel items={featuredProducts} type="product" />
        </section>
      )}

      {/* Productos Mejor Valorados */}
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>⭐ Productos Mejor Valorados</h2>
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
          <h2 className={styles.sectionTitle}>📚 Artículos Recientes</h2>
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