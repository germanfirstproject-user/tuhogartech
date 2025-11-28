'use client';

import AffiliateLink from '@/components/AffiliateLink';

export default function ProductCTA({ product, styles }) {
  return (
    <div style={{
      backgroundColor: 'rgba(37, 99, 235, 0.05)',
      border: '2px solid var(--color-primary)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-8)',
      textAlign: 'center',
      marginBottom: 'var(--space-12)'
    }}>
      <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-4)', margin: 0 }}>
        {product.title}
      </h3>
      <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', margin: 'var(--space-4) 0' }}>
        Precio: <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
          {product.price}€
        </span>
      </p>
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
