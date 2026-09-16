import { createClient } from '@supabase/supabase-js';

/**
 * Recepción de la medición propia.
 *
 * El navegador no escribe nunca directamente en las tablas de analítica: manda
 * aquí un lote y esta ruta llama a `registrar_medicion`, que es la única
 * función con permiso para insertar. Así la clave pública que viaja al cliente
 * no sirve para tocar esos datos, y toda la validación vive en un único sitio
 * del lado del servidor.
 */

export const runtime = 'nodejs';
// Nunca se cachea: es una escritura.
export const dynamic = 'force-dynamic';

const MAX_EVENTOS = 100;
// Un lote honrado ronda los pocos kilobytes. Este techo evita que alguien
// intente meter un cuerpo enorme y tumbar la función.
const MAX_BYTES = 64 * 1024;

const TIPOS = new Set([
  'vista',
  'salida',
  'clic',
  'clic_externo',
  'clic_afiliado',
  'busqueda',
  'hito_scroll',
  'interaccion',
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Respuesta mínima: al cliente no le sirve de nada el detalle, y sendBeacon lo ignora. */
const ok = (guardados = 0) =>
  new Response(JSON.stringify({ ok: true, guardados }), {
    status: 202,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function POST(request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return ok();

    const bruto = await request.text();
    if (!bruto || bruto.length > MAX_BYTES) return ok();

    let cuerpo;
    try {
      cuerpo = JSON.parse(bruto);
    } catch {
      return ok();
    }

    const sesion = cuerpo?.sesion;
    if (!sesion?.id || !UUID.test(String(sesion.id))) return ok();

    const eventos = Array.isArray(cuerpo?.eventos)
      ? cuerpo.eventos
          .filter((e) => e && TIPOS.has(e.tipo) && typeof e.path === 'string' && e.path.startsWith('/'))
          .slice(0, MAX_EVENTOS)
      : [];

    if (!eventos.length) return ok();

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc('registrar_medicion', {
      p_sesion: limpiarSesion(sesion),
      p_eventos: eventos.map(limpiarEvento),
    });

    if (error) {
      console.error('Analítica: no se pudo registrar el lote', error.message);
      return ok();
    }

    return ok(data ?? 0);
  } catch (error) {
    // Un fallo aquí no puede propagarse al navegador: la medición es
    // accesoria y no debe generar errores visibles en la consola del visitante.
    console.error('Analítica: error inesperado', error);
    return ok();
  }
}

/** Solo pasan los campos esperados, recortados. Lo demás se descarta. */
function limpiarSesion(s) {
  return {
    id: String(s.id),
    entry_path: texto(s.entry_path, 400),
    referrer: texto(s.referrer, 600),
    referrer_host: texto(s.referrer_host, 160),
    referrer_type: texto(s.referrer_type, 20),
    utm_source: texto(s.utm_source, 120),
    utm_medium: texto(s.utm_medium, 120),
    utm_campaign: texto(s.utm_campaign, 160),
    device: texto(s.device, 20),
    browser: texto(s.browser, 40),
    os: texto(s.os, 40),
    screen_width: entero(s.screen_width, 0, 20000),
    viewport_width: entero(s.viewport_width, 0, 20000),
    language: texto(s.language, 12),
    consent_version: entero(s.consent_version, 0, 100),
    duration_seconds: entero(s.duration_seconds, 0, 86400),
  };
}

function limpiarEvento(e) {
  return {
    tipo: e.tipo,
    path: texto(e.path, 400),
    page_type: texto(e.page_type, 30),
    entity_id: texto(e.entity_id, 80),
    entity_slug: texto(e.entity_slug, 200),
    entity_title: texto(e.entity_title, 300),
    from_path: texto(e.from_path, 400),
    modulo: texto(e.modulo, 60),
    posicion: entero(e.posicion, 0, 100000),
    duration_seconds: entero(e.duration_seconds, 0, 86400),
    scroll_depth: entero(e.scroll_depth, 0, 100),
    search_term: texto(e.search_term, 200),
    results_count: entero(e.results_count, 0, 1000000),
    link_href: texto(e.link_href, 600),
    link_text: texto(e.link_text, 200),
    occurred_at: typeof e.occurred_at === 'string' ? e.occurred_at.slice(0, 40) : undefined,
    meta: e.meta && typeof e.meta === 'object' && !Array.isArray(e.meta) ? e.meta : undefined,
  };
}

function texto(valor, max) {
  if (typeof valor !== 'string') return undefined;
  const limpio = valor.trim();
  return limpio ? limpio.slice(0, max) : undefined;
}

function entero(valor, min, max) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(max, Math.max(min, Math.round(n)));
}
