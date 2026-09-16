'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addReadBlog } from '@/lib/supabase';
import { trackBlogRead } from '@/lib/analytics';
import { consumeNavSource } from '@/lib/navSource';
import { describirPagina } from '@/lib/medicion';

export default function BlogReadTracker({ blogId, blog }) {
  const { user, isLoggedIn } = useAuth();

  // Sin retraso y en su propio efecto: la medición propia manda la vista a los
  // 60 ms de cargar la ruta, así que esto tiene que haber pasado ya.
  useEffect(() => {
    if (!blog) return;
    describirPagina({
      page_type: 'blog',
      entity_id: blog.id,
      entity_slug: blog.slug,
      entity_title: blog.title,
    });
  }, [blog]);

  useEffect(() => {
    const trackRead = async () => {
      try {
        // Trackear en Google Analytics si tenemos datos del blog
        if (blog) {
          trackBlogRead({
            blogId: blog.id,
            blogSlug: blog.slug,
            blogTitle: blog.title,
            category: blog.category,
            origen: consumeNavSource(),
          });
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
