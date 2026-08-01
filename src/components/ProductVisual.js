import CategoryIcon from './CategoryIcon';
import { visualDeProducto } from '@/lib/productVisual';
import styles from './ProductVisual.module.css';

/**
 * Sustituto de la fotografía de producto.
 *
 * Ocupa el hueco que antes tenía la imagen de Amazon: color e icono de la
 * categoría, más una trama y un tono propios de cada producto para que dos
 * fichas de la misma sección no salgan iguales.
 *
 * Se dibuja entero con SVG y CSS, así que no pesa, no depende de terceros y
 * cualquier producto nuevo queda cubierto sin preparar nada.
 */
export default function ProductVisual({ product, mostrarMarca = true, className = '' }) {
  const { icono, color, fondo, trama, rotacion, semilla } = visualDeProducto(product);

  return (
    <div
      className={`${styles.visual} ${className}`}
      style={{ '--c': color, '--fondo': fondo }}
      /* Decorativo: el nombre del producto ya está en el texto contiguo, así
         que repetirlo aquí solo alargaría la lectura con lector de pantalla. */
      role="presentation"
    >
      <Trama variante={trama} rotacion={rotacion} semilla={semilla} />
      <CategoryIcon nombre={icono} className={styles.icono} />
      {mostrarMarca && product?.brand && (
        <span className={styles.marca}>{product.brand}</span>
      )}
    </div>
  );
}

/**
 * Fondo geométrico. Cuatro variantes, elegidas por el id del producto.
 *
 * Cada una lleva su propia opacidad: una barra rellena pesa mucho más que una
 * línea de 1 px, y con un valor común unas tarjetas quedaban recargadas y
 * otras casi en blanco.
 */
const OPACIDAD = [0.18, 0.13, 0.2, 0.08];

function Trama({ variante, rotacion, semilla }) {
  const s = semilla;

  const figuras = [
    // 0 · Diagonales
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={i}
          x1={-20 + i * 20}
          y1="0"
          x2={12 + i * 20}
          y2="100"
          strokeWidth={0.7 + ((s >> i) % 3) * 0.4}
        />
      ))}
    </>,

    // 1 · Retícula de puntos
    <>
      {Array.from({ length: 30 }, (_, i) => (
        <circle
          key={i}
          cx={10 + (i % 6) * 16}
          cy={12 + Math.floor(i / 6) * 19}
          r={1.4 + ((s >> i % 8) % 3) * 0.7}
          fill="currentColor"
          stroke="none"
        />
      ))}
    </>,

    // 2 · Arcos concéntricos
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={18 + (s % 30)} cy={82 - (s % 24)} r={16 + i * 17} strokeWidth="1" />
      ))}
    </>,

    // 3 · Barras escalonadas
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={6 + i * 16}
          y={70 - ((s >> i) % 5) * 12}
          width="9"
          height={30 + ((s >> i) % 5) * 12}
          rx="2"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </>,
  ];

  return (
    <svg
      className={styles.trama}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ transform: `rotate(${rotacion}deg)`, opacity: OPACIDAD[variante] ?? 0.16 }}
      aria-hidden="true"
    >
      <g stroke="currentColor" fill="none">{figuras[variante] ?? figuras[0]}</g>
    </svg>
  );
}
