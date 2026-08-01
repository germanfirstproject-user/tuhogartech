'use client';

/**
 * Utilidades para Google Analytics
 * Permite trackear eventos personalizados y conversiones
 */

// Verificar si gtag está disponible
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Trackear eventos personalizados
 * @param {string} action - Acción del evento (ej: 'click', 'view', 'purchase')
 * @param {string} category - Categoría del evento (ej: 'product', 'blog', 'user')
 * @param {string} label - Etiqueta descriptiva
 * @param {number} value - Valor numérico opcional
 */
export const trackEvent = (action, category, label, value) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Trackear visualización de página
 * @param {string} url - URL de la página
 * @param {string} title - Título de la página
 */
export const trackPageView = (url, title) => {
  if (!isGtagAvailable()) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
};

/**
 * GA4 corta los valores de parámetro a 100 caracteres. Los títulos de producto
 * llegan a 140, así que se recortan aquí y no en mitad de una palabra.
 */
const recortar = (texto, max = 100) => {
  if (!texto) return undefined;
  const limpio = String(texto).trim();
  if (limpio.length <= max) return limpio;
  const cortado = limpio.slice(0, max - 1);
  const ultimoEspacio = cortado.lastIndexOf(' ');
  return `${ultimoEspacio > max * 0.6 ? cortado.slice(0, ultimoEspacio) : cortado}…`;
};

/** Quita las claves sin valor para no mandar parámetros vacíos a GA4. */
const limpiarParametros = (objeto) =>
  Object.fromEntries(
    Object.entries(objeto).filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
  );

/**
 * Trackear clics en enlaces de afiliados. Es el evento principal del sitio.
 *
 * @param {Object} datos
 * @param {string} datos.productId    - ID del producto
 * @param {string} datos.productName  - Nombre del producto
 * @param {string} datos.category     - Categoría del producto
 * @param {string} datos.brand        - Marca
 * @param {string} datos.linkPosition - Desde qué botón se ha pulsado
 * @param {string} datos.blogId       - Artículo desde el que se pulsa, si aplica
 * @param {string} datos.blogSlug     - Slug del artículo
 * @param {number} datos.cardIndex    - Orden de la tarjeta dentro del artículo
 */
export const trackAffiliateClick = ({
  productId,
  productName,
  category,
  brand,
  linkPosition,
  blogId,
  blogSlug,
  cardIndex,
} = {}) => {
  if (!isGtagAvailable()) return;

  window.gtag(
    'event',
    'affiliate_click',
    limpiarParametros({
      product_id: productId,
      product_name: recortar(productName),
      product_category: category,
      product_brand: brand,
      // Distingue los cuatro botones que llevan a Amazon. Sin esto no se puede
      // saber si las tarjetas del blog funcionan mejor que la ficha.
      link_position: linkPosition,
      blog_id: blogId,
      blog_slug: blogSlug,
      card_index: cardIndex,
    })
  );
};

/**
 * Impresión de una tarjeta de producto dentro de un artículo.
 *
 * Es la mitad que falta para calcular el porcentaje de clics real: sin saber
 * cuánta gente ve la tarjeta, un número bajo de clics no distingue entre
 * "no convence" y "nadie llega hasta ahí".
 */
export const trackBlogCardView = ({
  productId,
  productName,
  category,
  brand,
  linkPosition,
  blogId,
  blogSlug,
  cardIndex,
} = {}) => {
  // Devuelve si se ha llegado a enviar: quien observa la tarjeta necesita
  // saberlo para no dar la impresión por registrada si aún no hay consentimiento.
  if (!isGtagAvailable()) return false;

  window.gtag(
    'event',
    'blog_product_card_view',
    limpiarParametros({
      product_id: productId,
      product_name: recortar(productName),
      product_category: category,
      product_brand: brand,
      link_position: linkPosition,
      blog_id: blogId,
      blog_slug: blogSlug,
      card_index: cardIndex,
    })
  );

  return true;
};

/**
 * Clic en un enlace interno desde un módulo concreto (carruseles de la home,
 * tarjetas de la portada, índice de categorías…).
 *
 * Se envía como `select_item`, que es el evento recomendado de GA4 para
 * "ha elegido un elemento de una lista", así que encaja con sus informes.
 */
export const trackModuleClick = ({ modulo, destino, itemId, itemName, posicion } = {}) => {
  if (!isGtagAvailable()) return;

  window.gtag(
    'event',
    'select_item',
    limpiarParametros({
      item_list_id: modulo,
      item_list_name: modulo,
      destino_tipo: destino,
      items: itemId
        ? [
            limpiarParametros({
              item_id: itemId,
              item_name: recortar(itemName),
              index: posicion,
            }),
          ]
        : undefined,
    })
  );
};

/**
 * Trackear búsquedas
 * @param {string} searchTerm - Término de búsqueda
 * @param {number} resultsCount - Número de resultados
 */
export const trackSearch = (searchTerm, resultsCount) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Trackear visualización de productos
 * @param {Object} product - Datos del producto
 */
export const trackProductView = (product, origen = null) => {
  if (!isGtagAvailable()) return;

  // Sin `value` ni `currency`: el catálogo no guarda precios y mandar 0 €
  // ensuciaría los informes de ingresos con ceros para siempre.
  window.gtag(
    'event',
    'view_item',
    limpiarParametros({
      items: [
        limpiarParametros({
          item_id: product.id,
          item_name: recortar(product.name),
          item_category: product.category,
          item_brand: product.brand,
        }),
      ],
      origen_modulo: origen?.modulo,
      origen_pagina: origen?.pagina,
    })
  );
};

/**
 * Trackear lectura de blog
 * @param {string} blogId - ID del blog
 * @param {string} blogTitle - Título del blog
 * @param {string} category - Categoría del blog
 */
export const trackBlogRead = ({ blogId, blogSlug, blogTitle, category, origen } = {}) => {
  if (!isGtagAvailable()) return;

  window.gtag(
    'event',
    'blog_read',
    limpiarParametros({
      blog_id: blogId,
      blog_slug: blogSlug,
      blog_title: recortar(blogTitle),
      blog_category: category,
      origen_modulo: origen?.modulo,
      origen_pagina: origen?.pagina,
    })
  );
};

/**
 * Trackear registro de usuario
 * @param {string} method - Método de registro (email, google)
 */
export const trackUserSignup = (method) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'sign_up', {
    method: method,
  });
};

/**
 * Trackear inicio de sesión
 * @param {string} method - Método de login (email, google)
 */
export const trackUserLogin = (method) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'login', {
    method: method,
  });
};

/**
 * Trackear interacción con favoritos
 * @param {string} action - 'add' o 'remove'
 * @param {string} productId - ID del producto
 */
export const trackFavorite = (action, productId) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
    event_category: 'engagement',
    product_id: productId,
  });
};

/**
 * Trackear tiempo de lectura de blog
 * @param {string} blogId - ID del blog
 * @param {number} timeSpent - Tiempo en segundos
 */
export const trackReadingTime = (blogId, timeSpent) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'reading_time', {
    event_category: 'engagement',
    blog_id: blogId,
    time_spent: timeSpent,
  });
};

/**
 * Trackear errores
 * @param {string} errorMessage - Mensaje de error
 * @param {string} location - Ubicación del error
 */
export const trackError = (errorMessage, location) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'exception', {
    description: errorMessage,
    fatal: false,
    location: location,
  });
};
