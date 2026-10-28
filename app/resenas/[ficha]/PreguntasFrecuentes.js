'use client';

import { trackFaqOpen } from '@/lib/analytics';
import styles from './page.module.css';

/** Preguntas frecuentes de la ficha. Abrir una manda `faq_open` a GA4. */
export default function PreguntasFrecuentes({ preguntas, productId }) {
  return (
    <div className={styles.faq}>
      {preguntas.map((p, i) => (
        <details
          key={p.pregunta}
          open={i === 0}
          onToggle={(e) => {
            if (e.currentTarget.open && i > 0) {
              trackFaqOpen({ pregunta: p.pregunta, productId, pagina: 'ficha' });
            }
          }}
        >
          <summary>{p.pregunta}</summary>
          <p>{p.respuesta}</p>
        </details>
      ))}
    </div>
  );
}
