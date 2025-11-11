'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mi Perfil</h1>
      <p className={styles.description}>Funcionalidad en desarrollo</p>
      <Link href="/" className={styles.button}>Volver</Link>
    </div>
  );
}
