'use client';

import AffiliateLink from '@/components/AffiliateLink';

export default function ProductCTA({ product, styles }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-background-secondary)',
      border: '1px solid var(--color-border)',
      borderTop: '3px solid var(--color-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)',
      textAlign: 'center',
      marginBottom: 'var(--space-12)'
    }}>
      <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', fontWeight: 600, margin: 0 }}>
        {product.title}
      </h3>
      {product.price != null && (
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0 var(--space-6)' }}>
          Precio: <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--color-text)' }}>
            {product.price}€
          </span>
        </p>
      )}
      {product.affiliate_link && (
        <AffiliateLink 
          href={product.affiliate_link}
          productId={product.id}
          productName={product.title}
          category={product.category}
          style={{ textDecoration: 'none' }}
        >
          <button className={styles.primaryButton}>
            Ir a Amazon - Comprar Ahora
          </button>
        </AffiliateLink>
      )}
    </div>
  );
}
