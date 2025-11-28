'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addReadBlog, getBlogById } from '@/lib/supabase';
import { trackBlogRead } from '@/lib/analytics';

export default function BlogReadTracker({ blogId }) {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const trackRead = async () => {
      try {
        // Obtener datos del blog para Analytics
        const blogResult = await getBlogById(blogId);
        const blog = blogResult.success ? blogResult.data : null;

        // Trackear en Google Analytics
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
  }, [isLoggedIn, user, blogId]);

  return null; // Este componente no renderiza nada
}
