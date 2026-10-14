import Link from 'next/link';
import { esquemaMigas } from '@/lib/categorias';
import styles from './Categoria.module.css';

/**
 * Migas visibles y su BreadcrumbList. El último elemento es la página actual:
 * se pinta sin enlace pero sí va en el marcado, como pide Google.
 */
export default function MigasDePan({ migas }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(esquemaMigas(migas)) }}
      />
      <nav aria-label="Migas de pan" className={styles.migas}>
        <ol className={styles.migasLista}>
          {migas.map((m, i) =>
            i === migas.length - 1 ? (
              <li key={m.href} aria-current="page" className={styles.migasActual}>
                {m.name}
              </li>
            ) : (
              <li key={m.href}>
                <Link href={m.href}>{m.name}</Link>
              </li>
            )
          )}
        </ol>
      </nav>
    </>
  );
}
