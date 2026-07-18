import { BlogGridSkeleton } from '@/components/Skeletons';
import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.container}>
      <div className={styles.header} style={{ opacity: 0.6 }}>
        <div style={{ 
          height: '40px', 
          width: '200px', 
          background: 'var(--color-light-tertiary)', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }} />
        <div style={{ 
          height: '20px', 
          width: '500px', 
          background: 'var(--color-light-tertiary)', 
          borderRadius: '4px' 
        }} />
      </div>

      <BlogGridSkeleton count={6} />
    </main>
  );
}
