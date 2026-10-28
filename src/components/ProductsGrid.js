import ProductCard from './ProductCard';
import styles from './ProductsGrid.module.css';

/**
 * Rejilla de tarjetas de producto para listados (categoría, subcategoría y
 * buscador).
 *
 * @param {string[]} idsDestacados - Productos marcados como destacados en el
 *   panel. Su tarjeta lleva distintivo, igual que en los carruseles de la
 *   portada, para que la selección se reconozca también dentro del listado.
 * @param {string} origen - Listado desde el que se pulsa, para la medición.
 */
export default function ProductsGrid({ products, idsDestacados = [], origen = 'listado', pagina }) {
  const destacados = new Set(idsDestacados);

  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          origen={origen}
          pagina={pagina}
          posicion={i + 1}
          destacado={destacados.has(product.id)}
        />
      ))}
    </div>
  );
}
