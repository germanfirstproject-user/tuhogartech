'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, getBlogs } from '@/lib/supabase';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBlogs: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Obtener total de productos
      const productsResult = await getProducts();
      const totalProducts = productsResult.success ? productsResult.data.length : 0;

      // Obtener total de blogs
      const blogsResult = await getBlogs();
      const totalBlogs = blogsResult.success ? blogsResult.data.length : 0;

      // Para usuarios, usar el Admin API o simplemente mostrar un mensaje
      // Como no tenemos acceso directo a auth.users, dejamos en 0 o implementamos después
      const totalUsers = 0; // Se puede implementar con una función especial del servidor

      setStats({
        totalProducts,
        totalBlogs,
        totalUsers,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Bienvenido, {user?.email}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛍️</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Productos</p>
            <p className={styles.statValue}>{stats.totalProducts}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Blogs</p>
            <p className={styles.statValue}>{stats.totalBlogs}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Usuarios</p>
            <p className={styles.statValue}>{stats.totalUsers}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Actividad Reciente</p>
            <p className={styles.statValue}>{stats.recentActivity.length}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/products" className={styles.actionCard}>
            <span className={styles.actionIcon}>➕</span>
            <span>Crear Producto</span>
          </a>
          <a href="/admin/blogs" className={styles.actionCard}>
            <span className={styles.actionIcon}>✍️</span>
            <span>Crear Blog</span>
          </a>
          <a href="/admin/users" className={styles.actionCard}>
            <span className={styles.actionIcon}>👤</span>
            <span>Ver Usuarios</span>
          </a>
        </div>
      </div>
    </div>
  );
}
