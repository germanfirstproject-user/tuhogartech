import BlogCard from '@/components/BlogCard';
import styles from './Categoria.module.css';

/** Bloque de artículos al pie de una categoría o subcategoría. */
export default function GuiasRelacionadas({ titulo, nota, articulos }) {
  if (!articulos?.length) return null;

  return (
    <section className={styles.guias} aria-labelledby="guias-relacionadas">
      <h2 id="guias-relacionadas" className={styles.guiasTitulo}>
        {titulo}
      </h2>
      {nota && <p className={styles.guiasNota}>{nota}</p>}
      <div className={styles.guiasLista}>
        {articulos.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
