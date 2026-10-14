import Link from 'next/link';
import styles from './Categoria.module.css';

/**
 * Accesos a las subcategorías con página propia. `actual` es el slug de la
 * subcategoría que se está viendo; sin él, la marcada es «Todas».
 */
export default function SubcategoriasNav({ categoria, subcategorias, actual = null, total }) {
  const conPagina = subcategorias.filter((s) => s.has_page);
  if (!conPagina.length) return null;

  return (
    <nav className={styles.subnav} aria-label={`Tipos de ${categoria.name}`}>
      <p className={styles.subnavTitulo}>Explora por tipo</p>
      <ul className={styles.subnavLista}>
        <li>
          <Link
            href={`/categoria/${categoria.slug}`}
            className={`${styles.chip} ${actual ? '' : styles.chipActivo}`}
            aria-current={actual ? undefined : 'page'}
          >
            Todas
            {total != null && <span className={styles.chipCuenta}>{total}</span>}
          </Link>
        </li>
        {conPagina.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/categoria/${categoria.slug}/${s.slug}`}
              className={`${styles.chip} ${actual === s.slug ? styles.chipActivo : ''}`}
              aria-current={actual === s.slug ? 'page' : undefined}
            >
              {s.name}
              <span className={styles.chipCuenta}>{s.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
