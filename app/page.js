'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar si es admin desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsAdmin(user.isAdmin || false);
      } catch (e) {
        // Error parsing
      }
    }
  }, []);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Encuentra los mejores productos
            <br />
            <span style={{color: '#a78bfa'}}>al mejor precio</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra
          </p>
          <div className={styles.heroCTA}>
            <Link href="/productos" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
              Explorar productos
            </Link>
            <Link href="/blog" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
              Leer guías
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Productos</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Categorías</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100K+</div>
            <div className={styles.statLabel}>Usuarios</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4.9★</div>
            <div className={styles.statLabel}>Calificación</div>
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

      {/* Admin Section - Solo visible si es admin */}
      {isAdmin && (
        <section className={styles.adminSection}>
          <div className={styles.adminContainer}>
            <h2 className={styles.adminTitle}>Panel de Administración</h2>
            <p className={styles.adminDescription}>
              Como administrador, tienes acceso a herramientas especiales
            </p>
            <Link href="/admin" className={styles.adminButton}>
              Ir al Panel Admin →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}