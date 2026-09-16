'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ETIQUETAS_ORIGEN,
  formatearDuracion,
  formatearNumero,
  obtenerBusquedas,
  obtenerContenido,
  obtenerDispositivos,
  obtenerOrigenes,
  obtenerPaginas,
  obtenerResumen,
  obtenerSerie,
} from '@/lib/analitica';
import {
  AvisoConsentimiento,
  Kpi,
  RangoFechas,
  SubNav,
  Vacio,
  rangoPorDefecto,
} from './componentes';
import styles from './analitica.module.css';

export default function AnaliticaResumen() {
  const [rango, setRango] = useState(() => rangoPorDefecto(30));
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState({
    resumen: null,
    serie: [],
    paginas: [],
    contenido: [],
    origenes: [],
    dispositivos: [],
    busquedas: [],
  });

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    const { desde, hasta } = rango;

    // En paralelo: son ocho consultas independientes y encadenarlas
    // multiplicaría por ocho la espera del panel.
    const [resumen, serie, paginas, contenido, origenes, dispositivos, busquedas] =
      await Promise.all([
        obtenerResumen(desde, hasta),
        obtenerSerie(desde, hasta),
        obtenerPaginas(desde, hasta, 10),
        obtenerContenido(desde, hasta, null, 10),
        obtenerOrigenes(desde, hasta),
        obtenerDispositivos(desde, hasta),
        obtenerBusquedas(desde, hasta, 10),
      ]);

    const fallo = [resumen, serie, paginas, contenido, origenes, dispositivos, busquedas].find(
      (r) => r.success === false
    );
    if (fallo) setError(fallo.error);

    setDatos({
      resumen: resumen.data,
      serie: serie.data,
      paginas: paginas.data,
      contenido: contenido.data,
      origenes: origenes.data,
      dispositivos: dispositivos.data,
      busquedas: busquedas.data,
    });
    setCargando(false);
  }, [rango]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const r = datos.resumen;
  const hayDatos = Number(r?.sesiones || 0) > 0;

  const serieGrafico = datos.serie.map((d) => ({
    dia: new Date(d.dia).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    Sesiones: Number(d.sesiones),
    Vistas: Number(d.vistas),
    'Clics a Amazon': Number(d.clics_afiliado),
  }));

  // Los orígenes vienen desglosados por dominio; para el resumen interesa el
  // tipo (buscador, IA, social…), que es la lectura de una ojeada.
  const porTipoOrigen = Object.values(
    datos.origenes.reduce((acumulado, fila) => {
      const clave = fila.referrer_type || 'desconocido';
      acumulado[clave] = acumulado[clave] || { tipo: clave, sesiones: 0 };
      acumulado[clave].sesiones += Number(fila.sesiones);
      return acumulado;
    }, {})
  ).sort((a, b) => b.sesiones - a.sesiones);

  const totalSesiones = Number(r?.sesiones || 0);
  const porcentaje = (n) =>
    totalSesiones ? `${Math.round((n / totalSesiones) * 100)} %` : '—';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analítica</h1>
          <p className={styles.subtitle}>
            Medición propia, guardada en tu base de datos. Es la que puedes
            cruzar con el catálogo: qué artículo acaba en un clic a Amazon, qué
            se busca y no aparece, hasta dónde se lee cada guía.
          </p>
        </div>
        <button type="button" className={styles.botonSecundario} onClick={cargar}>
          Actualizar
        </button>
      </div>

      <SubNav />
      <RangoFechas valor={rango} onChange={setRango} />

      {error && <div className={styles.error}>No se pudieron cargar los datos: {error}</div>}

      {cargando ? (
        <div className={styles.cargando}>Cargando…</div>
      ) : !hayDatos ? (
        <div className={styles.tarjeta}>
          <Vacio titulo="Todavía no hay visitas registradas en este periodo">
            La medición empieza a guardar en cuanto alguien acepta la categoría
            «Estadísticas propias» del aviso de cookies. Si acabas de publicar
            el cambio, dale unas horas.
          </Vacio>
        </div>
      ) : (
        <>
          <AvisoConsentimiento />

          <div className={styles.kpis}>
            <Kpi etiqueta="Sesiones" valor={formatearNumero(r.sesiones)} />
            <Kpi
              etiqueta="Páginas vistas"
              valor={formatearNumero(r.vistas)}
              pie={`${r.paginas_por_sesion ?? '—'} por sesión`}
            />
            <Kpi
              etiqueta="Duración media"
              valor={formatearDuracion(r.duracion_media)}
              pie="por sesión completa"
            />
            <Kpi
              etiqueta="Sesiones de una página"
              valor={r.rebote_pct != null ? `${r.rebote_pct} %` : '—'}
              pie="entran, leen y se van"
            />
            <Kpi
              etiqueta="Clics a Amazon"
              valor={formatearNumero(r.clics_afiliado)}
              pie={
                totalSesiones
                  ? `${((Number(r.clics_afiliado) / totalSesiones) * 100).toFixed(1)} % de las sesiones`
                  : null
              }
            />
            <Kpi etiqueta="Búsquedas" valor={formatearNumero(r.busquedas)} />
          </div>

          <div className={styles.tarjeta}>
            <div className={styles.tarjetaCabecera}>
              <div>
                <h2 className={styles.tarjetaTitulo}>Evolución diaria</h2>
                <p className={styles.tarjetaNota}>
                  Sesiones, páginas vistas y clics que salen hacia Amazon.
                </p>
              </div>
            </div>

            <div className={styles.grafico}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serieGrafico} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSesiones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1b6457" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1b6457" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gVistas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7aa8a0" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7aa8a0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceae5" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} stroke="#bbb" minTickGap={18} />
                  <YAxis tick={{ fontSize: 11 }} stroke="#bbb" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e3e3e0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="Vistas"
                    stroke="#7aa8a0"
                    fill="url(#gVistas)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Sesiones"
                    stroke="#1b6457"
                    fill="url(#gSesiones)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Clics a Amazon"
                    stroke="#d4a03d"
                    fill="none"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.columnas2}>
            <div className={styles.tarjeta}>
              <h2 className={styles.tarjetaTitulo}>Páginas más vistas</h2>
              <p className={styles.tarjetaNota}>Las diez primeras del periodo.</p>
              <ListaSimple
                filas={datos.paginas.map((p) => ({
                  clave: p.path,
                  etiqueta: p.path,
                  valor: formatearNumero(p.vistas),
                  pie: p.duracion_media ? formatearDuracion(p.duracion_media) : null,
                  monoespaciada: true,
                }))}
              />
            </div>

            <div className={styles.tarjeta}>
              <h2 className={styles.tarjetaTitulo}>Contenido más leído</h2>
              <p className={styles.tarjetaNota}>
                Artículos, fichas y categorías, con su nombre real.
              </p>
              <ListaSimple
                filas={datos.contenido.map((c) => ({
                  clave: c.entity_id,
                  etiqueta: c.entity_title || c.entity_id,
                  valor: formatearNumero(c.vistas),
                  pie:
                    Number(c.clics_afiliado) > 0
                      ? `${c.clics_afiliado} clic(s) a Amazon`
                      : c.duracion_media
                        ? formatearDuracion(c.duracion_media)
                        : null,
                }))}
              />
            </div>
          </div>

          <div className={styles.columnas2}>
            <div className={styles.tarjeta}>
              <h2 className={styles.tarjetaTitulo}>De dónde llega la gente</h2>
              <p className={styles.tarjetaNota}>
                «Asistente de IA» agrupa ChatGPT, Perplexity, Claude y Copilot.
              </p>
              <ListaSimple
                filas={porTipoOrigen.map((o) => ({
                  clave: o.tipo,
                  etiqueta: ETIQUETAS_ORIGEN[o.tipo] || o.tipo,
                  valor: formatearNumero(o.sesiones),
                  pie: porcentaje(o.sesiones),
                }))}
              />
            </div>

            <div className={styles.tarjeta}>
              <h2 className={styles.tarjetaTitulo}>Con qué te leen</h2>
              <p className={styles.tarjetaNota}>Dispositivo y navegador.</p>
              <ListaSimple
                filas={datos.dispositivos.slice(0, 10).map((d) => ({
                  clave: `${d.device}-${d.browser}`,
                  etiqueta: `${d.device === 'movil' ? 'Móvil' : d.device === 'tablet' ? 'Tableta' : 'Escritorio'} · ${d.browser}`,
                  valor: formatearNumero(d.sesiones),
                  pie: formatearDuracion(d.duracion_media),
                }))}
              />
            </div>
          </div>

          <div className={styles.tarjeta}>
            <h2 className={styles.tarjetaTitulo}>Lo más buscado en la web</h2>
            <p className={styles.tarjetaNota}>
              Las búsquedas sin resultados son el mejor mapa de qué contenido
              falta: alguien lo ha pedido con sus palabras y no lo ha encontrado.
            </p>
            <ListaSimple
              filas={datos.busquedas.map((b) => ({
                clave: b.search_term,
                etiqueta: b.search_term,
                valor: formatearNumero(b.veces),
                pie:
                  Number(b.sin_resultados) > 0
                    ? `${b.sin_resultados} sin resultados`
                    : `${b.resultados_medios} resultados de media`,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}

/** Lista compacta de «etiqueta · valor», reutilizada por todas las tarjetas. */
function ListaSimple({ filas }) {
  if (!filas.length) return <Vacio titulo="Sin datos en este periodo" />;

  return (
    <div className={styles.tablaEnvoltorio}>
      <table className={styles.tabla}>
        <tbody>
          {filas.map((f) => (
            <tr key={f.clave}>
              <td>
                <span className={f.monoespaciada ? styles.ruta : undefined}>
                  <span className={styles.recorte}>{f.etiqueta}</span>
                </span>
                {f.pie && <span className={styles.kpiPie}>{f.pie}</span>}
              </td>
              <td className={styles.numero}>{f.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
