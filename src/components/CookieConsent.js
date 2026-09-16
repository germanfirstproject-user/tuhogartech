'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CATEGORIAS,
  getConsent,
  setConsent,
  OPEN_PREFERENCES_EVENT,
} from '@/lib/cookieConsent';
import styles from './CookieConsent.module.css';

/** Categorías que se pueden marcar o desmarcar, en el orden en que se pintan. */
const OPCIONALES = CATEGORIAS.filter((c) => !c.obligatoria).map((c) => c.id);

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [elegido, setElegido] = useState({ analytics: false, estadisticas: false });
  // Qué categoría tiene desplegado el detalle. Solo una a la vez: el banner es
  // pequeño y abrirlas todas lo convertiría en un muro de texto.
  const [detalle, setDetalle] = useState(null);

  // Primera visita: preguntar. Si ya decidió, no molestar.
  useEffect(() => {
    if (getConsent() === null) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  // El enlace del pie abre el panel para revisar o retirar el consentimiento.
  useEffect(() => {
    const open = () => {
      const actual = getConsent();
      setElegido({
        analytics: actual?.analytics === true,
        estadisticas: actual?.estadisticas === true,
      });
      setShowPanel(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  const guardar = useCallback((valores) => {
    setConsent(valores);
    setShowPanel(false);
    setDetalle(null);
    setVisible(false);
  }, []);

  const todo = (valor) =>
    Object.fromEntries(OPCIONALES.map((id) => [id, valor]));

  if (!visible) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="false"
         aria-labelledby="cookie-title" aria-describedby="cookie-desc">
      <div className={styles.banner}>
        <h2 id="cookie-title" className={styles.title}>Cookies y medición</h2>

        <p id="cookie-desc" className={styles.description}>
          Lo necesario para que la web funcione va siempre. Aparte, y solo si lo
          autorizas, medimos qué se lee para decidir sobre qué escribir después.
          Puedes rechazarlo sin perder ninguna función y cambiar de opinión
          cuando quieras. En «Configurar» está el detalle exacto de cada dato.
        </p>

        {showPanel && (
          <div className={styles.options}>
            {CATEGORIAS.map((cat) => {
              const abierto = detalle === cat.id;

              return (
                <div key={cat.id} className={styles.option}>
                  <div className={styles.optionText}>
                    <span className={styles.optionName}>{cat.nombre}</span>
                    <span className={styles.optionDesc}>{cat.resumen}</span>

                    <button
                      type="button"
                      className={styles.detalleToggle}
                      aria-expanded={abierto}
                      onClick={() => setDetalle(abierto ? null : cat.id)}
                    >
                      {abierto ? 'Ocultar el detalle' : 'Ver qué se registra'}
                    </button>

                    {abierto && (
                      <div className={styles.detalle}>
                        <p className={styles.detalleMeta}>
                          <strong>Dónde va:</strong> {cat.destino}
                        </p>
                        <p className={styles.detalleMeta}>
                          <strong>Cuánto se guarda:</strong> {cat.conserva}
                        </p>

                        <p className={styles.detalleTitulo}>Qué se registra</p>
                        <ul className={styles.detalleLista}>
                          {cat.datos.map((dato) => (
                            <li key={dato}>{dato}</li>
                          ))}
                        </ul>

                        {cat.noDatos?.length > 0 && (
                          <>
                            <p className={styles.detalleTitulo}>Qué no</p>
                            <ul className={`${styles.detalleLista} ${styles.detalleListaNo}`}>
                              {cat.noDatos.map((dato) => (
                                <li key={dato}>{dato}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {cat.obligatoria ? (
                    <span className={styles.always}>Siempre activas</span>
                  ) : (
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={elegido[cat.id] === true}
                      aria-label={cat.nombre}
                      onChange={(e) =>
                        setElegido((previo) => ({ ...previo, [cat.id]: e.target.checked }))
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className={styles.links}>
          <Link href="/privacidad" className={styles.link}>Política de privacidad</Link>
          {' · '}
          <Link href="/aviso-legal" className={styles.link}>Aviso legal</Link>
        </p>

        <div className={styles.actions}>
          {showPanel ? (
            <>
              <button type="button" className={styles.rejectButton} onClick={() => guardar(todo(false))}>
                Rechazar todas
              </button>
              <button type="button" className={styles.acceptButton} onClick={() => guardar(elegido)}>
                Guardar preferencias
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.settingsButton}
                onClick={() => setShowPanel(true)}
              >
                Configurar
              </button>
              <button type="button" className={styles.rejectButton} onClick={() => guardar(todo(false))}>
                Rechazar
              </button>
              <button type="button" className={styles.acceptButton} onClick={() => guardar(todo(true))}>
                Aceptar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
