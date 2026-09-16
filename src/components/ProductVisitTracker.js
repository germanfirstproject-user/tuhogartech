'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addVisitedProduct } from '@/lib/supabase';
import { trackProductView } from '@/lib/analytics';
import { consumeNavSource } from '@/lib/navSource';
import { describirPagina } from '@/lib/medicion';

export default function ProductVisitTracker({ productId, product }) {
  const { user, isLoggedIn } = useAuth();

  // Igual que en el blog: esto corre en el mismo ciclo que la navegación, antes
  // de que la medición propia mande la vista, para que sepa de qué ficha es.
  useEffect(() => {
    if (!product) return;
    describirPagina({
      page_type: 'producto',
      entity_id: product.id,
      entity_title: product.title,
    });
  }, [product]);

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
