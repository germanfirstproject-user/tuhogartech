'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addVisitedProduct, getProductById } from '@/lib/supabase';
import { trackProductView } from '@/lib/analytics';

export default function ProductVisitTracker({ productId }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Obtener datos del producto para Analytics
        const productResult = await getProductById(productId);
        const product = productResult.success ? productResult.data : null;

        // Trackear en Google Analytics
        if (product) {
          trackProductView({
            id: product.id,
            name: product.title,
            category: product.category,
            price: product.price
          });
        }

        // Registrar la visita en BD si hay usuario
        if (isLoggedIn && user?.id && productId) {
          await addVisitedProduct(user.id, productId);
        }
      } catch (error) {
        // Silenciar errores de tracking para no afectar UX
      }
    };

    // Pequeño delay para evitar registros duplicados
    const timer = setTimeout(trackVisit, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, productId]);

  return null; // Este componente no renderiza nada
}
