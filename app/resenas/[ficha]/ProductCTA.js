'use client';

import AvisoAfiliado from '@/components/AvisoAfiliado';
import BotonAmazon from './BotonAmazon';
import styles from './ProductCTA.module.css';

/** Cierre de la ficha: la última salida a Amazon, para quien ha leído todo. */
export default function ProductCTA({ product }) {
  if (!product?.affiliate_link) return null;

  return (
    <div className={styles.cta}>
      <p className={styles.label}>¿Te encaja?</p>
      <h2 className={styles.title}>{product.title}</h2>
      {/* Sin precio: el de Amazon cambia a diario y sus políticas no permiten
          mostrar una copia propia. El usuario lo ve al llegar. */}
      <BotonAmazon product={product} position="ficha_cierre" className={styles.button} />
      <AvisoAfiliado className={styles.note} />
    </div>
  );
}
