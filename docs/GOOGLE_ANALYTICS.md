# Google Analytics - Documentación de Implementación

## 📊 Resumen

Google Analytics 4 (GA4) ha sido implementado de forma profesional en la aplicación, con tracking automático de eventos clave y comportamiento de usuarios.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Agrega las siguientes variables de entorno a tu proyecto:

**Archivo `.env.local` (desarrollo local):**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XYYJ6ELDVR
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Netlify (producción):**
- Ve a: Site settings → Environment variables
- Agrega:
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XYYJ6ELDVR`
  - `NEXT_PUBLIC_SITE_URL` = `https://tudominio.com`

### 2. Verificación

El script de Google Analytics **solo se carga en producción** para evitar contaminar los datos con tráfico de desarrollo.

## 📈 Eventos Trackeados Automáticamente

### 1. **Navegación y Páginas**
- ✅ Vista de página automática en cada navegación
- ✅ Tracking de rutas dinámicas

### 2. **Productos**
- ✅ **view_item**: Cuando un usuario visita una página de producto
  - ID del producto
  - Nombre del producto
  - Categoría
  - Precio
- ✅ **affiliate_click**: Cuando hace clic en "Comprar en Amazon"
  - ID del producto
  - Nombre del producto
  - Categoría del producto

### 3. **Blog**
- ✅ **blog_read**: Cuando un usuario lee un artículo (después de 3 segundos)
  - ID del blog
  - Título del blog
  - Categoría del blog

### 4. **Búsqueda**
- ✅ **search**: Cuando un usuario realiza una búsqueda
  - Término de búsqueda
  - Número de resultados

### 5. **Favoritos**
- ✅ **add_to_wishlist**: Cuando agrega un producto a favoritos
- ✅ **remove_from_wishlist**: Cuando quita un producto de favoritos
  - ID del producto

### 6. **Autenticación**
- ✅ **sign_up**: Cuando un usuario crea una cuenta
  - Método (email o google)
- ✅ **login**: Cuando un usuario inicia sesión
  - Método (email o google)

## 🔧 Componentes Implementados

### 1. `GoogleAnalytics.js`
Componente principal que carga el script de GA4.
- Solo se ejecuta en producción
- Usa `next/script` para optimización
- Estrategia: `afterInteractive`

### 2. `analytics.js`
Librería de utilidades con funciones para trackear eventos:

```javascript
import { 
  trackEvent,
  trackPageView,
  trackAffiliateClick,
  trackSearch,
  trackProductView,
  trackBlogRead,
  trackUserSignup,
  trackUserLogin,
  trackFavorite,
  trackError
} from '@/lib/analytics';
```

### 3. `AffiliateLink.js`
Componente para enlaces de afiliados con tracking automático.

### 4. Trackers Mejorados
- `ProductVisitTracker.js`: Trackea vistas de producto
- `BlogReadTracker.js`: Trackea lectura de blogs

## 📊 Métricas Disponibles en GA4

### Eventos Estándar (E-commerce)
- `view_item`: Vistas de productos
- `add_to_wishlist`: Productos guardados
- `search`: Búsquedas realizadas

### Eventos Personalizados
- `affiliate_click`: Clics en enlaces de afiliados
- `blog_read`: Lectura de artículos
- `reading_time`: Tiempo de lectura

### Dimensiones Personalizadas
- `product_id`: ID del producto
- `product_category`: Categoría del producto
- `blog_id`: ID del blog
- `blog_category`: Categoría del blog
- `search_term`: Término de búsqueda
- `method`: Método de autenticación

## 🎯 Informes Recomendados en GA4

### 1. Productos Más Vistos
- Evento: `view_item`
- Dimensión: `item_name` o `product_id`
- Métrica: Conteo de eventos

### 2. Conversión de Afiliados
- Embudo: `view_item` → `affiliate_click`
- Tasa de conversión de visitantes a clics

### 3. Contenido Más Leído
- Evento: `blog_read`
- Dimensión: `blog_id` o `event_label`
- Métrica: Conteo de eventos

### 4. Búsquedas Populares
- Evento: `search`
- Dimensión: `search_term`
- Métrica: Conteo de eventos + `results_count`

### 5. Registro y Login
- Eventos: `sign_up`, `login`
- Dimensión: `method` (email vs google)

## 🔍 Debugging

### Modo Desarrollo
El analytics NO se carga en desarrollo para mantener datos limpios.

### Verificar en Producción
1. Abre las DevTools del navegador
2. Ve a la pestaña Network
3. Filtra por "gtag" o "google-analytics"
4. Deberías ver requests a `google-analytics.com/g/collect`

### Google Analytics DebugView
1. Instala la extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Ve a GA4 → Configure → DebugView
3. Navega por tu sitio
4. Los eventos aparecerán en tiempo real

## 🚨 Consideraciones de Privacidad

- ✅ No se trackean datos personales identificables (PII)
- ✅ Los emails de usuarios NO se envían a GA4
- ✅ Se respeta el modo de producción vs desarrollo
- ✅ Cumple con GDPR (considera agregar banner de cookies si operas en EU)

## 📝 Agregar Nuevos Eventos

Para agregar tracking personalizado:

```javascript
import { trackEvent } from '@/lib/analytics';

// Evento simple
trackEvent('nombre_accion', 'categoria', 'etiqueta', valor);

// Ejemplo práctico
trackEvent('video_play', 'engagement', 'Product Demo Video', 1);
```

## 🔗 Enlaces Útiles

- [Google Analytics 4 Property](https://analytics.google.com/analytics/web/#/p[YOUR_PROPERTY_ID])
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Next.js Analytics Docs](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

## ✅ Checklist de Despliegue

- [ ] Variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` configurada en Netlify
- [ ] Variable `NEXT_PUBLIC_SITE_URL` configurada con tu dominio
- [ ] Código desplegado a producción
- [ ] Verificar que los eventos aparecen en GA4 Realtime
- [ ] Configurar conversiones importantes en GA4
- [ ] (Opcional) Agregar banner de consentimiento de cookies

---

**Implementado por:** GitHub Copilot  
**Fecha:** 28 de Noviembre, 2025  
**ID de Medición:** G-XYYJ6ELDVR
