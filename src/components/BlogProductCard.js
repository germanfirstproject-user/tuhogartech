import ProductCard from './ProductCard';

/**
 * Tarjeta de producto dentro de un artículo. Es la misma tarjeta de toda la
 * web (`ProductCard`), en fila cuando va intercalada en el texto y en columna
 * en el recopilatorio del final.
 *
 * Las posiciones de medición se conservan (`blog_articulo` y `blog_cierre`)
 * para que los informes de GA4 sigan comparables con los de antes.
 */
export default function BlogProductCard({ product, blog, index, compact = false }) {
  return (
    <ProductCard
      product={product}
      blog={blog}
      posicion={index}
      origen={compact ? 'blog_cierre' : 'blog_articulo'}
      pagina="blog"
      fila={!compact}
    />
  );
}
