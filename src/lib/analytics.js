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
 * Trackear clics en enlaces de afiliados
 * @param {string} productId - ID del producto
 * @param {string} productName - Nombre del producto
 * @param {string} category - Categoría del producto
 */
export const trackAffiliateClick = (productId, productName, category) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'affiliate_click', {
    event_category: 'ecommerce',
    event_label: productName,
    product_id: productId,
    product_category: category,
  });
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
export const trackProductView = (product) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'view_item', {
    currency: 'EUR',
    value: product.price || 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price || 0,
      },
    ],
  });
};

/**
 * Trackear lectura de blog
 * @param {string} blogId - ID del blog
 * @param {string} blogTitle - Título del blog
 * @param {string} category - Categoría del blog
 */
export const trackBlogRead = (blogId, blogTitle, category) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'blog_read', {
    event_category: 'engagement',
    event_label: blogTitle,
    blog_id: blogId,
    blog_category: category,
  });
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
