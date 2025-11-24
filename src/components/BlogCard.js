import Link from 'next/link';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'semana' : 'semanas'}`;
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/blog/${blog.slug || blog.id}`} className={styles.card}>
      {blog.featured_image && (
        <div className={styles.imageContainer}>
          <img 
            src={blog.featured_image} 
            alt={blog.featured_image_alt || blog.title}
            className={styles.image}
            width={120}
            height={120}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{blog.title}</h3>
        {blog.excerpt && (
          <p className={styles.excerpt}>
            {blog.excerpt.length > 150 ? `${blog.excerpt.substring(0, 150)}...` : blog.excerpt}
          </p>
        )}
        <div className={styles.meta}>
          {blog.category && (
            <span className={styles.category}>{blog.category}</span>
          )}
          {blog.published_at && (
            <span className={styles.date}>{formatDate(blog.published_at)}</span>
          )}
          {blog.views_count > 0 && (
            <span className={styles.views}>{blog.views_count} vistas</span>
          )}
        </div>
      </div>
    </Link>
  );
}
