'use client';

import AffiliateLink from '@/components/AffiliateLink';
import styles from './page.module.css';

/**
 * Botón «Ver en Amazon» de la ficha. Siempre dice lo mismo (nunca «Comprar» ni
 * un precio) y siempre pasa por `AffiliateLink`, que es quien lo mide. La
 * posición distingue las cuatro salidas: hero, tabla, lateral o barra móvil y
 * cierre. El aviso de afiliado lo pone quien lo usa, pegado al botón.
 */
export default function BotonAmazon({ product, position, secundario = false, pequeno = false, className = '' }) {
  if (!product?.affiliate_link) return null;

  return (
    <AffiliateLink
      href={product.affiliate_link}
      productId={product.id}
      productName={product.title}
      category={product.category}
      brand={product.brand}
      position={position}
      className={[
        styles.boton,
        secundario ? styles.botonSecundario : '',
        pequeno ? styles.botonPequeno : '',
        className,
      ].join(' ').trim()}
    >
      Ver en Amazon
      <svg className={styles.ext} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
           strokeLinecap="square" aria-hidden="true">
        <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
      </svg>
    </AffiliateLink>
  );
}
