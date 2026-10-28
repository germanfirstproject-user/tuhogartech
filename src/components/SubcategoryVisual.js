import CategoryIcon from './CategoryIcon';
import { visualDeSubcategoria } from '@/lib/productVisual';
import styles from './ProductVisual.module.css';

/**
 * Visual de una subcategoría sin foto propia.
 *
 * A propósito no se parece al de un producto: bloque morado oscuro a sangre,
 * icono grande en blanco y un mosaico tenue del mismo icono. La tarjeta lleva
 * el nombre encima, así que el fondo oscuro también da contraste al texto.
 */
export default function SubcategoryVisual({ clave, categoria, className = '' }) {
  const { icono, desfase, inclinado } = visualDeSubcategoria(clave, categoria);

  return (
    <div className={`${styles.subVisual} ${inclinado ? styles.subInclinado : ''} ${className}`} role="presentation">
      <div className={styles.mosaico} style={{ '--desfase': desfase }} aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <CategoryIcon key={i} nombre={icono} className={styles.mosaicoIcono} />
        ))}
      </div>
      <CategoryIcon nombre={icono} className={styles.subIcono} />
    </div>
  );
}
