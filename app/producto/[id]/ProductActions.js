'use client';

import AffiliateLink from '@/components/AffiliateLink';
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
    </>
  );
}
