'use client';

import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configuración</h1>
      <p className={styles.subtitle}>Ajusta la configuración del sitio</p>
      
      <div className={styles.placeholder}>
        <p>⚙️ En desarrollo</p>
        <p>Aquí podrás configurar aspectos generales del sitio</p>
      </div>
    </div>
  );
}
