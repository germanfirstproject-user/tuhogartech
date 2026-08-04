import Link from 'next/link';
import { getBlogs } from '@/lib/supabase';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

// Revalidar cada 10 minutos (600 segundos)
export const revalidate = 600;

export const metadata = {
  title: 'Blog - Guías y consejos',
  description: 'Guías de compra, análisis y consejos sobre productos.',
};

export default async function BlogListPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 12;

  const result = await getBlogs({ status: 'published' }, page, pageSize);
  const blogs = result.success ? result.data : [];
  const totalPages = result.totalPages || 1;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.description}>
          Guías de compra, análisis y consejos sobre los mejores productos
        </p>
        {result.totalCount > 0 && (
          <p className={styles.count}>
            {result.totalCount} {result.totalCount === 1 ? 'artículo' : 'artículos'}
          </p>
        )}
      </div>

      {blogs.length > 0 ? (
        <>
          <div className={styles.blogsGrid}>
            {blogs.map((blog) => (
              <Link 
                href={`/blog/${blog.slug || blog.id}`} 
                key={blog.id}
                className={styles.blogCard}
                prefetch={true}
              >
                {blog.featured_image && (
                  <div className={styles.blogImageContainer}>
                    <img 
                      src={blog.featured_image} 
                      alt={blog.featured_image_alt || blog.title}
                      className={styles.blogImage}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div className={styles.blogContent}>
                  {blog.category && (
                    <span className={styles.blogCategory}>{blog.category}</span>
                  )}
                  <h2 className={styles.blogTitle}>{blog.title}</h2>
                  {blog.excerpt && (
                    <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                  )}
                  <div className={styles.blogMeta}>
                    {blog.published_at && (
                      <span className={styles.blogDate}>
                        {new Date(blog.published_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    <span className={styles.blogAuthor}>Tu Hogar Tech</span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className={styles.blogTags}>
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={styles.blogTag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/blog"
          />
        </>
      ) : (
        <div className={styles.empty}>
          <p>No hay artículos publicados aún.</p>
          <Link href="/" className={styles.button}>Volver al inicio</Link>
        </div>
      )}
    </main>
  );
}

