'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ETIQUETAS_PAGINA,
  formatearDuracion,
  formatearNumero,
  obtenerPaginas,
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

export default function AnaliticaPaginas() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerPaginas(rango.desde, rango.hasta, 500);
    setError(resultado.success ? null : resultado.error);
    setFilas(
      resultado.data.map((f) => ({
        ...f,
        __clave: f.path,
        vistas: Number(f.vistas),
        sesiones: Number(f.sesiones),
        salidas: Number(f.salidas),
        duracion_media: f.duracion_media === null ? null : Number(f.duracion_media),
        scroll_medio: f.scroll_medio === null ? null : Number(f.scroll_medio),
        leen_mitad_pct: f.leen_mitad_pct === null ? null : Number(f.leen_mitad_pct),
        leen_entero_pct: f.leen_entero_pct === null ? null : Number(f.leen_entero_pct),
        // Porcentaje de sesiones que terminan aquí. Una cifra alta en una
        // ficha de producto es buena señal (se han ido a Amazon); en la
        // portada, todo lo contrario.
        tasa_salida:
          Number(f.vistas) > 0 ? Math.round((Number(f.salidas) / Number(f.vistas)) * 100) : null,
      }))
    );
    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const columnas = [
    {
      clave: 'path',
      titulo: 'Ruta',
      ancho: 48,
      render: (f) => (
        <Link href={f.path} target="_blank" className={styles.ruta} title={f.path}>
          <span className={styles.recorte}>{f.path}</span>
        </Link>
      ),
    },
    {
      clave: 'page_type',
      titulo: 'Tipo',
      ancho: 20,
      render: (f) => (
        <span className={styles.etiqueta}>{ETIQUETAS_PAGINA[f.page_type] || f.page_type || '—'}</span>
      ),
      exportar: (f) => ETIQUETAS_PAGINA[f.page_type] || f.page_type || '',
    },
    { clave: 'vistas', titulo: 'Vistas', numero: true, render: (f) => formatearNumero(f.vistas) },
    {
      clave: 'sesiones',
      titulo: 'Sesiones',
      numero: true,
      render: (f) => formatearNumero(f.sesiones),
    },
    {
      clave: 'duracion_media',
      titulo: 'Tiempo medio',
      ancho: 16,
      numero: true,
      render: (f) => formatearDuracion(f.duracion_media),
    },
    {
      clave: 'scroll_medio',
      titulo: 'Scroll medio',
      numero: true,
      render: (f) => (f.scroll_medio === null ? '—' : `${f.scroll_medio} %`),
    },
    {
      clave: 'leen_mitad_pct',
      titulo: 'Pasan de la mitad',
      ancho: 18,
      numero: true,
      render: (f) => (f.leen_mitad_pct === null ? '—' : `${f.leen_mitad_pct} %`),
    },
    {
      clave: 'leen_entero_pct',
      titulo: 'Llegan al final',
      ancho: 18,
      numero: true,
      render: (f) => (f.leen_entero_pct === null ? '—' : `${f.leen_entero_pct} %`),
    },
    {
      clave: 'tasa_salida',
      titulo: 'Acaban aquí',
      numero: true,
      render: (f) => (f.tasa_salida === null ? '—' : `${f.tasa_salida} %`),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Páginas</h1>
          <p className={styles.subtitle}>
            Cada ruta de la web con sus vistas, el tiempo que se le dedica y
            hasta dónde se baja. «Pasan de la mitad» y «Llegan al final» son
            las dos columnas que dicen si una guía larga se lee de verdad o se
            abandona en el primer apartado.
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
        <TablaAnalitica
          columnas={columnas}
          filas={filas}
          rango={rango}
          cargando={cargando}
          nombreExport="paginas"
          ordenInicial={{ clave: 'vistas', asc: false }}
          vacio={
            <Vacio titulo="Ninguna página registrada en este periodo">
              Prueba a ampliar el rango de fechas.
            </Vacio>
          }
        />
      </div>
    </div>
  );
}
