'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addVisitedProduct } from '@/lib/supabase';
import { trackProductView } from '@/lib/analytics';
import { consumeNavSource } from '@/lib/navSource';

export default function ProductVisitTracker({ productId, product }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Trackear en Google Analytics si tenemos datos del producto.
        // El origen se consume aquí: dice desde qué módulo de la web se llegó.
        if (product) {
          trackProductView(
            {
              id: product.id,
              name: product.title,
              category: product.category,
              brand: product.brand,
            },
            consumeNavSource()
          );
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
  }, [isLoggedIn, user, productId, product]);

  return null; // Este componente no renderiza nada
}
