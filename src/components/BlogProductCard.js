'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import AffiliateLink from './AffiliateLink';
import ProductVisual from './ProductVisual';
import { trackBlogCardView } from '@/lib/analytics';
import styles from './BlogProductCard.module.css';

/**
 * Tarjeta de producto intercalada en un artículo.
 *
 * Sustituye a los enlaces sueltos "Ver la ficha completa de…" que el texto ya
 * contenía. La acción principal es el enlace a Amazon, que es donde se
 * convierte; la secundaria lleva al análisis propio, para quien todavía está
 * decidiendo. Ambas salidas conviven porque cubren dos momentos distintos.
 *
 * Registra su propia impresión al entrar en pantalla. El contexto del artículo
 * viaja dentro del evento, así que cualquier artículo futuro que reutilice
 * esta estructura queda medido sin tocar código.
 */
export default function BlogProductCard({ product, blog, index, compact = false }) {
  const referencia = useRef(null);

  const posicion = compact ? 'blog_cierre' : 'blog_articulo';
  const productId = product?.id;
  const blogId = blog?.id;

  // Impresión: se cuenta cuando al menos la mitad de la tarjeta ha estado
  // visible. Es la otra mitad del porcentaje de clics.
  useEffect(() => {
    const nodo = referencia.current;
    if (!nodo || !productId) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;

          const enviado = trackBlogCardView({
            productId,
            productName: product?.title,
            category: product?.category,
            brand: product?.brand,
            linkPosition: posicion,
            blogId,
            blogSlug: blog?.slug,
            cardIndex: index,
          });

          // Solo se deja de observar si el evento ha salido de verdad. Si
          // todavía no hay consentimiento, se reintenta al volver a verse.
          if (enviado) observador.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, blogId, posicion, index]);

  if (!product) return null;

  const stars = product.rating ? Math.round(product.rating) : 0;

  return (
    <aside ref={referencia} className={`${styles.card} ${compact ? styles.cardCompact : ''}`}>
      <Link href={`/producto/${product.id}`} className={styles.media} aria-hidden="true" tabIndex={-1}>
        <ProductVisual product={product} mostrarMarca={false} />
      </Link>

      <div className={styles.body}>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}

        <h3 className={styles.title}>
          <Link href={`/producto/${product.id}`} className={styles.titleLink}>
            {product.title}
          </Link>
        </h3>

        {product.rating && (
          <p className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">
              {'★'.repeat(stars)}
              <span className={styles.starsOff}>{'★'.repeat(5 - stars)}</span>
            </span>
            <span className={styles.score}>{product.rating}</span>
            {product.reviews_count > 0 && (
              <span className={styles.count}>
                ({product.reviews_count.toLocaleString('es-ES')} reseñas en Amazon)
              </span>
            )}
          </p>
        )}

        <div className={styles.actions}>
          {product.affiliate_link && (
            <AffiliateLink
              href={product.affiliate_link}
              productId={product.id}
              productName={product.title}
              category={product.category}
              brand={product.brand}
              position={posicion}
              blogId={blog?.id}
              blogSlug={blog?.slug}
              cardIndex={index}
              className={styles.buyButton}
            >
              Ver en Amazon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </AffiliateLink>
          )}

          <Link href={`/producto/${product.id}`} className={styles.detailLink}>
            Leer el análisis
          </Link>
        </div>
      </div>
    </aside>
  );
}
