'use client';

import AffiliateLink from '@/components/AffiliateLink';
import styles from './ProductCTA.module.css';

export default function ProductCTA({ product }) {
  if (!product?.affiliate_link) return null;

  return (
    <div className={styles.cta}>
      <p className={styles.label}>Disponible en Amazon</p>

      <h2 className={styles.title}>{product.title}</h2>

      {/* Sin precio: el de Amazon cambia a diario y sus políticas no permiten
          mostrar una copia propia. El usuario lo ve al llegar. */}

      <AffiliateLink
        href={product.affiliate_link}
        productId={product.id}
        productName={product.title}
        category={product.category}
        brand={product.brand}
        position="ficha_cierre"
        className={styles.button}
      >
        Ver precio actual en Amazon
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </AffiliateLink>

      <p className={styles.note}>
        Enlace de afiliado: el precio no cambia para ti y a nosotros nos ayuda a
        mantener la web.
      </p>
    </div>
  );
}
