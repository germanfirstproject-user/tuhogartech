import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Blog - Gu�as y consejos',
  description: 'Gu�as de compra y an�lisis en desarrollo.',
};

export default function BlogListPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Blog</h1>
      <p className={styles.description}>Gu�as y an�lisis en desarrollo</p>
      <Link href="/" className={styles.button}>Volver</Link>
    </main>
  );
}
