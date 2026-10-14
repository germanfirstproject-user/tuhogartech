import Link from 'next/link';
import styles from './Categoria.module.css';

/**
 * Paginación hecha con enlaces de verdad. El componente Pagination cambia de
 * página con router.push desde botones, y los buscadores no siguen botones:
 * las páginas 2 en adelante se quedaban sin enlaces que rastrear.
 */
export default function PaginacionEnlaces({ base, actual, total }) {
  if (total <= 1) return null;

  const href = (n) => (n === 1 ? base : `${base}?page=${n}`);
  const paginas = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      {actual > 1 && (
        <Link href={href(actual - 1)} className={styles.pagina} rel="prev" aria-label="Página anterior">
          ‹
        </Link>
      )}
      {paginas.map((n) => (
        <Link
          key={n}
          href={href(n)}
          className={`${styles.pagina} ${n === actual ? styles.paginaActual : ''}`}
          aria-current={n === actual ? 'page' : undefined}
          aria-label={`Página ${n}`}
        >
          {n}
        </Link>
      ))}
      {actual < total && (
        <Link href={href(actual + 1)} className={styles.pagina} rel="next" aria-label="Página siguiente">
          ›
        </Link>
      )}
      <p className={styles.paginaInfo}>
        Página {actual} de {total}
      </p>
    </nav>
  );
}
