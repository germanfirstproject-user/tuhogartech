'use client';

/**
 * Medición propia del sitio.
 *
 * Existe porque Google Analytics no responde bien a las preguntas que de
 * verdad importan aquí —qué artículo hace que alguien acabe pulsando un
 * enlace a Amazon, hasta dónde se lee cada guía, qué se busca y no se
 * encuentra— y porque sus datos no se pueden cruzar con el catálogo.
 *
 * Reglas que no se rompen:
 *
 *  1. Sin consentimiento de la categoría «estadísticas» no se ejecuta nada.
 *     Ni se crea el identificador de sesión, ni se escuchan eventos, ni se
 *     guarda una sola marca en el navegador. Si el consentimiento se retira,
 *     se borra lo que hubiera y se desmonta todo.
 *  2. El identificador de sesión es aleatorio y vive en sessionStorage: al
 *     cerrar la pestaña desaparece. No hay forma de reconocer a nadie entre
 *     visitas, que es justo lo que se promete en el panel de cookies.
 *  3. Nada de esto puede romper la web. Todo va envuelto en try/catch y los
 *     fallos se tragan en silencio.
 */

import { CONSENT_VERSION, hasStatsConsent } from './cookieConsent';

const CLAVE_SESION = 'tht_med_sid';
const CLAVE_INICIO = 'tht_med_ini';
const CLAVE_ANTERIOR = 'tht_med_prev';
const ENDPOINT = '/api/analitica';

const INTERVALO_ENVIO_MS = 15000;
const MAX_COLA = 30;
const HITOS_SCROLL = [25, 50, 75, 100];

// ---------------------------------------------------------------- estado

let activo = false;
let cola = [];
let temporizador = null;
let sesion = null;
let pagina = null;
let pathAnterior = null;
let desmontar = [];

// ------------------------------------------------------- utilidades

const ahora = () => Date.now();

function uuid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* sigue al plan B */
  }
  // Plan B para navegadores sin randomUUID o en contextos no seguros.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Tipo de página a partir de la ruta. Es lo que agrupa los informes. */
export function tipoDePagina(path = '') {
  if (path === '/') return 'inicio';
  if (path.startsWith('/producto/')) return 'producto';
  if (path.startsWith('/blog/')) return 'blog';
  if (path === '/blog') return 'listado_blog';
  if (path.startsWith('/categoria/')) return 'categoria';
  if (path.startsWith('/productos')) return 'listado_productos';
  if (path.startsWith('/buscar')) return 'buscar';
  if (path.startsWith('/admin')) return 'admin';
  if (['/aviso-legal', '/privacidad', '/terminos'].includes(path)) return 'legal';
  if (path === '/como-analizamos') return 'metodologia';
  return 'otra';
}

const BUSCADORES = ['google.', 'bing.', 'duckduckgo.', 'ecosia.', 'yahoo.', 'qwant.', 'search.brave', 'startpage.'];
const IA = ['chatgpt.com', 'openai.com', 'perplexity.ai', 'claude.ai', 'copilot.microsoft', 'gemini.google'];
const SOCIAL = ['facebook.', 'instagram.', 'twitter.', 'x.com', 't.co', 'linkedin.', 'reddit.', 'pinterest.', 'tiktok.', 'youtube.', 'whatsapp.', 'telegram.'];

function clasificarOrigen(host, hayCampana) {
  if (hayCampana) return 'campana';
  if (!host) return 'directo';
  if (typeof window !== 'undefined' && host === window.location.hostname) return 'interno';
  const h = host.toLowerCase();
  if (BUSCADORES.some((x) => h.includes(x))) return 'buscador';
  if (IA.some((x) => h.includes(x))) return 'ia';
  if (SOCIAL.some((x) => h.includes(x))) return 'social';
  return 'referencia';
}

/**
 * Familia de dispositivo y navegador a partir del user agent.
 *
 * Deliberadamente grueso: tres categorías de dispositivo y el nombre del
 * navegador, sin versión. Afinar más sería construir una huella, que es
 * exactamente lo que el panel de cookies promete que no hacemos.
 */
function describirNavegador() {
  const ua = navigator.userAgent || '';
  const esTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const esMovil = !esTablet && /Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua);

  let navegador = 'Otro';
  if (/Edg\//.test(ua)) navegador = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) navegador = 'Opera';
  else if (/SamsungBrowser/.test(ua)) navegador = 'Samsung Internet';
  else if (/Firefox\//.test(ua)) navegador = 'Firefox';
  else if (/Chrome\//.test(ua)) navegador = 'Chrome';
  else if (/Safari\//.test(ua)) navegador = 'Safari';

  let so = 'Otro';
  if (/Windows/.test(ua)) so = 'Windows';
  else if (/Android/.test(ua)) so = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) so = 'iOS';
  else if (/Mac OS X/.test(ua)) so = 'macOS';
  else if (/Linux/.test(ua)) so = 'Linux';

  return {
    device: esTablet ? 'tablet' : esMovil ? 'movil' : 'escritorio',
    browser: navegador,
    os: so,
  };
}

// ------------------------------------------------------- sesión

function abrirSesion() {
  if (sesion) return sesion;

  let id = null;
  let inicio = null;

  try {
    id = sessionStorage.getItem(CLAVE_SESION);
    inicio = Number(sessionStorage.getItem(CLAVE_INICIO)) || null;
  } catch {
    /* modo privado: la sesión vivirá solo en memoria */
  }

  const nueva = !id;
  if (nueva) {
    id = uuid();
    inicio = ahora();
    try {
      sessionStorage.setItem(CLAVE_SESION, id);
      sessionStorage.setItem(CLAVE_INICIO, String(inicio));
    } catch {
      /* igual que arriba */
    }
  }

  const params = new URLSearchParams(window.location.search);
  const utm = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };

  let host = '';
  try {
    host = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    host = '';
  }
  // Una navegación interna no es una fuente de tráfico: el referente propio se
  // descarta para que no aparezca el dominio de uno mismo entre los orígenes.
  if (host === window.location.hostname) host = '';

  sesion = {
    id,
    inicio: inicio || ahora(),
    alta: {
      id,
      entry_path: window.location.pathname,
      referrer: host ? document.referrer.slice(0, 600) : undefined,
      referrer_host: host || undefined,
      referrer_type: clasificarOrigen(host, Boolean(utm.utm_source || utm.utm_campaign)),
      ...utm,
      ...describirNavegador(),
      screen_width: window.screen?.width,
      viewport_width: window.innerWidth,
      language: (navigator.language || '').slice(0, 12),
      consent_version: CONSENT_VERSION,
    },
  };

  return sesion;
}

function borrarSesion() {
  sesion = null;
  try {
    sessionStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_INICIO);
    sessionStorage.removeItem(CLAVE_ANTERIOR);
  } catch {
    /* nada que hacer */
  }
}

/**
 * La página anterior se guarda en sessionStorage, no solo en memoria.
 *
 * Casi toda la navegación del sitio es de cliente y el módulo sobrevive, pero
 * una recarga, una vuelta atrás o un enlace abierto de forma que fuerce carga
 * completa reinician el módulo. Sin esto, el recorrido se partía justo ahí.
 */
function recordarPath(path) {
  pathAnterior = path;
  try {
    sessionStorage.setItem(CLAVE_ANTERIOR, path);
  } catch {
    /* se queda solo en memoria */
  }
}

function recuperarPathAnterior() {
  if (pathAnterior) return pathAnterior;
  try {
    pathAnterior = sessionStorage.getItem(CLAVE_ANTERIOR) || null;
  } catch {
    pathAnterior = null;
  }
  return pathAnterior;
}

// ------------------------------------------------------- envío

function enviar({ conBeacon = false } = {}) {
  if (!cola.length || !sesion) return;

  const lote = cola.splice(0, cola.length);
  const cuerpo = JSON.stringify({
    sesion: {
      ...sesion.alta,
      duration_seconds: Math.round((ahora() - sesion.inicio) / 1000),
    },
    eventos: lote,
  });

  try {
    // Al cerrar la pestaña, fetch se cancela y sendBeacon no: es la única
    // forma de que la duración de la última página no se pierda siempre.
    if (conBeacon && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([cuerpo], { type: 'application/json' }));
      if (ok) return;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* si no se puede enviar, se pierde el lote y ya está */
  }
}

function encolar(evento) {
  if (!activo) return;
  abrirSesion();

  cola.push({ ...evento, occurred_at: new Date().toISOString() });

  if (cola.length >= MAX_COLA) enviar();
}

// ------------------------------------------------------- páginas

function contextoDeSalida() {
  if (!pagina) return null;
  return {
    tipo: 'salida',
    path: pagina.path,
    page_type: pagina.page_type,
    entity_id: pagina.entity_id,
    entity_slug: pagina.entity_slug,
    entity_title: pagina.entity_title,
    duration_seconds: Math.round((ahora() - pagina.entrada) / 1000),
    scroll_depth: pagina.scrollMax,
  };
}

/** Cierra la página actual mandando su duración y hasta dónde se bajó. */
export function cerrarPagina() {
  const salida = contextoDeSalida();
  if (!salida) return;
  // Menos de un segundo es un rebote de renderizado, no una visita.
  if (salida.duration_seconds >= 1) encolar(salida);
  pagina = null;
}

/**
 * Abre una página nueva. La llama el proveedor en cada cambio de ruta.
 * `from_path` es la página anterior dentro del propio sitio, que es lo que
 * permite reconstruir el recorrido.
 */
export function abrirPagina(path) {
  if (!activo) return;

  cerrarPagina();

  const abierta = {
    path,
    page_type: tipoDePagina(path),
    entrada: ahora(),
    scrollMax: 0,
    hitos: new Set(),
    vistaEnviada: false,
    listoParaScroll: false,
  };
  pagina = abierta;

  // Se deja un margen para que el navegador asiente la posición de scroll de
  // la página nueva antes de empezar a medirla. Se comprueba la identidad del
  // objeto para no reactivar una página que ya se ha cerrado mientras tanto.
  setTimeout(() => {
    if (pagina === abierta) abierta.listoParaScroll = true;
  }, 350);
}

/**
 * Añade a la página abierta los datos que solo conoce la propia página
 * (qué producto, qué artículo). La llaman los medidores de cada plantilla
 * antes de que el proveedor mande la vista.
 */
export function describirPagina({ path, entity_id, entity_slug, entity_title, page_type } = {}) {
  if (!activo || !pagina) return;
  if (path && path !== pagina.path) return;

  if (entity_id) pagina.entity_id = String(entity_id);
  if (entity_slug) pagina.entity_slug = entity_slug;
  if (entity_title) pagina.entity_title = entity_title;
  if (page_type) pagina.page_type = page_type;
}

/** Manda la vista de la página abierta. Se llama con un respiro tras navegar. */
export function confirmarVista() {
  if (!activo || !pagina || pagina.vistaEnviada) return;
  pagina.vistaEnviada = true;

  const esPrimera = !sesion?.primeraEnviada;

  encolar({
    tipo: 'vista',
    path: pagina.path,
    page_type: pagina.page_type,
    entity_id: pagina.entity_id,
    entity_slug: pagina.entity_slug,
    entity_title: pagina.entity_title,
    from_path: recuperarPathAnterior() || undefined,
  });

  recordarPath(pagina.path);

  // La primera vista se manda enseguida en lugar de esperar al envío
  // periódico: si alguien entra y cierra a los cinco segundos, esa visita
  // existió y debe contarse aunque el beacon de salida no llegue.
  if (esPrimera && sesion) {
    sesion.primeraEnviada = true;
    enviar();
  }
}

// ------------------------------------------------------- eventos sueltos

export function registrarBusqueda(termino, resultados) {
  if (!activo || !termino) return;
  encolar({
    tipo: 'busqueda',
    path: pagina?.path || window.location.pathname,
    page_type: pagina?.page_type,
    search_term: String(termino).slice(0, 200),
    results_count: Number.isFinite(resultados) ? resultados : undefined,
  });
}

export function registrarInteraccion({ modulo, link_text, entity_id, entity_title, posicion, meta } = {}) {
  if (!activo) return;
  encolar({
    tipo: 'interaccion',
    path: pagina?.path || window.location.pathname,
    page_type: pagina?.page_type,
    modulo,
    link_text,
    entity_id: entity_id ? String(entity_id) : undefined,
    entity_title,
    posicion,
    meta,
  });
}

// ------------------------------------------------------- escuchas del DOM

function medirScroll() {
  if (!pagina) return;

  // Justo después de una navegación de cliente hay un instante en el que el
  // documento ya es el nuevo pero el navegador aún no ha devuelto el scroll
  // arriba. Medir ahí atribuía a la página recién abierta el recorrido de la
  // anterior, y una página corta se marcaba como leída al 100 % sin que nadie
  // la hubiera tocado.
  if (!pagina.listoParaScroll) return;

  const alto = document.documentElement.scrollHeight - window.innerHeight;

  // Una página que cabe entera en la pantalla se ha visto entera, y así se
  // registra en el evento de salida. Pero no emite hitos: no hay recorrido
  // que medir, y marcar 25, 50, 75 y 100 de golpe llenaba la tabla de eventos
  // que no dicen nada y falseaba el reparto de abandono de las páginas largas.
  if (alto <= 0) {
    pagina.scrollMax = 100;
    return;
  }

  const desplazado = window.scrollY || 0;

  // Segunda red de seguridad: no se puede haber bajado más de lo que mide la
  // página. Si sale que sí, la lectura es de un estado intermedio y no vale.
  if (desplazado > alto + 50) return;

  const pct = Math.round((desplazado / alto) * 100);
  const acotado = Math.min(100, Math.max(0, pct));

  if (acotado > pagina.scrollMax) pagina.scrollMax = acotado;

  for (const hito of HITOS_SCROLL) {
    if (pagina.scrollMax >= hito && !pagina.hitos.has(hito)) {
      pagina.hitos.add(hito);
      encolar({
        tipo: 'hito_scroll',
        path: pagina.path,
        page_type: pagina.page_type,
        entity_id: pagina.entity_id,
        scroll_depth: hito,
      });
    }
  }
}

/**
 * Un único escuchador de clics para toda la web, en fase de captura.
 *
 * Se hace así y no componente a componente por dos razones: no hay que tocar
 * cada enlace del sitio, y es imposible que un botón nuevo se quede sin medir
 * por olvido. Los componentes que saben más de lo que hay detrás del enlace
 * (el módulo, el producto, la posición en la lista) lo dejan escrito en
 * atributos `data-med-*` y aquí se recogen.
 */
function alPulsar(evento) {
  if (!pagina) return;
  // Botón derecho no navega; el central sí, y llega como `auxclick`.
  if (evento.type === 'auxclick' && evento.button !== 1) return;

  const enlace = evento.target?.closest?.('a[href], [data-med-modulo]');
  if (!enlace) return;

  const href = enlace.getAttribute?.('href') || '';
  const datos = enlace.dataset || {};

  let tipo = 'clic';
  let destino = href;

  if (/^https?:/i.test(href)) {
    try {
      const url = new URL(href);
      if (url.hostname !== window.location.hostname) {
        // Un enlace a Amazon con nuestra etiqueta es el evento que justifica
        // todo lo demás: se distingue del resto de salidas externas.
        const esAfiliado = /(^|\.)amazon\./i.test(url.hostname) || url.searchParams.has('tag');
        tipo = esAfiliado ? 'clic_afiliado' : 'clic_externo';
        destino = esAfiliado ? `${url.origin}${url.pathname}` : href;
      } else {
        destino = url.pathname;
      }
    } catch {
      /* href raro: se queda como clic interno */
    }
  } else if (!href) {
    tipo = 'interaccion';
    destino = '';
  }

  encolar({
    tipo,
    path: pagina.path,
    page_type: pagina.page_type,
    entity_id: datos.medId || pagina.entity_id,
    entity_title: datos.medTitulo || undefined,
    modulo: datos.medModulo || undefined,
    posicion: datos.medPosicion ? Number(datos.medPosicion) : undefined,
    link_href: destino ? destino.slice(0, 600) : undefined,
    link_text: (enlace.getAttribute('aria-label') || enlace.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 200) || undefined,
  });

  // Un clic que se va del sitio no da tiempo a esperar al envío periódico.
  if (tipo === 'clic_afiliado' || tipo === 'clic_externo') enviar({ conBeacon: true });
}

/** Cambio de pestaña o minimizado: solo cuenta cuando pasa a oculta. */
function alOcultarse() {
  if (document.visibilityState !== 'hidden') return;
  vaciarTodo();
}

/**
 * La página se va (cierre, recarga, navegación fuera del sitio).
 *
 * Aquí no se mira visibilityState: durante la descarga sigue valiendo
 * «visible» en varios navegadores, y comprobarlo hacía que el último envío
 * —el que lleva la duración de la página que se está abandonando— no llegara
 * nunca.
 */
function alIrse() {
  vaciarTodo();
}

function vaciarTodo() {
  cerrarPagina();
  enviar({ conBeacon: true });
}

// ------------------------------------------------------- arranque y parada

/** Pone en marcha la medición. Idempotente. */
export function arrancar() {
  if (activo || typeof window === 'undefined') return;
  if (!hasStatsConsent()) return;

  activo = true;
  abrirSesion();
  recuperarPathAnterior();

  const escuchar = (objetivo, tipo, fn, opciones) => {
    objetivo.addEventListener(tipo, fn, opciones);
    desmontar.push(() => objetivo.removeEventListener(tipo, fn, opciones));
  };

  escuchar(window, 'scroll', medirScroll, { passive: true });
  escuchar(window, 'resize', medirScroll, { passive: true });
  escuchar(document, 'click', alPulsar, true);
  escuchar(document, 'auxclick', alPulsar, true);
  escuchar(document, 'visibilitychange', alOcultarse);
  escuchar(window, 'pagehide', alIrse);

  temporizador = setInterval(() => enviar(), INTERVALO_ENVIO_MS);
}

/** Detiene la medición y borra el rastro. Se usa al retirar el consentimiento. */
export function parar({ olvidar = true } = {}) {
  if (!activo) return;
  activo = false;

  desmontar.forEach((quitar) => {
    try {
      quitar();
    } catch {
      /* da igual */
    }
  });
  desmontar = [];

  if (temporizador) clearInterval(temporizador);
  temporizador = null;

  cola = [];
  pagina = null;
  pathAnterior = null;

  if (olvidar) borrarSesion();
}

export function estaActiva() {
  return activo;
}
