'use client';

import { trackAffiliateClick } from '@/lib/analytics';

/**
 * Componente para enlaces de afiliados con tracking
 */
export default function AffiliateLink({ 
  href, 
  productId, 
  productName, 
  category,
  children, 
  className,
  style 
}) {
  const handleClick = () => {
    // Trackear clic en enlace de afiliado
    if (productId && productName) {
      trackAffiliateClick(productId, productName, category || 'unknown');
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
