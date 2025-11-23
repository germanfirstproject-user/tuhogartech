'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isLoggedIn, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', href: '/admin' },
    { id: 'products', label: '🛍️ Productos', href: '/admin/products' },
    { id: 'featured', label: '⭐ Destacados', href: '/admin/featured' },
    { id: 'blogs', label: '📝 Blogs', href: '/admin/blogs' },
    { id: 'categories', label: '📁 Categorías', href: '/admin/categories' },
    { id: 'users', label: '👥 Usuarios', href: '/admin/users' },
    { id: 'settings', label: '⚙️ Configuración', href: '/admin/settings' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
        
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                router.push(tab.href);
              }}
              className={styles.navItem}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
