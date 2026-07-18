'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Carousel.module.css';

export default function Carousel({ items, type = 'product' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const trackRef = useRef(null);

  // Detectar el tamaño de pantalla y ajustar itemsPerView
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth <= 480) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 768) {
        setItemsPerView(2);
      } else if (window.innerWidth <= 1200) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Resetear currentIndex si excede el máximo después de cambiar itemsPerView
  useEffect(() => {
    const newMaxIndex = Math.max(0, items.length - itemsPerView);
    if (currentIndex > newMaxIndex) {
      setCurrentIndex(newMaxIndex);
    }
  }, [itemsPerView, items.length, currentIndex]);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Calcular el desplazamiento basado en el ancho real de los elementos
  const getTransformValue = () => {
    if (!trackRef.current) return 0;
    
    const firstCard = trackRef.current.querySelector(`.${styles.card}`);
    if (!firstCard) return 0;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(trackRef.current).gap) || 0;
    const offset = currentIndex * (cardWidth + gap);
    
    return offset;
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
          ref={trackRef}
          className={styles.carouselTrack}
          style={{ 
            transform: `translateX(-${getTransformValue()}px)`,
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
    <Link 
      href={`/producto/${product.id}`} 
      className={styles.card} 
      prefetch={false}
      scroll={true}
    >
      <div className={styles.imageContainer}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.image}
            width={250}
            height={250}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>Sin imagen</span>
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
            <span className={styles.stars}>★</span>
            <span className={styles.ratingValue}>{product.rating}/5</span>
          </div>
        )}
        
        <div className={styles.footer}>
          {product.price != null && (
            <span className={styles.price}>{product.price}€</span>
          )}
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
    <Link 
      href={`/blog/${blog.slug || blog.id}`} 
      className={styles.card} 
      prefetch={false}
      scroll={true}
    >
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
            <span>Sin imagen</span>
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
            <span className={styles.views}>{blog.views_count} lecturas</span>
          )}
        </div>
      </div>
    </Link>
  );
}
