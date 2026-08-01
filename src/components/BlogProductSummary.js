import BlogProductCard from './BlogProductCard';
import styles from './BlogProductSummary.module.css';

/**
 * Recopilatorio al cierre del artículo.
 *
 * Quien llega al final ya ha leído el argumento y es cuando más cerca está de
 * decidir; tener aquí los productos citados evita obligarle a subir a buscarlos.
 */
export default function BlogProductSummary({ products = [], blog }) {
  if (products.length === 0) return null;

  return (
    <section className={styles.summary} aria-labelledby="productos-mencionados">
      <h2 id="productos-mencionados" className={styles.title}>
        Productos mencionados en este artículo
      </h2>
      <p className={styles.intro}>
        Los precios cambian a menudo, así que los enlaces llevan a la ficha
        actualizada en Amazon.
      </p>

      <div className={styles.list}>
        {products.map((product, i) => (
          <BlogProductCard
            key={product.id}
            product={product}
            blog={blog}
            index={i + 1}
            compact
          />
        ))}
      </div>
    </section>
  );
}
