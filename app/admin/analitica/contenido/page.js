'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ETIQUETAS_PAGINA,
  formatearDuracion,
  formatearNumero,
  obtenerContenido,
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

const TIPOS = [
  { valor: '', etiqueta: 'Todo el contenido' },
  { valor: 'blog', etiqueta: 'Solo artículos' },
  { valor: 'producto', etiqueta: 'Solo fichas de producto' },
  { valor: 'categoria', etiqueta: 'Solo categorías' },
];

export default function AnaliticaContenido() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [tipo, setTipo] = useState('');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerContenido(rango.desde, rango.hasta, tipo || null, 500);
    setError(resultado.success ? null : resultado.error);

    setFilas(
      resultado.data.map((f) => {
        const vistas = Number(f.vistas);
        const clics = Number(f.clics_afiliado);
        return {
          ...f,
          __clave: f.entity_id,
          vistas,
          sesiones: Number(f.sesiones),
          clics_afiliado: clics,
          duracion_media: f.duracion_media === null ? null : Number(f.duracion_media),
          scroll_medio: f.scroll_medio === null ? null : Number(f.scroll_medio),
          leen_mitad_pct: f.leen_mitad_pct === null ? null : Number(f.leen_mitad_pct),
          leen_entero_pct: f.leen_entero_pct === null ? null : Number(f.leen_entero_pct),
          // La cifra que de verdad ordena el valor de cada contenido: de cada
          // cien personas que lo abren, cuántas acaban pulsando hacia Amazon.
          conversion: vistas > 0 ? Number(((clics / vistas) * 100).toFixed(1)) : null,
        };
      })
    );
    setCargando(false);
  }, [rango, tipo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const columnas = [
    {
      clave: 'entity_title',
      titulo: 'Contenido',
      ancho: 50,
      render: (f) =>
        f.path ? (
          <Link href={f.path} target="_blank" title={f.entity_title || f.entity_id}>
            <span className={styles.recorte}>{f.entity_title || f.entity_id}</span>
          </Link>
        ) : (
          <span className={styles.recorte}>{f.entity_title || f.entity_id}</span>
        ),
      exportar: (f) => f.entity_title || f.entity_id,
    },
    {
      clave: 'path',
      titulo: 'Ruta',
      ancho: 40,
      render: (f) => (
        <span className={styles.ruta}>
          <span className={styles.recorte}>{f.path || '—'}</span>
        </span>
      ),
    },
    { clave: 'vistas', titulo: 'Vistas', numero: true, render: (f) => formatearNumero(f.vistas) },
    {
      clave: 'duracion_media',
      titulo: 'Tiempo medio',
      ancho: 16,
      numero: true,
      render: (f) => formatearDuracion(f.duracion_media),
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
      clave: 'clics_afiliado',
      titulo: 'Clics a Amazon',
      ancho: 16,
      numero: true,
      render: (f) => formatearNumero(f.clics_afiliado),
    },
    {
      clave: 'conversion',
      titulo: '% que pulsa',
      numero: true,
      render: (f) => (f.conversion === null ? '—' : `${f.conversion} %`),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Contenido</h1>
          <p className={styles.subtitle}>
            Lo mismo que en «Páginas», pero con el nombre real de cada artículo,
            ficha o categoría, y con la columna que importa en una web de
            afiliación: de cada cien visitas, cuántas terminan en un clic hacia
            Amazon.
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
          nombreExport="contenido"
          ordenInicial={{ clave: 'vistas', asc: false }}
          herramientasExtra={
            <select
              className={styles.select}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              aria-label="Tipo de contenido"
            >
              {TIPOS.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.etiqueta}
                </option>
              ))}
            </select>
          }
          vacio={
            <Vacio titulo="Sin contenido registrado en este periodo">
              {tipo
                ? `No hay visitas de tipo «${ETIQUETAS_PAGINA[tipo] || tipo}» en estas fechas.`
                : 'Prueba a ampliar el rango de fechas.'}
            </Vacio>
          }
        />
      </div>
    </div>
  );
}
