'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { descargarExcel, nombreConFecha } from '@/lib/excel';
import styles from './analitica.module.css';

/* ------------------------------------------------------------ navegación */

const SECCIONES = [
  { href: '/admin/analitica', etiqueta: 'Resumen' },
  { href: '/admin/analitica/paginas', etiqueta: 'Páginas' },
  { href: '/admin/analitica/contenido', etiqueta: 'Contenido' },
  { href: '/admin/analitica/recorridos', etiqueta: 'Recorridos' },
  { href: '/admin/analitica/busquedas', etiqueta: 'Búsquedas' },
  { href: '/admin/analitica/clics', etiqueta: 'Clics' },
  { href: '/admin/analitica/sesiones', etiqueta: 'Sesiones' },
  { href: '/admin/analitica/eventos', etiqueta: 'Eventos' },
];

export function SubNav() {
  const actual = usePathname();

  return (
    <nav className={styles.subnav}>
      {SECCIONES.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className={`${styles.subnavItem} ${actual === s.href ? styles.subnavActivo : ''}`}
        >
          {s.etiqueta}
        </Link>
      ))}
    </nav>
  );
}

/* --------------------------------------------------------- rango de fechas */

const DIA_MS = 24 * 60 * 60 * 1000;

/** Fecha en formato de <input type="date">, en hora local. */
function aInput(fecha) {
  const d = new Date(fecha);
  const desfase = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d.getTime() - desfase).toISOString().slice(0, 10);
}

/** Inicio del día local. Todos los rangos son [desde, hasta) sobre días enteros. */
function inicioDelDia(fecha) {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const PRESETS = [
  { id: '7', etiqueta: '7 días', dias: 7 },
  { id: '30', etiqueta: '30 días', dias: 30 },
  { id: '90', etiqueta: '90 días', dias: 90 },
  { id: '365', etiqueta: '12 meses', dias: 365 },
];

/** Rango por defecto: los últimos 30 días incluyendo hoy. */
export function rangoPorDefecto(dias = 30) {
  const hasta = new Date(inicioDelDia(new Date()).getTime() + DIA_MS);
  const desde = new Date(hasta.getTime() - dias * DIA_MS);
  return { desde, hasta, preset: String(dias) };
}

export function RangoFechas({ valor, onChange }) {
  const aplicarPreset = (dias) => onChange(rangoPorDefecto(dias));

  const cambiarFecha = (campo, texto) => {
    if (!texto) return;
    // El límite superior es exclusivo: para incluir el día elegido entero hay
    // que apuntar al comienzo del siguiente.
    const fecha =
      campo === 'desde'
        ? inicioDelDia(`${texto}T00:00:00`)
        : new Date(inicioDelDia(`${texto}T00:00:00`).getTime() + DIA_MS);

    onChange({ ...valor, [campo]: fecha, preset: 'personalizado' });
  };

  return (
    <div className={styles.rango}>
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`${styles.rangoPreset} ${valor.preset === p.id ? styles.rangoPresetActivo : ''}`}
          onClick={() => aplicarPreset(p.dias)}
        >
          {p.etiqueta}
        </button>
      ))}

      <div className={styles.rangoFechas}>
        <label htmlFor="rango-desde">Del</label>
        <input
          id="rango-desde"
          type="date"
          className={styles.rangoInput}
          value={aInput(valor.desde)}
          max={aInput(new Date(valor.hasta.getTime() - DIA_MS))}
          onChange={(e) => cambiarFecha('desde', e.target.value)}
        />
        <label htmlFor="rango-hasta">al</label>
        <input
          id="rango-hasta"
          type="date"
          className={styles.rangoInput}
          value={aInput(new Date(valor.hasta.getTime() - DIA_MS))}
          min={aInput(valor.desde)}
          onChange={(e) => cambiarFecha('hasta', e.target.value)}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- piezas */

export function Kpi({ etiqueta, valor, pie }) {
  return (
    <div className={styles.kpi}>
      <p className={styles.kpiEtiqueta}>{etiqueta}</p>
      <p className={styles.kpiValor}>{valor}</p>
      {pie && <p className={styles.kpiPie}>{pie}</p>}
    </div>
  );
}

export function Vacio({ titulo = 'Todavía no hay datos', children }) {
  return (
    <div className={styles.vacio}>
      <p className={styles.vacioTitulo}>{titulo}</p>
      {children}
    </div>
  );
}

export function AvisoConsentimiento() {
  return (
    <p className={styles.aviso}>
      Estos números solo incluyen a quien ha aceptado la categoría
      «Estadísticas propias» en el aviso de cookies. Quien la rechaza no se
      registra en ningún sitio, así que el total real de visitas es mayor que
      el que se ve aquí. No es un fallo: es la condición para que la medición
      sea legal.
    </p>
  );
}

/* ---------------------------------------------------------------- tabla */

const POR_PAGINA = 25;

/**
 * Tabla con búsqueda, orden, paginación y exportación.
 *
 * Todo ocurre en el cliente sobre las filas que ya están cargadas: los
 * informes vienen acotados desde la base de datos (unos cientos de filas como
 * mucho), así que no compensa ir y volver al servidor para filtrar.
 *
 * @param {Array} columnas Cada una: { clave, titulo, ancho?, numero?, render?, exportar? }
 *   - `render` decide cómo se pinta la celda; `exportar` qué valor va al Excel.
 *     Se separan porque en pantalla interesa «1 min 35 s» y en la hoja de
 *     cálculo interesa el número 95, que se puede sumar y ordenar.
 */
export function TablaAnalitica({
  columnas,
  filas,
  nombreExport,
  rango,
  cargando = false,
  vacio,
  herramientasExtra = null,
  ordenInicial = null,
  buscable = true,
}) {
  const [texto, setTexto] = useState('');
  const [orden, setOrden] = useState(ordenInicial);
  const [pagina, setPagina] = useState(0);

  const filtradas = useMemo(() => {
    const termino = texto.trim().toLowerCase();
    if (!termino) return filas;

    return filas.filter((fila) =>
      columnas.some((col) => {
        const v = fila[col.clave];
        return v !== null && v !== undefined && String(v).toLowerCase().includes(termino);
      })
    );
  }, [filas, columnas, texto]);

  const ordenadas = useMemo(() => {
    if (!orden) return filtradas;

    const copia = [...filtradas];
    copia.sort((a, b) => {
      const x = a[orden.clave];
      const y = b[orden.clave];

      // Los nulos siempre al final, se ordene como se ordene: una fila sin
      // dato no es «la más pequeña», es una fila sin dato.
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;

      const comparacion =
        typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y), 'es', { numeric: true });

      return orden.asc ? comparacion : -comparacion;
    });
    return copia;
  }, [filtradas, orden]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas - 1);
  const visibles = ordenadas.slice(paginaSegura * POR_PAGINA, (paginaSegura + 1) * POR_PAGINA);

  const alternarOrden = (clave) => {
    setPagina(0);
    setOrden((previo) =>
      previo?.clave === clave ? { clave, asc: !previo.asc } : { clave, asc: false }
    );
  };

  const exportar = () => {
    // Se exporta lo filtrado y ordenado, no solo la página visible: quien
    // filtra por «blog» y exporta espera las 80 filas, no las 25 que ve.
    const columnasExcel = columnas.map((c) => ({
      clave: c.clave,
      titulo: c.titulo,
      ancho: c.ancho,
    }));

    const datos = ordenadas.map((fila) => {
      const salida = {};
      for (const col of columnas) {
        salida[col.clave] = col.exportar ? col.exportar(fila) : fila[col.clave];
      }
      return salida;
    });

    descargarExcel(
      columnasExcel,
      datos,
      nombreConFecha(nombreExport, rango.desde, new Date(rango.hasta.getTime() - DIA_MS)),
      nombreExport
    );
  };

  if (cargando) return <div className={styles.cargando}>Cargando…</div>;

  return (
    <>
      <div className={styles.tarjetaCabecera}>
        <div className={styles.herramientas}>
          {buscable && (
            <input
              type="search"
              className={styles.buscador}
              placeholder="Filtrar en la tabla…"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                setPagina(0);
              }}
            />
          )}
          {herramientasExtra}
        </div>

        <button
          type="button"
          className={styles.botonExportar}
          onClick={exportar}
          disabled={!ordenadas.length}
        >
          Exportar a Excel ({ordenadas.length})
        </button>
      </div>

      {!ordenadas.length ? (
        vacio || <Vacio />
      ) : (
        <>
          <div className={styles.tablaEnvoltorio}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  {columnas.map((col) => (
                    <th
                      key={col.clave}
                      className={`${styles.thOrdenable} ${col.numero ? styles.numero : ''}`}
                      onClick={() => alternarOrden(col.clave)}
                      title="Ordenar por esta columna"
                    >
                      {col.titulo}
                      {orden?.clave === col.clave && (
                        <span className={styles.flecha}>{orden.asc ? '▲' : '▼'}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibles.map((fila, i) => (
                  <tr key={fila.__clave || `${paginaSegura}-${i}`}>
                    {columnas.map((col) => (
                      <td key={col.clave} className={col.numero ? styles.numero : ''}>
                        {col.render ? col.render(fila) : fila[col.clave] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.paginacion}>
            <span>
              {ordenadas.length.toLocaleString('es-ES')} filas
              {texto && ` (filtradas de ${filas.length.toLocaleString('es-ES')})`}
              {' · '}
              página {paginaSegura + 1} de {totalPaginas}
            </span>

            {totalPaginas > 1 && (
              <div className={styles.paginacionBotones}>
                <button
                  type="button"
                  className={styles.botonSecundario}
                  onClick={() => setPagina((p) => Math.max(0, p - 1))}
                  disabled={paginaSegura === 0}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className={styles.botonSecundario}
                  onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={paginaSegura >= totalPaginas - 1}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export { styles as estilos };
