import Link from 'next/link';
import { getProducts } from '@/lib/supabase';
import styles from './page.module.css';

export const metadata = {
  title: 'Productos - AffiliPro',
  description: 'Explora todas nuestras categorías de productos afiliados de Amazon',
  openGraph: {
    title: 'Productos - AffiliPro',
    description: 'Explora todas nuestras categorías de productos afiliados de Amazon',
  },
};

export default async function ProductosPage() {
  const products = await getProducts();

  // Extraer categorías únicas con conteo de productos
  const categoriesMap = {};
  products.forEach((product) => {
    if (product.category) {
      if (!categoriesMap[product.category]) {
        categoriesMap[product.category] = {
          name: product.category,
          count: 0,
          image: product.images?.[0],
        };
      }
      categoriesMap[product.category].count++;
    }
  });

  const categories = Object.values(categoriesMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Todos los Productos</h1>
          <p className={styles.subtitle}>
            Explora nuestras {categories.length} categorías de productos seleccionados
          </p>
        </div>

        {/* Grid de Categorías */}
        <div className={styles.categoriesGrid}>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.name}
                href={`/productos/${category.name}`}
                className={styles.categoryLink}
              >
                <div className={styles.categoryCard}>
                  {/* Imagen de fondo */}
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className={styles.categoryImage}
                    />
                  )}

                  {/* Overlay */}
                  <div className={styles.categoryOverlay}>
                    <h2 className={styles.categoryTitle}>
                      {category.name}
                    </h2>
                    <p className={styles.categoryCount}>
                      {category.count} {category.count === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                No hay productos disponibles aún
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
