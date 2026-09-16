'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ETIQUETAS_PAGINA,
  ETIQUETAS_TIPO,
  formatearDuracion,
  formatearFecha,
  obtenerEventos,
  purgarAnalitica,
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

const POR_CARGA = 1000;

export default function AnaliticaEventos() {
  const [rango, setRango] = useState(() => rangoPorDefecto(7));
  const [tipo, setTipo] = useState('');
  const [texto, setTexto] = useState('');
  const [consulta, setConsulta] = useState('');
  const [filas, setFilas] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [purgando, setPurgando] = useState(false);
  const [mensajePurga, setMensajePurga] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerEventos(rango.desde, rango.hasta, {
      tipo: tipo || null,
      texto: consulta || null,
      limite: POR_CARGA,
    });

    setError(resultado.success ? null : resultado.error);
    setTotal(resultado.total);
    setFilas(
      resultado.data.map((f) => ({
        ...f,
        __clave: f.id,
        tipo_legible: ETIQUETAS_TIPO[f.tipo] || f.tipo,
        pagina_legible: ETIQUETAS_PAGINA[f.page_type] || f.page_type || '—',
        detalle:
          f.search_term ||
          f.link_href ||
          f.entity_title ||
          (f.scroll_depth !== null && f.scroll_depth !== undefined ? `${f.scroll_depth} %` : '') ||
          '—',
      }))
    );
    setCargando(false);
  }, [rango, tipo, consulta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const purgar = async () => {
    const dias = 425;
    if (
      !window.confirm(
        `Se borrarán las sesiones con más de ${dias} días (unos 14 meses) y todos sus eventos. Es irreversible. ¿Continuar?`
      )
    ) {
      return;
    }

    setPurgando(true);
    const resultado = await purgarAnalitica(dias);
    setPurgando(false);
    setMensajePurga(
      resultado.success
        ? `Se han borrado ${resultado.borradas} sesiones antiguas.`
        : `No se pudo purgar: ${resultado.error}`
    );
    cargar();
  };

  const columnas = [
    {
      clave: 'occurred_at',
      titulo: 'Cuándo',
      ancho: 20,
      render: (f) => formatearFecha(f.occurred_at),
      exportar: (f) => formatearFecha(f.occurred_at),
    },
    {
      clave: 'tipo_legible',
      titulo: 'Evento',
      ancho: 18,
      render: (f) => (
        <span
          className={`${styles.etiqueta} ${f.tipo === 'clic_afiliado' ? styles.etiquetaAmazon : ''}`}
        >
          {f.tipo_legible}
        </span>
      ),
    },
    {
      clave: 'path',
      titulo: 'Página',
      ancho: 40,
      render: (f) => (
        <span className={styles.ruta} title={f.path}>
          <span className={styles.recorte}>{f.path}</span>
        </span>
      ),
    },
    { clave: 'pagina_legible', titulo: 'Tipo de página', ancho: 20 },
    {
      clave: 'entity_title',
      titulo: 'Contenido',
      ancho: 38,
      render: (f) => <span className={styles.recorte}>{f.entity_title || '—'}</span>,
      exportar: (f) => f.entity_title || '',
    },
    {
      clave: 'detalle',
      titulo: 'Detalle',
      ancho: 42,
      render: (f) => <span className={styles.recorte}>{f.detalle}</span>,
    },
    {
      clave: 'duration_seconds',
      titulo: 'Duración',
      ancho: 14,
      numero: true,
      render: (f) => formatearDuracion(f.duration_seconds),
      exportar: (f) => f.duration_seconds ?? null,
    },
    {
      clave: 'scroll_depth',
      titulo: 'Scroll',
      numero: true,
      render: (f) =>
        f.scroll_depth === null || f.scroll_depth === undefined ? '—' : `${f.scroll_depth} %`,
      exportar: (f) => f.scroll_depth ?? null,
    },
    {
      clave: 'from_path',
      titulo: 'Viene de',
      ancho: 36,
      render: (f) => (
        <span className={styles.ruta} title={f.from_path}>
          <span className={styles.recorte}>{f.from_path || '—'}</span>
        </span>
      ),
      exportar: (f) => f.from_path || '',
    },
    { clave: 'modulo', titulo: 'Módulo', ancho: 22, exportar: (f) => f.modulo || '' },
    { clave: 'session_id', titulo: 'Sesión', ancho: 38 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Eventos</h1>
          <p className={styles.subtitle}>
            El registro en bruto, sin agregar. Sirve para responder preguntas
            que las otras pantallas no contemplan y para exportarlo todo y
            trabajarlo en una hoja de cálculo.
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
      {mensajePurga && <p className={styles.aviso}>{mensajePurga}</p>}

      {total > POR_CARGA && (
        <p className={styles.aviso}>
          Hay {total.toLocaleString('es-ES')} eventos que cumplen el filtro y se
          cargan los {POR_CARGA.toLocaleString('es-ES')} más recientes. Acota
          las fechas o filtra por tipo para ver el resto.
        </p>
      )}

      <div className={styles.tarjeta}>
        <TablaAnalitica
          columnas={columnas}
          filas={filas}
          rango={rango}
          cargando={cargando}
          nombreExport="eventos"
          buscable={false}
          ordenInicial={{ clave: 'occurred_at', asc: false }}
          herramientasExtra={
            <>
              <select
                className={styles.select}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                aria-label="Tipo de evento"
              >
                <option value="">Todos los eventos</option>
                {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </select>

              {/* La búsqueda va contra la base de datos, no sobre lo ya
                  cargado: si hay cien mil eventos, filtrar en el navegador solo
                  miraría los mil que se han traído. */}
              <input
                type="search"
                className={styles.buscador}
                placeholder="Buscar en ruta, título, término o enlace…"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setConsulta(texto.trim());
                }}
              />
              <button
                type="button"
                className={styles.botonSecundario}
                onClick={() => setConsulta(texto.trim())}
              >
                Buscar
              </button>
              {consulta && (
                <button
                  type="button"
                  className={styles.botonSecundario}
                  onClick={() => {
                    setTexto('');
                    setConsulta('');
                  }}
                >
                  Limpiar
                </button>
              )}
            </>
          }
          vacio={<Vacio titulo="Sin eventos con estos filtros" />}
        />
      </div>

      <div className={styles.tarjeta}>
        <h2 className={styles.tarjetaTitulo}>Conservación de los datos</h2>
        <p className={styles.tarjetaNota}>
          El RGPD pide no guardar los datos más tiempo del necesario, y en el
          aviso de cookies se promete borrarlos a los catorce meses. Esto lo
          cumple: elimina las sesiones anteriores a esa fecha y, con ellas,
          todos sus eventos.
        </p>
        <button
          type="button"
          className={styles.botonSecundario}
          onClick={purgar}
          disabled={purgando}
        >
          {purgando ? 'Borrando…' : 'Borrar lo anterior a catorce meses'}
        </button>
      </div>
    </div>
  );
}
