/*
 * Este esqueleto vive en el grupo (listado), y no en app/blog/, por el 404.
 *
 * Un loading.js monta un Suspense sobre su segmento y sobre todo lo que
 * cuelga de él. En app/blog/ envolvía también a app/blog/[id]/, así que la
 * respuesta de un artículo empezaba a enviarse con su 200 antes de que la
 * página llegara a llamar a notFound(): el estado ya no se podía cambiar y
 * cualquier /blog/loquesea devolvía 200 con la pantalla de "no encontrado".
 * Eso es un soft 404, y Google acaba indexando esas URLs.
 *
 * El grupo no cambia la URL (/blog sigue siendo /blog) pero deja a [id]
 * fuera del Suspense. Si este archivo vuelve a app/blog/, vuelve el soft 404.
 */
import { BlogGridSkeleton } from '@/components/Skeletons';
import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.container}>
      <div className={styles.header} style={{ opacity: 0.6 }}>
        <div style={{ 
          height: '40px', 
          width: '200px', 
          background: 'var(--color-light-tertiary)', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }} />
        <div style={{ 
          height: '20px', 
          width: '500px', 
          background: 'var(--color-light-tertiary)', 
          borderRadius: '4px' 
        }} />
      </div>

      <BlogGridSkeleton count={6} />
    </main>
  );
}
