import Link from 'next/link';
import { getBlogs, getBlogBySlug, getBlogById } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export async function generateStaticParams() {
  const result = await getBlogs();
  const blogs = result.success ? result.data : [];
  
  return blogs
    .filter(blog => blog.status === 'published')
    .map((blog) => ({
      id: blog.slug || blog.id,
    }));
}

export async function generateMetadata({ params }) {
  // Intentar obtener por slug primero, luego por ID
  let result = await getBlogBySlug(params.id);
  let blog = result.success ? result.data : null;
  
  if (!blog) {
    result = await getBlogById(params.id);
    blog = result.success ? result.data : null;
  }

  if (!blog) {
    return {
      title: 'Blog no encontrado',
    };
  }

  return {
    title: blog.seo_title || `${blog.title} - AffiliPro`,
    description: blog.seo_description || blog.excerpt || blog.title,
    keywords: blog.seo_keywords,
    openGraph: {
      title: blog.og_title || blog.title,
      description: blog.og_description || blog.excerpt,
      images: blog.og_image ? [{ url: blog.og_image }] : blog.featured_image ? [{ url: blog.featured_image }] : [],
      type: 'article',
      publishedTime: blog.published_at,
    },
  };
}

export default async function BlogPostPage({ params }) {
  // Intentar obtener por slug primero, luego por ID
  let result = await getBlogBySlug(params.id);
  let blog = result.success ? result.data : null;
  
  if (!blog) {
    result = await getBlogById(params.id);
    blog = result.success ? result.data : null;
  }

  if (!blog) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Blog no encontrado</h1>
          <p className={styles.notFoundText}>El artículo que buscas no existe o ha sido eliminado.</p>
          <Link href="/blog" className={styles.backButton}>
            <ArrowLeft size={16} />
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <article className={styles.article}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/blog" className={styles.breadcrumbLink}>
            <ArrowLeft size={16} />
            Volver al Blog
          </Link>
        </div>

        {/* Header */}
        <header className={styles.articleHeader}>
          {blog.category && (
            <span className={styles.category}>{blog.category}</span>
          )}
          <h1 className={styles.articleTitle}>{blog.title}</h1>
          
          {blog.excerpt && (
            <p className={styles.excerpt}>{blog.excerpt}</p>
          )}

          <div className={styles.meta}>
            {blog.author_name && (
              <span className={styles.author}>Por {blog.author_name}</span>
            )}
            {blog.published_at && (
              <span className={styles.date}>
                {new Date(blog.published_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {blog.views_count > 0 && (
              <span className={styles.views}>{blog.views_count} vistas</span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className={styles.featuredImageContainer}>
            <img
              src={blog.featured_image}
              alt={blog.featured_image_alt || blog.title}
              className={styles.featuredImage}
            />
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {blog.content.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <h3 className={styles.tagsTitle}>Etiquetas:</h3>
            <div className={styles.tags}>
              {blog.tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

