'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './AdminLink.module.css';

export default function AdminLink() {
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

  if (!isAdmin) return null;

  return (
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
  );
}
