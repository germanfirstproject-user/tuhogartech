'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Carousel.module.css';

export default function Carousel({ items, type = 'product' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, items.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay elementos disponibles</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselWrapper}>
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev} 
          className={`${styles.navButton} ${styles.navButtonPrev}`}
          aria-label="Anterior"
        >
          ‹
        </button>
      )}

      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {items.map((item, index) => (
            type === 'product' ? (
              <ProductCard key={item.id || index} product={item} />
            ) : (
              <BlogCard key={item.id || index} blog={item} />
            )
          ))}
        </div>
      </div>

      {currentIndex < maxIndex && (
        <button 
          onClick={handleNext} 
          className={`${styles.navButton} ${styles.navButtonNext}`}
          aria-label="Siguiente"
        >
          ›
        </button>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <Link href={`/producto/${product.id}`} className={styles.card} prefetch={true}>
      <div className={styles.imageContainer}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>📦</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        {product.brand && (
          <p className={styles.brand}>{product.brand}</p>
        )}
        
        <h3 className={styles.title}>{product.title}</h3>
        
        {product.rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>⭐</span>
            <span className={styles.ratingValue}>{product.rating}/5</span>
          </div>
        )}
        
        <div className={styles.footer}>
          <span className={styles.price}>{product.price}€</span>
          {product.stock === 'in_stock' && (
            <span className={styles.stock}>En stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Link href={`/blog/${blog.id}`} className={styles.card} prefetch={true}>
      <div className={styles.imageContainer}>
        {blog.featured_image ? (
          <img
            src={blog.featured_image}
            alt={blog.title}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>📝</span>
          </div>
        )}
      </div>
      
      <div className={styles.cardContent}>
        {blog.category && (
          <p className={styles.category}>{blog.category}</p>
        )}
        
        <h3 className={styles.title}>{blog.title}</h3>
        
        {blog.excerpt && (
          <p className={styles.excerpt}>
            {blog.excerpt.substring(0, 100)}
            {blog.excerpt.length > 100 && '...'}
          </p>
        )}
        
        <div className={styles.blogFooter}>
          <span className={styles.date}>{formatDate(blog.created_at)}</span>
          {blog.views_count > 0 && (
            <span className={styles.views}>👁️ {blog.views_count}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
