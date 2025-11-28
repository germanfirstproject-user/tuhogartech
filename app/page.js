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
        hero_image_2: settingsResult.data.hero_image_2,
        hero_image_2_link: settingsResult.data.hero_image_2_link,
        hero_image_2_alt: settingsResult.data.hero_image_2_alt,
        hero_image_3: settingsResult.data.hero_image_3,
        hero_image_3_link: settingsResult.data.hero_image_3_link,
        hero_image_3_alt: settingsResult.data.hero_image_3_alt,
        hero_image_4: settingsResult.data.hero_image_4,
        hero_image_4_link: settingsResult.data.hero_image_4_link,
        hero_image_4_alt: settingsResult.data.hero_image_4_alt,
      }
    : {
        home_title: 'Encuentra los mejores productos',
        home_description: 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra'
      };

  const featuredProducts = featuredResult.success ? featuredResult.data : [];
  const topRatedProducts = topRatedResult.success ? topRatedResult.data : [];
  const recentBlogs = blogsResult.success ? blogsResult.data : [];
  const stats = statsResult.success ? statsResult.data : { productsCount: 0, categoriesCount: 0 };

  return (
    <main className={styles.main}>
      {/* Hero Carousel Section */}
      <HeroCarousel heroImages={settings} />

      {/* Stats Section - CON DATOS REALES */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{stats.productsCount}+</div>
            <div className={styles.statLabel}>Productos</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{stats.categoriesCount}+</div>
            <div className={styles.statLabel}>Categorías</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>¿Por qué elegirnos?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>
            <h3 className={styles.featureTitle}>Reseñas Honestas</h3>
            <p className={styles.featureDescription}>Análisis imparciales y detallados de cada producto</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Comparativas Completas</h3>
            <p className={styles.featureDescription}>Compara especificaciones y precios lado a lado</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>Mejores Ofertas</h3>
            <p className={styles.featureDescription}>Descubre las mejores ofertas disponibles</p>
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