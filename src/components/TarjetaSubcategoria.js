import Link from 'next/link';
import ProductVisual from './ProductVisual';
import styles from './Categoria.module.css';

/**
 * Tarjeta de una subcategoría en la página de su categoría, con el mismo
 * aire que las de /resenas: imagen a sangre y el texto encima.
 *
 * La imagen sale de `subcategories.image_url` si se ha subido una. Si no, se
 * dibuja el visual de la categoría (su color y su icono) con una trama propia
 * de la subcategoría, igual que en las fichas sin foto.
 */
export default function TarjetaSubcategoria({ categoria, subcategoria }) {
  const { name, slug, description, image_url, count } = subcategoria;

  return (
    <Link href={`/categoria/${categoria.slug}/${slug}`} className={styles.tarjeta}>
      <div className={styles.tarjetaImagen}>
        {image_url ? (
          <img src={image_url} alt="" loading="lazy" decoding="async" />
        ) : (
          <ProductVisual
            product={{ id: `${categoria.slug}/${slug}`, category: categoria.name }}
            mostrarMarca={false}
          />
        )}
      </div>
      <div className={styles.tarjetaTexto}>
        <h3 className={styles.tarjetaTitulo}>{name}</h3>
        <p className={styles.tarjetaCuenta}>
          {count} {count === 1 ? 'reseña' : 'reseñas'}
        </p>
        {description && <p className={styles.tarjetaDescripcion}>{description}</p>}
      </div>
    </Link>
  );
}
