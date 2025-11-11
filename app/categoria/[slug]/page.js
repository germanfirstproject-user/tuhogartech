import Link from 'next/link';
import styles from '../page.module.css';

export async function generateStaticParams() {
  return [{ slug: 'audio' }, { slug: 'tech' }];
}

export async function generateMetadata({ params }) {
  return {
    title: `Categoría | AffiliPro`,
    description: 'Productos en esta categoría',
  };
}

export default async function CategoryPage({ params }) {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Productos</h1>
      <p className={styles.description}>Contenido en desarrollo</p>
      <Link href="/productos" className={styles.button}>Volver</Link>
    </main>
  );
}

