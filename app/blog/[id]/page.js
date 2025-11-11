import Link from 'next/link';
import styles from '../page.module.css';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export async function generateMetadata({ params }) {
  return {
    title: 'Blog Post | AffiliPro',
    description: 'Lee nuestros últimos artículos',
  };
}

export default function BlogPostPage({ params }) {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Blog Post</h1>
      <p className={styles.description}>Contenido en desarrollo</p>
      <Link href="/blog" className={styles.button}>Volver</Link>
    </main>
  );
}
