'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ETIQUETAS_TIPO, formatearNumero, obtenerClics } from '@/lib/analitica';
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

const FILTROS = [
  { valor: '', etiqueta: 'Todos los clics' },
  { valor: 'clic_afiliado', etiqueta: 'Solo los que van a Amazon' },
  { valor: 'clic', etiqueta: 'Solo navegación interna' },
  { valor: 'clic_externo', etiqueta: 'Solo salidas a otras webs' },
];

export default function AnaliticaClics() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [tipo, setTipo] = useState('clic_afiliado');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerClics(rango.desde, rango.hasta, 1000);
    setError(resultado.success ? null : resultado.error);
    setFilas(
      resultado.data.map((f, i) => ({
        ...f,
        __clave: `${f.tipo}-${f.link_href}-${f.origen_path}-${i}`,
        clics: Number(f.clics),
        sesiones: Number(f.sesiones),
        tipo_legible: ETIQUETAS_TIPO[f.tipo] || f.tipo,
        destino: f.link_href || f.modulo || '—',
      }))
    );
    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(
    () => (tipo ? filas.filter((f) => f.tipo === tipo) : filas),
    [filas, tipo]
  );

  const totales = useMemo(() => {
    const suma = (t) =>
      filas.filter((f) => f.tipo === t).reduce((n, f) => n + f.clics, 0);
    return {
      amazon: suma('clic_afiliado'),
      interno: suma('clic'),
      externo: suma('clic_externo'),
    };
  }, [filas]);

  const columnas = [
    {
      clave: 'tipo_legible',
      titulo: 'Tipo',
      ancho: 18,
      render: (f) => (
        <span
          className={`${styles.etiqueta} ${f.tipo === 'clic_afiliado' ? styles.etiquetaAmazon : ''} ${
            f.tipo === 'clic_externo' ? styles.etiquetaSalida : ''
          }`}
        >
          {f.tipo_legible}
        </span>
      ),
    },
    {
      clave: 'entity_title',
      titulo: 'Producto o elemento',
      ancho: 40,
      render: (f) => <span className={styles.recorte}>{f.entity_title || f.entity_id || '—'}</span>,
      exportar: (f) => f.entity_title || f.entity_id || '',
    },
    {
      clave: 'origen_path',
      titulo: 'Se pulsa desde',
      ancho: 40,
      render: (f) => (
        <span className={styles.ruta} title={f.origen_path}>
          <span className={styles.recorte}>{f.origen_path}</span>
        </span>
      ),
    },
    {
      clave: 'modulo',
      titulo: 'Botón / módulo',
      ancho: 24,
      render: (f) => <span className={styles.recorte}>{f.modulo || '—'}</span>,
      exportar: (f) => f.modulo || '',
    },
    {
      clave: 'destino',
      titulo: 'Destino',
      ancho: 45,
      render: (f) => (
        <span className={styles.ruta} title={f.destino}>
          <span className={styles.recorte}>{f.destino}</span>
        </span>
      ),
    },
    { clave: 'clics', titulo: 'Clics', numero: true, render: (f) => formatearNumero(f.clics) },
    {
      clave: 'sesiones',
      titulo: 'Sesiones',
      numero: true,
      render: (f) => formatearNumero(f.sesiones),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Clics</h1>
          <p className={styles.subtitle}>
            Dónde se pulsa. La columna «Botón / módulo» distingue los distintos
            sitios desde los que se puede llegar a Amazon: la tarjeta dentro de
            un artículo, el botón de la ficha, el recopilatorio del final. Sin
            ese dato, todos los clics parecen el mismo.
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
          <Kpi etiqueta="Clics a Amazon" valor={formatearNumero(totales.amazon)} />
          <Kpi etiqueta="Navegación interna" valor={formatearNumero(totales.interno)} />
          <Kpi etiqueta="Salidas a otras webs" valor={formatearNumero(totales.externo)} />
        </div>
      )}

      <div className={styles.tarjeta}>
        <TablaAnalitica
          columnas={columnas}
          filas={visibles}
          rango={rango}
          cargando={cargando}
          nombreExport={tipo === 'clic_afiliado' ? 'clics_amazon' : 'clics'}
          ordenInicial={{ clave: 'clics', asc: false }}
          herramientasExtra={
            <select
              className={styles.select}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              aria-label="Tipo de clic"
            >
              {FILTROS.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.etiqueta}
                </option>
              ))}
            </select>
          }
          vacio={<Vacio titulo="Sin clics registrados con este filtro" />}
        />
      </div>
    </div>
  );
}
