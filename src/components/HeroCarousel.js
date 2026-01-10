'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

export default function HeroCarousel({ heroImages = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [device, setDevice] = useState('desktop');
  const autoplayRef = useRef(null);
  const AUTOPLAY_MS = 15000;

  useEffect(() => {
    const updateDevice = () => {
      const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
      setDevice(isMobile ? 'mobile' : 'desktop');
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  // Preparar slides data
  const slides = [
    {
      type: 'hero',
      image: heroImages.hero_image_1,
      imageMobile: heroImages.hero_image_1_mobile,
      hasContent: true,
    },
    {
      type: 'image',
      image: heroImages.hero_image_2,
      imageMobile: heroImages.hero_image_2_mobile,
      link: heroImages.hero_image_2_link,
      alt: heroImages.hero_image_2_alt || 'Slide 2',
    },
    {
      type: 'image',
      image: heroImages.hero_image_3,
      imageMobile: heroImages.hero_image_3_mobile,
      link: heroImages.hero_image_3_link,
      alt: heroImages.hero_image_3_alt || 'Slide 3',
    },
    {
      type: 'image',
      image: heroImages.hero_image_4,
      imageMobile: heroImages.hero_image_4_mobile,
      link: heroImages.hero_image_4_link,
      alt: heroImages.hero_image_4_alt || 'Slide 4',
    },
  ].filter(slide => slide.image || slide.imageMobile); // Solo mostrar slides con alguna imagen

  const getSlideImage = useCallback((slide) => {
    if (device === 'mobile' && slide.imageMobile) return slide.imageMobile;
    if (slide.image) return slide.image;
    if (slide.imageMobile) return slide.imageMobile;
    return null;
  }, [device]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const startAutoplay = useCallback(() => {
    if (totalSlides <= 1) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, AUTOPLAY_MS);
  }, [totalSlides]);

  const restartAutoplay = useCallback(() => {
    if (totalSlides <= 1) return;
    startAutoplay();
  }, [startAutoplay, totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    restartAutoplay();
  };

  // Auto-slide cada 15 segundos
  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [startAutoplay]);

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
                {(() => {
                  const selectedImage = getSlideImage(slide);
                  if (!selectedImage) return null;
                  return (
                    <div 
                      className={styles.heroBackground}
                      style={{ backgroundImage: `url(${selectedImage})` }}
                    />
                  );
                })()}
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
                {(() => {
                  const selectedImage = getSlideImage(slide);
                  if (!selectedImage) return null;

                  if (slide.link) {
                    return (
                      <Link href={slide.link} className={styles.imageLink}>
                        <img
                          src={selectedImage}
                          alt={slide.alt}
                          className={styles.slideImage}
                        />
                      </Link>
                    );
                  }

                  return (
                    <img
                      src={selectedImage}
                      alt={slide.alt}
                      className={styles.slideImage}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <div className={styles.navButtons}>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={() => { prevSlide(); restartAutoplay(); }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            onClick={() => { nextSlide(); restartAutoplay(); }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      )}

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
