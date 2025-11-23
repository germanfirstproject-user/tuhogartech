'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addReadBlog } from '@/lib/supabase';

export default function BlogReadTracker({ blogId }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackRead = async () => {
      if (isLoggedIn && user?.id && blogId) {
        try {
          // Registrar la lectura
          await addReadBlog(user.id, blogId);
        } catch (error) {
          // Silenciar errores de tracking para no afectar UX
        }
      }
    };

    // Delay para considerar que realmente leyó el artículo
    const timer = setTimeout(trackRead, 3000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, blogId]);

  return null; // Este componente no renderiza nada
}
