'use client';

import styles from './page.module.css';

export default function UsersPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Usuarios</h1>
      <p className={styles.subtitle}>Próximamente: Lista de usuarios registrados</p>
      
      <div className={styles.placeholder}>
        <p>🚧 En desarrollo</p>
        <p>Aquí podrás ver y gestionar todos los usuarios registrados</p>
      </div>
    </div>
  );
}
