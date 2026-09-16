'use client';

import { useCallback, useEffect, useState } from 'react';
import { ETIQUETAS_ORIGEN, formatearDuracion, formatearNumero, obtenerFlujos, obtenerOrigenes } from '@/lib/analitica';
import {
  AvisoConsentimiento,
  RangoFechas,
  SubNav,
  TablaAnalitica,
  Vacio,
  rangoPorDefecto,
} from '../componentes';
import styles from '../analitica.module.css';

export default function AnaliticaRecorridos() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [flujos, setFlujos] = useState([]);
  const [origenes, setOrigenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const [f, o] = await Promise.all([
      obtenerFlujos(rango.desde, rango.hasta, 500),
      obtenerOrigenes(rango.desde, rango.hasta),
    ]);

    setError(f.success && o.success ? null : f.error || o.error);

    setFlujos(
      f.data.map((fila, i) => ({
        ...fila,
        __clave: `${fila.from_path}->${fila.path}-${i}`,
        veces: Number(fila.veces),
        sesiones: Number(fila.sesiones),
      }))
    );

    setOrigenes(
      o.data.map((fila, i) => ({
        ...fila,
        __clave: `${fila.referrer_type}-${fila.referrer_host}-${i}`,
        sesiones: Number(fila.sesiones),
        vistas_medias: fila.vistas_medias === null ? null : Number(fila.vistas_medias),
        duracion_media: fila.duracion_media === null ? null : Number(fila.duracion_media),
        tipo_legible: ETIQUETAS_ORIGEN[fila.referrer_type] || fila.referrer_type,
      }))
    );

    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const columnasFlujo = [
    {
      clave: 'from_path',
      titulo: 'Desde',
      ancho: 45,
      render: (f) => (
        <span className={styles.ruta} title={f.from_path}>
          <span className={styles.recorte}>{f.from_path}</span>
        </span>
      ),
    },
    {
      clave: 'path',
      titulo: 'Hacia',
      ancho: 45,
      render: (f) => (
        <span className={styles.ruta} title={f.path}>
          <span className={styles.recorte}>{f.path}</span>
        </span>
      ),
    },
    { clave: 'veces', titulo: 'Veces', numero: true, render: (f) => formatearNumero(f.veces) },
    {
      clave: 'sesiones',
      titulo: 'Sesiones',
      numero: true,
      render: (f) => formatearNumero(f.sesiones),
    },
  ];

  const columnasOrigen = [
    {
      clave: 'tipo_legible',
      titulo: 'Tipo',
      ancho: 22,
      render: (f) => <span className={styles.etiqueta}>{f.tipo_legible}</span>,
    },
    {
      clave: 'referrer_host',
      titulo: 'Dominio',
      ancho: 36,
      render: (f) => <span className={styles.recorte}>{f.referrer_host}</span>,
    },
    {
      clave: 'sesiones',
      titulo: 'Sesiones',
      numero: true,
      render: (f) => formatearNumero(f.sesiones),
    },
    {
      clave: 'vistas_medias',
      titulo: 'Páginas por sesión',
      ancho: 20,
      numero: true,
      render: (f) => (f.vistas_medias === null ? '—' : f.vistas_medias),
    },
    {
      clave: 'duracion_media',
      titulo: 'Duración media',
      ancho: 18,
      numero: true,
      render: (f) => formatearDuracion(f.duracion_media),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Recorridos</h1>
          <p className={styles.subtitle}>
            De dónde llega la gente a la web y, una vez dentro, desde qué página
            salta a cuál. El segundo dato es el que dice si el enlazado interno
            de los artículos está funcionando.
          </p>
        </div>
        <button type="button" className={styles.botonSecundario} onClick={cargar}>
          Actualizar
        </button>
      </div>

      <SubNav />
      <RangoFechas valor={rango} onChange={setRango} />
      <AvisoConsentimiento />

      {error && <div className={styles.error}>No se pudieron cargar los datos: {error}</div>}

      <div className={styles.tarjeta}>
        <h2 className={styles.tarjetaTitulo}>De dónde llegan</h2>
        <p className={styles.tarjetaNota}>
          Una sesión que llega de un asistente de IA y se queda cuatro páginas
          vale mucho más que diez que rebotan: por eso van aquí las páginas por
          sesión y la duración junto al número.
        </p>
        <TablaAnalitica
          columnas={columnasOrigen}
          filas={origenes}
          rango={rango}
          cargando={cargando}
          nombreExport="origenes"
          ordenInicial={{ clave: 'sesiones', asc: false }}
          vacio={<Vacio titulo="Sin sesiones en este periodo" />}
        />
      </div>

      <div className={styles.tarjeta}>
        <h2 className={styles.tarjetaTitulo}>Saltos entre páginas</h2>
        <p className={styles.tarjetaNota}>
          Cada fila es una navegación interna registrada. Solo aparecen los
          saltos de una página a otra distinta.
        </p>
        <TablaAnalitica
          columnas={columnasFlujo}
          filas={flujos}
          rango={rango}
          cargando={cargando}
          nombreExport="recorridos"
          ordenInicial={{ clave: 'veces', asc: false }}
          vacio={
            <Vacio titulo="Todavía no hay saltos entre páginas">
              Aparecerán en cuanto alguien visite dos páginas seguidas.
            </Vacio>
          }
        />
      </div>
    </div>
  );
}
