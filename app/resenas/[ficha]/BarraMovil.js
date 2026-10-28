'use client';

import { useEffect, useState } from 'react';
import AvisoAfiliado from '@/components/AvisoAfiliado';
import BotonAmazon from './BotonAmazon';
import styles from './page.module.css';

/**
 * Barra fija abajo en el móvil, con el botón a Amazon. Aparece cuando el
 * bloque de compra de arriba ya no se ve, para que no haya dos botones iguales
 * en pantalla a la vez. En escritorio no se pinta: allí está el lateral.
 */
export default function BarraMovil({ product, modelo, idObjetivo = 'comprar' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const objetivo = document.getElementById(idObjetivo);
    if (!objetivo || typeof IntersectionObserver === 'undefined') return;
    const observador = new IntersectionObserver(
      ([entrada]) => setVisible(!entrada.isIntersecting && entrada.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observador.observe(objetivo);
    return () => observador.disconnect();
  }, [idObjetivo]);

  if (!product?.affiliate_link) return null;

  return (
    <div className={`${styles.barraMovil} ${visible ? styles.barraVisible : ''}`} aria-hidden={!visible}>
      <div className={styles.barraFila}>
        <span className={styles.barraNombre}>{modelo}</span>
        <BotonAmazon product={product} position="ficha_barra_movil" pequeno />
      </div>
      <AvisoAfiliado breve className={styles.avisoMini} />
    </div>
  );
}
