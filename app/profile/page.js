'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <h1 className={styles.title}>Mi Perfil</h1>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información de la cuenta</h2>
          <div className={styles.infoGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.value}>{user.email}</div>
          </div>
          <div className={styles.infoGroup}>
            <label className={styles.label}>Rol</label>
            <div className={styles.value}>
              {isAdmin ? (
                <span className={styles.badge}>👑 Administrador</span>
              ) : (
                <span className={styles.badge}>👤 Usuario</span>
              )}
            </div>
          </div>
          <div className={styles.infoGroup}>
            <label className={styles.label}>ID de usuario</label>
            <div className={styles.valueSmall}>{user.id}</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Acciones</h2>
          <div className={styles.actions}>
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className={styles.actionButton}
              >
                📊 Panel de Administración
              </button>
            )}
            <button
              onClick={() => router.push('/productos')}
              className={styles.actionButton}
            >
              🛍️ Ver Productos
            </button>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={() => router.push('/')}
            className={styles.backButton}
          >
            ← Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
}
