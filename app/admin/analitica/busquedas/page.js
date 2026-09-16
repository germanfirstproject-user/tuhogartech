'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatearNumero, obtenerBusquedas } from '@/lib/analitica';
import {
  AvisoConsentimiento,
  Kpi,
  RangoFechas,
  SubNav,
  TablaAnalitica,
  Vacio,
  rangoPorDefecto,
} from '../componentes';
import styles from '../analitica.module.css';

export default function AnaliticaBusquedas() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [filas, setFilas] = useState([]);
  const [soloVacias, setSoloVacias] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerBusquedas(rango.desde, rango.hasta, 1000);
    setError(resultado.success ? null : resultado.error);
    setFilas(
      resultado.data.map((f) => ({
        ...f,
        __clave: f.search_term,
        veces: Number(f.veces),
        sesiones: Number(f.sesiones),
        sin_resultados: Number(f.sin_resultados),
        resultados_medios: f.resultados_medios === null ? null : Number(f.resultados_medios),
      }))
    );
    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(
    () => (soloVacias ? filas.filter((f) => f.sin_resultados > 0) : filas),
    [filas, soloVacias]
  );

  const totales = useMemo(
    () => ({
      busquedas: filas.reduce((n, f) => n + f.veces, 0),
      terminos: filas.length,
      vacias: filas.reduce((n, f) => n + f.sin_resultados, 0),
    }),
    [filas]
  );

  const columnas = [
    {
      clave: 'search_term',
      titulo: 'Término buscado',
      ancho: 42,
      render: (f) => (
        <Link href={`/buscar?q=${encodeURIComponent(f.search_term)}`} target="_blank">
          <span className={styles.recorte}>{f.search_term}</span>
        </Link>
      ),
    },
    { clave: 'veces', titulo: 'Veces', numero: true, render: (f) => formatearNumero(f.veces) },
    {
      clave: 'sesiones',
      titulo: 'Sesiones',
      numero: true,
      render: (f) => formatearNumero(f.sesiones),
    },
    {
      clave: 'resultados_medios',
      titulo: 'Resultados de media',
      ancho: 20,
      numero: true,
      render: (f) => (f.resultados_medios === null ? '—' : f.resultados_medios),
    },
    {
      clave: 'sin_resultados',
      titulo: 'Sin resultados',
      ancho: 16,
      numero: true,
      render: (f) =>
        f.sin_resultados > 0 ? (
          <span className={`${styles.etiqueta} ${styles.etiquetaAmazon}`}>{f.sin_resultados}</span>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Búsquedas</h1>
          <p className={styles.subtitle}>
            Lo que la gente escribe en el buscador de la web. Un término repetido
            que devuelve cero resultados es un artículo o un producto que te
            están pidiendo con sus propias palabras.
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

      {!cargando && filas.length > 0 && (
        <div className={styles.kpis}>
          <Kpi etiqueta="Búsquedas" valor={formatearNumero(totales.busquedas)} />
          <Kpi etiqueta="Términos distintos" valor={formatearNumero(totales.terminos)} />
          <Kpi
            etiqueta="Sin resultados"
            valor={formatearNumero(totales.vacias)}
            pie={
              totales.busquedas
                ? `${Math.round((totales.vacias / totales.busquedas) * 100)} % del total`
                : null
            }
          />
        </div>
      )}

      <div className={styles.tarjeta}>
        <TablaAnalitica
          columnas={columnas}
          filas={visibles}
          rango={rango}
          cargando={cargando}
          nombreExport={soloVacias ? 'busquedas_sin_resultados' : 'busquedas'}
          ordenInicial={{ clave: 'veces', asc: false }}
          herramientasExtra={
            <button
              type="button"
              className={soloVacias ? styles.rangoPresetActivo : styles.botonSecundario}
              onClick={() => setSoloVacias((v) => !v)}
            >
              {soloVacias ? 'Ver todas' : 'Solo las que no encuentran nada'}
            </button>
          }
          vacio={
            <Vacio titulo={soloVacias ? 'Ninguna búsqueda se quedó vacía' : 'Nadie ha usado el buscador'}>
              {soloVacias
                ? 'Todo lo que se ha buscado ha devuelto algún resultado.'
                : 'Aparecerán aquí en cuanto alguien busque desde la cabecera.'}
            </Vacio>
          }
        />
      </div>
    </div>
  );
}
