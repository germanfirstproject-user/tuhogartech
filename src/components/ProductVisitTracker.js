'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addVisitedProduct } from '@/lib/supabase';

export default function ProductVisitTracker({ productId }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackVisit = async () => {
      if (isLoggedIn && user?.id && productId) {
        try {
          // Registrar la visita
          await addVisitedProduct(user.id, productId);
        } catch (error) {
          // Silenciar errores de tracking para no afectar UX
        }
      }
    };

    // Pequeño delay para evitar registros duplicados
    const timer = setTimeout(trackVisit, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, productId]);

  return null; // Este componente no renderiza nada
}
