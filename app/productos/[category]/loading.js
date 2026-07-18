import { ProductGridSkeleton } from '@/components/Skeletons';
import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.breadcrumb} style={{ opacity: 0.6 }}>
          <div style={{ 
            height: '20px', 
            width: '150px', 
            background: 'var(--color-light-tertiary)', 
            borderRadius: '4px' 
          }} />
        </div>

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
            width: '250px', 
            background: 'var(--color-light-tertiary)', 
            borderRadius: '4px' 
          }} />
        </div>

        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
