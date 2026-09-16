'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ETIQUETAS_ORIGEN,
  formatearDuracion,
  formatearFecha,
  formatearNumero,
  obtenerSesiones,
} from '@/lib/analitica';
import {
  AvisoConsentimiento,
  RangoFechas,
  SubNav,
  TablaAnalitica,
  Vacio,
  rangoPorDefecto,
} from '../componentes';
import styles from '../analitica.module.css';

const POR_CARGA = 300;

const DISPOSITIVO = { movil: 'Móvil', tablet: 'Tableta', escritorio: 'Escritorio' };

export default function AnaliticaSesiones() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [filas, setFilas] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerSesiones(rango.desde, rango.hasta, { limite: POR_CARGA });
    setError(resultado.success ? null : resultado.error);
    setTotal(resultado.total);
    setFilas(
      resultado.data.map((f) => ({
        ...f,
        __clave: f.id,
        page_views: Number(f.page_views),
        event_count: Number(f.event_count),
        duration_seconds: Number(f.duration_seconds),
        origen: ETIQUETAS_ORIGEN[f.referrer_type] || f.referrer_type || 'Desconocido',
        dispositivo: DISPOSITIVO[f.device] || f.device || '—',
        campana: [f.utm_source, f.utm_medium, f.utm_campaign].filter(Boolean).join(' / ') || '—',
      }))
    );
    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const columnas = [
    {
      clave: 'started_at',
      titulo: 'Inicio',
      ancho: 20,
      render: (f) => formatearFecha(f.started_at),
      exportar: (f) => formatearFecha(f.started_at),
    },
    {
      clave: 'duration_seconds',
      titulo: 'Duración',
      ancho: 14,
      numero: true,
      render: (f) => formatearDuracion(f.duration_seconds),
    },
    {
      clave: 'page_views',
      titulo: 'Páginas',
      numero: true,
      render: (f) => formatearNumero(f.page_views),
    },
    {
      clave: 'event_count',
      titulo: 'Eventos',
      numero: true,
      render: (f) => formatearNumero(f.event_count),
    },
    {
      clave: 'entry_path',
      titulo: 'Entra por',
      ancho: 38,
      render: (f) => (
        <span className={styles.ruta} title={f.entry_path}>
          <span className={styles.recorte}>{f.entry_path || '—'}</span>
        </span>
      ),
    },
    {
      clave: 'exit_path',
      titulo: 'Sale por',
      ancho: 38,
      render: (f) => (
        <span className={styles.ruta} title={f.exit_path}>
          <span className={styles.recorte}>{f.exit_path || '—'}</span>
        </span>
      ),
    },
    {
      clave: 'origen',
      titulo: 'Origen',
      ancho: 18,
      render: (f) => <span className={styles.etiqueta}>{f.origen}</span>,
    },
    {
      clave: 'referrer_host',
      titulo: 'Procedencia',
      ancho: 26,
      render: (f) => <span className={styles.recorte}>{f.referrer_host || '(directo)'}</span>,
      exportar: (f) => f.referrer_host || '(directo)',
    },
    { clave: 'campana', titulo: 'Campaña', ancho: 24 },
    { clave: 'dispositivo', titulo: 'Dispositivo', ancho: 14 },
    { clave: 'browser', titulo: 'Navegador', ancho: 16 },
    { clave: 'os', titulo: 'Sistema', ancho: 14 },
    {
      clave: 'viewport_width',
      titulo: 'Ancho de ventana',
      ancho: 18,
      numero: true,
      render: (f) => (f.viewport_width ? `${f.viewport_width} px` : '—'),
      exportar: (f) => f.viewport_width ?? null,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Sesiones</h1>
          <p className={styles.subtitle}>
            Cada visita, una fila. El identificador es aleatorio y muere al
            cerrar la pestaña: no hay forma de saber si dos sesiones son de la
            misma persona, y así es como debe ser.
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

      {total > POR_CARGA && (
        <p className={styles.aviso}>
          Hay {formatearNumero(total)} sesiones en este periodo y se muestran las{' '}
          {POR_CARGA} más recientes. Acota el rango de fechas para ver el resto.
        </p>
      )}

      <div className={styles.tarjeta}>
        <TablaAnalitica
          columnas={columnas}
          filas={filas}
          rango={rango}
          cargando={cargando}
          nombreExport="sesiones"
          ordenInicial={{ clave: 'started_at', asc: false }}
          vacio={<Vacio titulo="Sin sesiones en este periodo" />}
        />
      </div>
    </div>
  );
}
