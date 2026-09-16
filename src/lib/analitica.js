/**
 * Lectura de la analítica propia para el panel.
 *
 * Todo pasa por funciones de PostgreSQL con SECURITY INVOKER, así que las
 * políticas RLS se aplican a quien llama: si la sesión no es la del
 * administrador, vuelven cero filas. No hay ninguna comprobación de permisos
 * aquí a propósito; la que vale es la de la base de datos, que no se puede
 * saltar tocando el navegador.
 */

import { supabase } from './supabase';

/** Envoltorio común: nunca lanza, siempre devuelve una forma conocida. */
async function rpc(nombre, parametros) {
  const { data, error } = await supabase.rpc(nombre, parametros);

  if (error) {
    console.error(`Analítica (${nombre}):`, error.message);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [], error: null };
}

const rango = (desde, hasta) => ({
  desde: new Date(desde).toISOString(),
  hasta: new Date(hasta).toISOString(),
});

export async function obtenerResumen(desde, hasta) {
  const resultado = await rpc('analitica_resumen', rango(desde, hasta));
  // La función devuelve una sola fila; se desenvuelve aquí para que quien la
  // use no tenga que acordarse de hacerlo.
  return { ...resultado, data: resultado.data?.[0] || null };
}

export const obtenerSerie = (desde, hasta) => rpc('analitica_serie', rango(desde, hasta));

export const obtenerPaginas = (desde, hasta, limite = 300) =>
  rpc('analitica_paginas', { ...rango(desde, hasta), limite });

export const obtenerContenido = (desde, hasta, tipo = null, limite = 300) =>
  rpc('analitica_contenido', { ...rango(desde, hasta), p_page_type: tipo, limite });

export const obtenerBusquedas = (desde, hasta, limite = 300) =>
  rpc('analitica_busquedas', { ...rango(desde, hasta), limite });

export const obtenerOrigenes = (desde, hasta) => rpc('analitica_origenes', rango(desde, hasta));

export const obtenerFlujos = (desde, hasta, limite = 300) =>
  rpc('analitica_flujos', { ...rango(desde, hasta), limite });

export const obtenerClics = (desde, hasta, limite = 300) =>
  rpc('analitica_clics', { ...rango(desde, hasta), limite });

export const obtenerDispositivos = (desde, hasta) =>
  rpc('analitica_dispositivos', rango(desde, hasta));

/** Sesiones en bruto, para la vista de detalle. */
export async function obtenerSesiones(desde, hasta, { limite = 200, offset = 0 } = {}) {
  const { desde: d, hasta: h } = rango(desde, hasta);

  const { data, error, count } = await supabase
    .from('analytics_sessions')
    .select('*', { count: 'exact' })
    .gte('started_at', d)
    .lt('started_at', h)
    .order('started_at', { ascending: false })
    .range(offset, offset + limite - 1);

  if (error) {
    console.error('Analítica (sesiones):', error.message);
    return { success: false, error: error.message, data: [], total: 0 };
  }

  return { success: true, data: data || [], total: count || 0, error: null };
}

/** Eventos en bruto, con filtros. Es la vista que alimenta la exportación fina. */
export async function obtenerEventos(
  desde,
  hasta,
  { tipo = null, pageType = null, texto = null, limite = 500, offset = 0 } = {}
) {
  const { desde: d, hasta: h } = rango(desde, hasta);

  let consulta = supabase
    .from('analytics_events')
    .select('*', { count: 'exact' })
    .gte('occurred_at', d)
    .lt('occurred_at', h);

  if (tipo) consulta = consulta.eq('tipo', tipo);
  if (pageType) consulta = consulta.eq('page_type', pageType);

  if (texto) {
    // Se escapan las comas porque `or()` las usa como separador y una coma en
    // el texto partiría el filtro en condiciones sueltas.
    const limpio = String(texto).replace(/[,()]/g, ' ').trim();
    if (limpio) {
      consulta = consulta.or(
        `path.ilike.%${limpio}%,entity_title.ilike.%${limpio}%,search_term.ilike.%${limpio}%,link_href.ilike.%${limpio}%`
      );
    }
  }

  const { data, error, count } = await consulta
    .order('occurred_at', { ascending: false })
    .range(offset, offset + limite - 1);

  if (error) {
    console.error('Analítica (eventos):', error.message);
    return { success: false, error: error.message, data: [], total: 0 };
  }

  return { success: true, data: data || [], total: count || 0, error: null };
}

/** Borra las sesiones anteriores a N días. Los eventos caen en cascada. */
export async function purgarAnalitica(dias = 425) {
  const { data, error } = await supabase.rpc('limpiar_analitica', { dias });

  if (error) {
    console.error('Analítica (purga):', error.message);
    return { success: false, error: error.message, borradas: 0 };
  }

  return { success: true, borradas: data || 0, error: null };
}

// ------------------------------------------------------------- formato

/** Segundos a algo legible: 95 -> «1 min 35 s». */
export function formatearDuracion(segundos) {
  const n = Number(segundos);
  if (!Number.isFinite(n) || n <= 0) return '—';
  if (n < 60) return `${Math.round(n)} s`;

  const minutos = Math.floor(n / 60);
  const resto = Math.round(n % 60);
  if (minutos < 60) return resto ? `${minutos} min ${resto} s` : `${minutos} min`;

  const horas = Math.floor(minutos / 60);
  return `${horas} h ${minutos % 60} min`;
}

export function formatearNumero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n.toLocaleString('es-ES') : '—';
}

export function formatearFecha(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Etiquetas legibles para los tipos internos, usadas en tablas y filtros. */
export const ETIQUETAS_TIPO = {
  vista: 'Vista de página',
  salida: 'Salida de página',
  clic: 'Clic interno',
  clic_externo: 'Clic externo',
  clic_afiliado: 'Clic a Amazon',
  busqueda: 'Búsqueda',
  interaccion: 'Interacción',
};

export const ETIQUETAS_PAGINA = {
  inicio: 'Portada',
  producto: 'Ficha de producto',
  blog: 'Artículo',
  listado_blog: 'Listado del blog',
  categoria: 'Categoría',
  listado_productos: 'Listado de productos',
  buscar: 'Buscador',
  legal: 'Legal',
  metodologia: 'Cómo analizamos',
  admin: 'Panel',
  otra: 'Otra',
};

export const ETIQUETAS_ORIGEN = {
  directo: 'Directo',
  buscador: 'Buscador',
  ia: 'Asistente de IA',
  social: 'Red social',
  referencia: 'Otra web',
  campana: 'Campaña etiquetada',
  interno: 'Interno',
  desconocido: 'Desconocido',
};
