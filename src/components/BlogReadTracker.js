'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addReadBlog } from '@/lib/supabase';
import { trackBlogRead } from '@/lib/analytics';

export default function BlogReadTracker({ blogId, blog }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackRead = async () => {
      try {
        // Trackear en Google Analytics si tenemos datos del blog
        if (blog) {
          trackBlogRead(blog.id, blog.title, blog.category);
        }

        // Registrar la lectura en BD si hay usuario
        if (isLoggedIn && user?.id && blogId) {
          await addReadBlog(user.id, blogId);
        }
      } catch (error) {
        // Silenciar errores de tracking para no afectar UX
      }
    };

    // Delay para considerar que realmente leyó el artículo
    const timer = setTimeout(trackRead, 3000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, blogId, blog]);

  return null; // Este componente no renderiza nada
}
