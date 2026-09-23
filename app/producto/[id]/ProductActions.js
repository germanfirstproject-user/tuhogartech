'use client';

import AffiliateLink from '@/components/AffiliateLink';
import AvisoAfiliado from '@/components/AvisoAfiliado';
import FavoriteButton from '@/components/FavoriteButton';

export default function ProductActions({ product, styles }) {
  return (
    <>
      {/* Botón de compra */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {product.affiliate_link && (
          <AffiliateLink
            href={product.affiliate_link}
            productId={product.id}
            productName={product.title}
            category={product.category}
            brand={product.brand}
            position="ficha_principal"
            style={{ textDecoration: 'none', flex: '1' }}
          >
            <button className={styles.primaryButton} style={{ width: '100%' }}>
              Ver precio actual en Amazon
            </button>
          </AffiliateLink>
        )}
        <FavoriteButton productId={product.id} />
      </div>

      {/* Amazon pide una marca pegada a cada enlace, además del aviso global
          del pie. Va fuera de la fila para que no compita por el espacio con el
          botón de favoritos. */}
      {product.affiliate_link && <AvisoAfiliado className={styles.avisoAfiliado} />}
    </>
  );
}
