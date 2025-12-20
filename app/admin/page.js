'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, getBlogs, getCategories, getUserStats, getAuthUsers } from '@/lib/supabase';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    confirmedUsers: 0,
    publishedBlogs: 0,
    recentProducts: [],
    recentBlogs: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Obtener productos
      const productsResult = await getProducts();
      const products = productsResult.success ? productsResult.data : [];
      const totalProducts = products.length;
      // Ordenar por fecha de creación (más recientes primero)
      const sortedProducts = [...products].sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      const recentProducts = sortedProducts.slice(0, 5);

      // Obtener blogs
      const blogsResult = await getBlogs();
      const blogs = blogsResult.success ? blogsResult.data : [];
      const totalBlogs = blogs.length;
      const publishedBlogs = blogs.filter(b => b.published).length;
      const recentBlogs = blogs.slice(0, 5);

      // Obtener categorías
      const categoriesResult = await getCategories();
      const totalCategories = categoriesResult.success ? categoriesResult.data.length : 0;

      // Obtener estadísticas de usuarios
      const userStatsResult = await getUserStats();
      const userStats = userStatsResult.success ? userStatsResult.data : {};

      // Obtener usuarios recientes
      const usersResult = await getAuthUsers();
      const users = usersResult.success ? usersResult.data : [];
      const recentUsers = users.slice(0, 5);

      setStats({
        totalProducts,
        totalBlogs,
        totalCategories,
        totalUsers: userStats.total || 0,
        confirmedUsers: userStats.confirmed || 0,
        publishedBlogs,
        recentProducts,
        recentBlogs,
        recentUsers
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard de Administración</h1>
          <p className={styles.subtitle}>Bienvenido, {user?.email}</p>
        </div>
        <button onClick={loadStats} className={styles.refreshButton}>
          🔄 Actualizar
        </button>
      </div>

      {/* Stats Grid - Primary */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => handleCardClick('/admin/products')}>
          <div className={styles.statIcon}>🛍️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalProducts}</h3>
            <p className={styles.statLabel}>Productos</p>
          </div>
          <div className={styles.statTrend}>Ver todos →</div>
        </div>

        <div className={styles.statCard} onClick={() => handleCardClick('/admin/blogs')}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalBlogs}</h3>
            <p className={styles.statLabel}>Blogs Totales</p>
            <p className={styles.statDetail}>{stats.publishedBlogs} publicados</p>
          </div>
          <div className={styles.statTrend}>Ver todos →</div>
        </div>

        <div className={styles.statCard} onClick={() => handleCardClick('/admin/categories')}>
          <div className={styles.statIcon}>🏷️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalCategories}</h3>
            <p className={styles.statLabel}>Categorías</p>
          </div>
          <div className={styles.statTrend}>Ver todas →</div>
        </div>

        <div className={styles.statCard} onClick={() => handleCardClick('/admin/users')}>
          <div className={styles.statIcon}>�</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalUsers}</h3>
            <p className={styles.statLabel}>Usuarios</p>
            <p className={styles.statDetail}>{stats.confirmedUsers} confirmados</p>
          </div>
          <div className={styles.statTrend}>Ver todos →</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🚀 Acciones Rápidas</h2>
        <div className={styles.actionsGrid}>
          <button onClick={() => handleCardClick('/admin/products')} className={styles.actionCard}>
            <span className={styles.actionIcon}>➕</span>
            <div className={styles.actionContent}>
              <h3>Nuevo Producto</h3>
              <p>Agregar producto al catálogo</p>
            </div>
          </button>

          <button onClick={() => handleCardClick('/admin/blogs')} className={styles.actionCard}>
            <span className={styles.actionIcon}>✍️</span>
            <div className={styles.actionContent}>
              <h3>Nuevo Blog</h3>
              <p>Crear entrada de blog</p>
            </div>
          </button>

          <button onClick={() => handleCardClick('/admin/categories')} className={styles.actionCard}>
            <span className={styles.actionIcon}>🏷️</span>
            <div className={styles.actionContent}>
              <h3>Nueva Categoría</h3>
              <p>Agregar categoría de productos</p>
            </div>
          </button>

          <button onClick={() => handleCardClick('/generar-excel')} className={styles.actionCard}>
            <span className={styles.actionIcon}>📊</span>
            <div className={styles.actionContent}>
              <h3>Generar Excel</h3>
              <p>Exportar datos de Amazon</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.recentSection}>
        {/* Recent Products */}
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>📦 Productos Recientes</h2>
            <button onClick={() => handleCardClick('/admin/products')} className={styles.viewAllLink}>
              Ver todos →
            </button>
          </div>
          {stats.recentProducts.length > 0 ? (
            <div className={styles.recentList}>
              {stats.recentProducts.map((product) => (
                <div key={product.id} className={styles.recentItem} onClick={() => handleCardClick(`/producto/${product.id}`)}>
                  <div className={styles.recentItemIcon}>🛍️</div>
                  <div className={styles.recentItemContent}>
                    <h4>{product.title || 'Producto sin nombre'}</h4>
                    <p>ID: {product.id.substring(0, 8)}...</p>
                  </div>
                  {product.price != null && (
                    <div className={styles.recentItemPrice}>${product.price}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No hay productos aún</p>
          )}
        </div>

        {/* Recent Blogs */}
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>📰 Blogs Recientes</h2>
            <button onClick={() => handleCardClick('/admin/blogs')} className={styles.viewAllLink}>
              Ver todos →
            </button>
          </div>
          {stats.recentBlogs.length > 0 ? (
            <div className={styles.recentList}>
              {stats.recentBlogs.map((blog) => (
                <div key={blog.id} className={styles.recentItem} onClick={() => handleCardClick(`/blog/${blog.slug}`)}>
                  <div className={styles.recentItemIcon}>�</div>
                  <div className={styles.recentItemContent}>
                    <h4>{blog.title}</h4>
                    <p>{new Date(blog.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                  <span className={blog.published ? styles.badgePublished : styles.badgeDraft}>
                    {blog.published ? '✓ Publicado' : '⏳ Borrador'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No hay blogs aún</p>
          )}
        </div>

        {/* Recent Users */}
        <div className={styles.recentCard}>
          <div className={styles.recentHeader}>
            <h2 className={styles.sectionTitle}>👤 Usuarios Nuevos</h2>
            <button onClick={() => handleCardClick('/admin/users')} className={styles.viewAllLink}>
              Ver todos →
            </button>
          </div>
          {stats.recentUsers.length > 0 ? (
            <div className={styles.recentList}>
              {stats.recentUsers.map((userItem) => (
                <div key={userItem.id} className={styles.recentItem}>
                  <div className={styles.recentItemIcon}>👤</div>
                  <div className={styles.recentItemContent}>
                    <h4>{userItem.email}</h4>
                    <p>Registrado: {new Date(userItem.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                  <span className={userItem.email_confirmed_at ? styles.badgePublished : styles.badgeDraft}>
                    {userItem.email_confirmed_at ? '✓ Confirmado' : '⏳ Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No hay usuarios nuevos</p>
          )}
        </div>
      </div>
    </div>
  );
}
