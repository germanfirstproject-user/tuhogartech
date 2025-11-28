import Link from 'next/link';
import { getBlogs, getBlogBySlug, getBlogById } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import BlogReadTracker from '@/components/BlogReadTracker';
import styles from './page.module.css';

// Revalidar cada 10 minutos (600 segundos)
export const revalidate = 600;

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

  const title = blog.seo_title || `${blog.title} - AffiliPro`;
  const description = blog.seo_description || blog.excerpt || blog.title;
  const keywords = blog.seo_keywords || blog.tags?.join(', ') || blog.category;
  const image = blog.og_image || blog.featured_image;

  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: blog.author_name ? [{ name: blog.author_name }] : [],
    openGraph: {
      title: blog.og_title || title,
      description: blog.og_description || description,
      images: image ? [{ url: image, alt: blog.featured_image_alt || blog.title }] : [],
      type: 'article',
      publishedTime: blog.published_at,
      authors: blog.author_name ? [blog.author_name] : [],
      tags: blog.tags || [],
      siteName: 'AffiliPro',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.og_title || title,
      description: blog.og_description || description,
      images: image ? [image] : [],
      creator: blog.author_name ? `@${blog.author_name.replace(/\s+/g, '')}` : undefined,
    },
    alternates: {
      canonical: `https://tuhogartech.com/blog/${blog.slug || params.id}`,
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

  // Schema.org - Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt || blog.title,
    "image": blog.featured_image ? [blog.featured_image] : [],
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at || blog.published_at,
    "author": blog.author_name ? {
      "@type": "Person",
      "name": blog.author_name
    } : {
      "@type": "Organization",
      "name": "AffiliPro"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AffiliPro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tuhogartech.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tuhogartech.com/blog/${blog.slug || params.id}`
    },
    "keywords": blog.tags?.join(', ') || blog.category,
    "articleSection": blog.category
  };

  // Schema.org - BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://tuhogartech.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://tuhogartech.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://tuhogartech.com/blog/${blog.slug || params.id}`
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className={styles.container}>
        <BlogReadTracker blogId={blog.id} blog={blog} />
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
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

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
    </>
  );
}

