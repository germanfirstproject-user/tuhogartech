import AffiliateLink from './AffiliateLink';
import CategoryIcon from './CategoryIcon';
import { colorDeCategoria, iconoDeCategoria } from '@/lib/productVisual';
import styles from './CategoryAmazonCTA.module.css';

/**
 * Salida a la sección equivalente en Amazon, al principio de una categoría.
 *
 * Va antes del listado a propósito: quien llega buscando "proyectores" a
 * menudo quiere ver el surtido completo, no una ficha concreta. Se muestra
 * solo si la categoría tiene enlace configurado en el panel.
 */
export default function CategoryAmazonCTA({ category }) {
  if (!category?.amazon_link) return null;

  const color = colorDeCategoria(category.name);

  return (
    <aside className={styles.cta} style={{ '--c': color }}>
      <span className={styles.marca} aria-hidden="true">
        <CategoryIcon nombre={iconoDeCategoria(category.name)} />
      </span>

      <div className={styles.texto}>
        <p className={styles.titulo}>¿Buscas más opciones de {category.name.toLowerCase()}?</p>
        <p className={styles.nota}>
          Aquí abajo tienes nuestra selección analizada. Si prefieres ver el
          catálogo completo, el enlace lleva a la sección en Amazon.
        </p>
      </div>

      <AffiliateLink
        href={category.amazon_link}
        category={category.name}
        position="categoria_cabecera"
        className={styles.boton}
      >
        Ver en Amazon
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </AffiliateLink>
    </aside>
  );
}
