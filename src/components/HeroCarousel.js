'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

export default function HeroCarousel({ heroImages = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preparar slides data
  const slides = [
    {
      type: 'hero',
      image: heroImages.hero_image_1,
      hasContent: true,
    },
    {
      type: 'image',
      image: heroImages.hero_image_2,
      link: heroImages.hero_image_2_link,
      alt: heroImages.hero_image_2_alt || 'Slide 2',
    },
    {
      type: 'image',
      image: heroImages.hero_image_3,
      link: heroImages.hero_image_3_link,
      alt: heroImages.hero_image_3_alt || 'Slide 3',
    },
    {
      type: 'image',
      image: heroImages.hero_image_4,
      link: heroImages.hero_image_4_link,
      alt: heroImages.hero_image_4_alt || 'Slide 4',
    },
  ].filter(slide => slide.image); // Solo mostrar slides con imagen

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide cada 15 segundos
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 15000);

    return () => clearInterval(interval);
  }, [nextSlide, totalSlides]);

  if (totalSlides === 0) {
    return (
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Encuentra tus productos favoritos
            <br />
            <span className={styles.heroHighlight}>al mejor precio</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Reseñas honestas, comparativas detalladas y ofertas exclusivas
          </p>
          <div className={styles.heroCTA}>
            <Link href="/productos" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
              Explorar productos
            </Link>
            <Link href="/blog" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
              Leer guías
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.carousel}>
      <div className={styles.carouselContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentSlide ? styles.slideActive : ''}`}
          >
            {slide.type === 'hero' ? (
              // Slide 1: Hero con texto y botones
              <div className={styles.heroSlide}>
                {slide.image && (
                  <div 
                    className={styles.heroBackground}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                )}
                <div className={styles.heroOverlay} />
                <div className={styles.heroContainer}>
                  <h1 className={styles.heroTitle}>
                    Encuentra tus productos favoritos
                    <br />
                    <span className={styles.heroHighlight}>al mejor precio</span>
                  </h1>
                  <p className={styles.heroSubtitle}>
                    Reseñas honestas, comparativas detalladas y ofertas exclusivas
                  </p>
                  <div className={styles.heroCTA}>
                    <Link href="/productos" className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
                      Explorar productos
                    </Link>
                    <Link href="/blog" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
                      Leer guías
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Slides 2-4: Solo imagen con link opcional
              <div className={styles.imageSlide}>
                {slide.link ? (
                  <Link href={slide.link} className={styles.imageLink}>
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className={styles.slideImage}
                    />
                  </Link>
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className={styles.slideImage}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      {totalSlides > 1 && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
