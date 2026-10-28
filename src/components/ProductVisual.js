import CategoryIcon from './CategoryIcon';
import ProductPhoto from './ProductPhoto';
import { visualDeProducto } from '@/lib/productVisual';
import styles from './ProductVisual.module.css';

/**
 * Imagen de la ficha: la fotografía propia si la hay, y si no, la identidad
 * visual de la categoría.
 *
 * El visual es una lámina técnica clara: retícula fina, icono de la categoría
 * en tinta morada, una trama y un tono propios de cada producto para que dos
 * fichas de la misma sección no salgan iguales, y la marca en el pie. Las
 * subcategorías usan otro visual (`SubcategoryVisual`), oscuro, para que no
 * se confundan con un producto.
 *
 * Se dibuja entero con SVG y CSS, así que no pesa, no depende de terceros y
 * cualquier producto nuevo queda cubierto sin preparar nada. Por eso sigue
 * siendo el respaldo: mientras el catálogo se fotografía, las fichas sin foto
 * y las que no consigan cargarla se ven exactamente igual que hasta ahora.
 *
 * La foto sale de `products.image_url`, servida desde el bucket
 * `product-images`. La columna `images` guarda URLs de Amazon y no se pinta:
 * su programa de afiliados no autoriza enlazar su CDN desde fuera de sus
 * herramientas.
 */
export default function ProductVisual({ product, mostrarMarca = true, prioritaria = false, className = '' }) {
  const { icono, color, trama, rotacion, semilla } = visualDeProducto(product);

  const visual = (
    <div
      className={`${styles.visual} ${className}`}
      style={{ '--c': color }}
      /* Decorativo: el nombre del producto ya está en el texto contiguo, así
         que repetirlo aquí solo alargaría la lectura con lector de pantalla. */
      role="presentation"
    >
      <Trama variante={trama} rotacion={rotacion} semilla={semilla} />
      <span className={styles.marco} aria-hidden="true">
        <CategoryIcon nombre={icono} className={styles.icono} />
      </span>
      {mostrarMarca && product?.brand && (
        <span className={styles.marca}>{product.brand}</span>
      )}
    </div>
  );

  return (
    <ProductPhoto
      src={product?.image_url}
      alt={product?.title || ''}
      prioritaria={prioritaria}
      className={className}
    >
      {visual}
    </ProductPhoto>
  );
}

/**
 * Trama de la lámina, en una esquina y muy tenue. Cuatro variantes elegidas
 * por el id del producto: cotas, puntos, arcos y barras.
 */
const OPACIDAD = [0.35, 0.3, 0.3, 0.22];

function Trama({ variante, rotacion, semilla }) {
  const s = semilla;

  const figuras = [
    // 0 · Cotas, como en un plano
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={8} y1={10 + i * 8} x2={30 + ((s >> i) % 4) * 6} y2={10 + i * 8} strokeWidth="1" />
      ))}
    </>,

    // 1 · Retícula de puntos
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={10 + (i % 4) * 8} cy={10 + Math.floor(i / 4) * 8} r={1 + ((s >> i % 8) % 2) * 0.6} fill="currentColor" stroke="none" />
      ))}
    </>,

    // 2 · Arcos concéntricos
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <circle key={i} cx="6" cy="6" r={10 + i * 9} strokeWidth="1" />
      ))}
    </>,

    // 3 · Barras escalonadas
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={8 + i * 7} y={40 - ((s >> i) % 4) * 7} width="4" height={((s >> i) % 4) * 7 + 6} fill="currentColor" stroke="none" />
      ))}
    </>,
  ];

  return (
    <svg
      className={styles.trama}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMinYMin meet"
      style={{ transform: `rotate(${rotacion}deg)`, opacity: OPACIDAD[variante] ?? 0.3 }}
      aria-hidden="true"
    >
      <g stroke="currentColor" fill="none">{figuras[variante] ?? figuras[0]}</g>
    </svg>
  );
}
