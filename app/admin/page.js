'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase';
import styles from './page.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('user');
      setIsAdmin(false);
      setUserEmail('');
      router.push('/');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      localStorage.removeItem('user');
      router.push('/');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  useEffect(() => {
    // Verificar si es admin
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isAdmin) {
          setIsAdmin(true);
          setUserEmail(user.email || '');
        } else {
          // No es admin, redirigir a home
          router.push('/');
        }
      } catch (e) {
        // Error, redirigir a login
        router.push('/login');
      }
    } else {
      // No hay usuario, redirigir a login
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.content}>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.userEmail}>{userEmail}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            🚪 Cerrar Sesión
          </button>
        </div>
        
        <p className={styles.description}>
          Bienvenido al área de administración. Aquí puedes gestionar tu sitio.
        </p>
        
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Gestión de Productos</h3>
            <p>Crear, editar y eliminar productos</p>
          </div>
          
          <div className={styles.card}>
            <h3>Gestión de Usuarios</h3>
            <p>Ver y gestionar usuarios registrados</p>
          </div>
          
          <div className={styles.card}>
            <h3>Reportes</h3>
            <p>Ver estadísticas y análisis</p>
          </div>
          
          <div className={styles.card}>
            <h3>Configuración</h3>
            <p>Ajusta la configuración general</p>
          </div>
        </div>
        
        <Link href="/" className={styles.button}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
