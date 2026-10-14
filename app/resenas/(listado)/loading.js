/* Este listado vive en el grupo (listado) para que su pantalla de carga no
   envuelva también las fichas de /resenas/[ficha]. Con ella, la ficha
   empezaba a enviarse con un 200 antes de saber si tenía que redirigir o dar
   un 404, y esas respuestas acababan siendo 200 con una redirección por
   <meta>, que Google no trata como permanente. */
import { ProductGridSkeleton } from '@/components/Skeletons';
import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header} style={{ opacity: 0.6 }}>
          <div style={{ 
            height: '40px', 
            width: '300px', 
            background: 'var(--color-light-tertiary)', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }} />
          <div style={{ 
            height: '20px', 
            width: '400px', 
            background: 'var(--color-light-tertiary)', 
            borderRadius: '4px' 
          }} />
        </div>
        
        <ProductGridSkeleton count={6} />
      </div>
    </main>
  );
}
