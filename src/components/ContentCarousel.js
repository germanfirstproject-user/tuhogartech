'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import TrackedLink from './TrackedLink';
import styles from './ContentCarousel.module.css';

const AUTOPLAY_MS = 6000;

/**
 * Carrusel de contenidos de la web (categorías destacadas y guías).
 *
 * Contenido, no a sangre: el ancho máximo lo mantiene alineado con el resto
 * de secciones. Se detiene al pasar el ratón o al enfocar con teclado, y
 * respeta prefers-reduced-motion.
 */
export default function ContentCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const total = slides.length;

  const go = useCallback((i) => setCurrent(((i % total) + total) % total), [total]);

  useEffect(() => {
    if (total <= 1 || paused) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    timer.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer.current);
  }, [total, paused]);

  if (total === 0) return null;

  return (
    <section
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Contenidos destacados"
    >
      <div className={styles.viewport}>
        {slides.map((slide, i) => (
          <article
            key={slide.href}
            className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
            aria-hidden={i !== current}
            inert={i !== current ? '' : undefined}
          >
            <TrackedLink
              href={slide.href}
              modulo="home_carrusel_contenidos"
              itemId={slide.href}
              itemName={slide.title}
              posicion={i + 1}
              className={styles.media}
              tabIndex={i === current ? 0 : -1}
            >
              {/* Decorativa: el mensaje está en el texto contiguo */}
              <img src={slide.image} alt={slide.imageAlt || ''} className={styles.image} loading={i === 0 ? "eager" : "lazy"} />
            </TrackedLink>

            <div className={styles.body}>
              <p className={styles.kicker}>{slide.kicker}</p>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.text}>{slide.text}</p>
              <TrackedLink
                href={slide.href}
                modulo="home_carrusel_contenidos"
                itemId={slide.href}
                itemName={slide.title}
                posicion={i + 1}
                className={styles.cta}
                tabIndex={i === current ? 0 : -1}
              >
                {slide.cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </TrackedLink>
            </div>
          </article>
        ))}
      </div>

      {total > 1 && (
        <div className={styles.controls}>
          <div className={styles.dots} role="tablist" aria-label="Elegir contenido">
            {slides.map((slide, i) => (
              <button
                key={slide.href}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={slide.title}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <div className={styles.arrows}>
            <button type="button" className={styles.arrow} onClick={() => go(current - 1)} aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className={styles.arrow} onClick={() => go(current + 1)} aria-label="Siguiente">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
