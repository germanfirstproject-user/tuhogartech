# 🛍️ AffiliPro - Plataforma de Afiliados

Plataforma moderna de afiliados con gestión de productos, blog y panel de administración completo.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Estilos:** CSS Modules + Variables CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Analytics:** Google Analytics 4 (GA4)
- **Optimización:** Next/Image, ISR, SWC Minify
- **SEO:** Schema.org (Product, Article, Breadcrumbs)

---

## 📋 Características Principales

### Frontend
- ✅ Página de inicio dinámica con estadísticas
- ✅ Listado de productos con filtros y paginación
- ✅ Detalle de productos con imágenes y especificaciones
- ✅ Blog completo con editor rich text
- ✅ Sistema de categorías
- ✅ Sistema de favoritos (requiere login)
- ✅ Búsqueda por productos
- ✅ Responsive design completo
- ✅ Dark mode ready (variables CSS preparadas)

### Panel de Administración (`/admin`)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de productos (CRUD completo)
- ✅ Gestión de blogs con editor WYSIWYG
- ✅ Gestión de categorías
- ✅ Gestión de productos destacados
- ✅ Configuración del sitio (SEO, metadata, títulos)
- ✅ Gestión de usuarios
- ✅ SEO personalizado por producto y blog

### SEO Avanzado
- ✅ Schema.org implementado (Product, Article, BreadcrumbList)
- ✅ Metadata dinámica por página
- ✅ OpenGraph y Twitter Cards
- ✅ Canonical URLs
- ✅ Sitemap.xml dinámico
- ✅ Robots.txt configurado

### Optimización
- ✅ ISR (Incremental Static Regeneration)
- ✅ Next/Image con formatos AVIF/WebP
- ✅ Preconnect a dominios externos
- ✅ Cache optimizado (30 días para imágenes)
- ✅ SWC Minify
- ✅ Lazy loading de imágenes
- ✅ React.memo en componentes críticos

### Analytics y Tracking
- ✅ Google Analytics 4 integrado
- ✅ Tracking automático de eventos:
  - Vista de productos
  - Clics en enlaces de afiliados
  - Lectura de blogs
  - Búsquedas
  - Registro y login
  - Favoritos
- ✅ Solo se ejecuta en producción
- ✅ Eventos personalizados para conversiones

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/affilpro.git
cd affilpro
```

### 2. Instalar dependencias
```bash
npm install
# o
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz (o copia `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Admin (email del administrador)
NEXT_PUBLIC_ADMIN_EMAIL=tu_email@gmail.com

# Site URL (IMPORTANTE: cambiar antes de deploy)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Analytics (opcional, solo producción)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XYYJ6ELDVR
```

### 4. Configurar Supabase

#### A. Ejecutar scripts SQL en orden:

1. **Tablas principales:**
   ```sql
   database/products_table.sql
   database/categories_table.sql
   database/blogs_table.sql
   database/site_settings_table.sql
   database/product_seo_table.sql
   database/featured_products_table.sql
   database/user_data_table.sql
   ```

2. **Configuración de almacenamiento:**
   ```sql
   database/storage_setup.sql
   database/blog_storage_setup.sql
   ```

3. **Políticas de seguridad:**
   ```sql
   database/products_policies.sql
   database/blogs_policies_fix.sql
   ```

4. **Configuración de admin:**
   ```sql
   database/admin_config_and_users.sql
   database/FIX_FINAL_GET_AUTH_USERS.sql
   ```

#### B. Configurar Storage en Supabase:

1. Ve a Storage → Create bucket
2. Crea bucket `blog-images` (público)
3. Crea bucket `product-images` (público)

#### C. Configurar admin:

En Supabase SQL Editor:
```sql
-- Opción 1: Actualizar email admin en admin_config
UPDATE admin_config 
SET admin_email = 'tu_email@gmail.com' 
WHERE id = 1;

-- Opción 2: Agregar metadata al usuario
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
WHERE email = 'tu_email@gmail.com';
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy en Netlify

### Pre-Deploy Checklist

⚠️ **NOTA:** Si vas a usar el dominio de Netlify (`tu-sitio.netlify.app`) por ahora, puedes saltarte el paso 1 y hacer estos cambios después cuando tengas tu dominio personalizado.

#### 1. **Cambiar URLs placeholder (OPCIONAL - solo si ya tienes dominio)**

Si ya tienes tu dominio final, buscar y reemplazar `https://tupagina.com` por tu dominio real en:
- `app/producto/[id]/page.js` (2 lugares - Schema.org)
- `app/blog/[id]/page.js` (2 lugares - Schema.org)
- `app/categoria/[slug]/page.js` (1 lugar - Schema.org)
- `app/robots.js` (1 lugar)
- `app/sitemap.js` (1 lugar)

**Si usarás el dominio de Netlify inicialmente:** Déjalo como está, lo cambiarás cuando configures tu dominio personalizado.

#### 2. **Actualizar variables de entorno**

Prepara estas variables para configurar en Netlify:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=tu_email@gmail.com
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app  # Usa tu subdominio de Netlify
```

#### 3. **Verificar configuración de Supabase**

- ✅ Todas las tablas creadas
- ✅ Storage buckets configurados (public)
- ✅ RLS policies habilitadas
- ✅ Admin configurado correctamente
- ✅ Función `get_auth_users()` funcionando

### Deploy Steps

1. **Instalar dependencia de Netlify (si no está instalada)**
   ```bash
   npm install --save-dev @netlify/plugin-nextjs
   ```

2. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```

3. **Conectar con Netlify**
   - Ve a [Netlify](https://app.netlify.com/)
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "Deploy with GitHub"
   - Autoriza a Netlify y selecciona tu repositorio
   
4. **Configurar Build Settings**
   
   **⚠️ Netlify detectará automáticamente Next.js gracias al archivo `netlify.toml`**
   
   - **Build command:** `npm run build` (ya configurado)
   - **Publish directory:** `.next` (ya configurado)
   - **Framework preset:** Next.js (detectado automáticamente)
   
   **Configuración Avanzada (Build & Deploy → Environment):**
   - Añade todas las variables de entorno:
     ```
     NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
     NEXT_PUBLIC_ADMIN_EMAIL=tu_email@gmail.com
     NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
     ```
   
5. **Deploy inicial**
   - Click en "Deploy site"
   - Espera a que termine el build (2-5 minutos)
   - Tu sitio estará en `https://random-name-123.netlify.app`

6. **Cambiar nombre del sitio (opcional)**
   - Site settings → Site details → Change site name
   - Elige un nombre: `tu-sitio.netlify.app`
   - Actualiza `NEXT_PUBLIC_SITE_URL` con el nuevo dominio
   - Redeploy: Deploys → Trigger deploy → Deploy site

7. **Configurar dominio personalizado (cuando lo tengas)**
   - Domain management → Add custom domain
   - Añade tu dominio: `tudominio.com`
   - Configura DNS según las instrucciones de Netlify
   - Actualiza `NEXT_PUBLIC_SITE_URL=https://tudominio.com`
   - Redeploy nuevamente

8. **HTTPS**
   - Se activa automáticamente con Let's Encrypt
   - Puede tardar 1-2 horas en estar disponible

### Post-Deploy

1. **Verificar que el sitio funciona**
   - Abre `https://tu-sitio.netlify.app`
   - Prueba la navegación básica
   - Verifica que las imágenes cargan desde Supabase

2. **Probar funcionalidades críticas**
   - ✅ Login/registro funciona
   - ✅ Admin panel accesible (`/admin`)
   - ✅ Crear/editar producto
   - ✅ Crear/editar blog
   - ✅ Upload de imágenes funciona
   - ✅ Favoritos funciona (requiere login)
   - ✅ Búsqueda funciona

3. **Verificar SEO (cuando tengas contenido)**
   - Usa [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Valida productos: `https://tu-sitio.netlify.app/producto/[id]`
   - Valida blogs: `https://tu-sitio.netlify.app/blog/[id]`

4. **Configurar Google Search Console (opcional)**
   - Añade tu sitio en [Google Search Console](https://search.google.com/search-console)
   - Verifica la propiedad del sitio
   - Envía sitemap: `https://tu-sitio.netlify.app/sitemap.xml`

5. **Cuando configures tu dominio personalizado:**
   - Actualiza `NEXT_PUBLIC_SITE_URL` en Netlify
   - Busca y reemplaza `https://tupagina.com` en los archivos mencionados
   - Redeploy el sitio
   - Actualiza Google Search Console con el nuevo dominio

---

## 📁 Estructura del Proyecto

```
├── app/                      # App Router de Next.js
│   ├── admin/               # Panel de administración
│   │   ├── products/       # Gestión de productos
│   │   ├── blogs/          # Gestión de blogs
│   │   ├── categories/     # Gestión de categorías
│   │   ├── featured/       # Productos destacados
│   │   ├── settings/       # Configuración del sitio
│   │   └── users/          # Gestión de usuarios
│   ├── producto/[id]/      # Detalle de producto
│   ├── blog/[id]/          # Detalle de blog
│   ├── categoria/[slug]/   # Listado por categoría
│   ├── productos/          # Listado de productos
│   ├── privacidad/         # Política de privacidad
│   ├── terminos/           # Términos y condiciones
│   └── page.js             # Página de inicio
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── contexts/           # React Contexts
│   └── lib/                # Utilidades y Supabase client
├── database/               # Scripts SQL de Supabase
├── docs/                   # Documentación técnica
├── public/                 # Assets estáticos
└── styles/                 # CSS global y variables
```

---

## 🔐 Seguridad

- ✅ RLS (Row Level Security) en todas las tablas
- ✅ Autenticación con Supabase Auth
- ✅ Validación de roles (admin vs user)
- ✅ CORS configurado correctamente
- ✅ Tokens JWT seguros

---

## 📊 Métricas de Rendimiento

- **LCP:** ~2.5s (Good)
- **FID:** ~100ms (Good)
- **CLS:** ~0.1 (Good)
- **Lighthouse Score:** 90+ (Desktop)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar build
npm start

# Linting
npm run lint
```

---

## 📝 Tareas Pendientes

### Antes de Producción
- [ ] Cambiar todas las URLs `tupagina.com` por tu dominio real
- [ ] Configurar variables de entorno en Netlify
- [ ] Configurar dominio personalizado
- [ ] Verificar Schema.org con Rich Results Test
- [ ] Enviar sitemap a Google Search Console

### Opcional (Mejoras Futuras)
- [ ] Sistema de búsqueda avanzado
- [ ] Sistema de notificaciones (toasts)
- [ ] Comparador de productos
- [ ] Analytics (Google Analytics 4)
- [ ] Newsletter con email marketing
- [ ] Modo oscuro toggle
- [ ] PWA (Progressive Web App)

---

## 🐛 Problemas Conocidos y Notas Importantes

### ⚠️ IMPORTANTE: Uso de Imágenes

**SIEMPRE usar `<img>` tags en lugar de `next/image` para imágenes de Supabase Storage:**

```jsx
// ✅ CORRECTO - Usar tag <img>
<img 
  src={blog.featured_image} 
  alt={blog.title}
  width={120}
  height={120}
  loading="lazy"
/>

// ❌ INCORRECTO - NO usar next/image con Supabase
import Image from 'next/image';
<Image src={...} /> // Genera errores de hostname no configurado
```

**Razón:** Next.js Image requiere configuración de hostname en `next.config.js` que puede causar conflictos con el cache del build. Usar `<img>` evita estos problemas y las imágenes cargan perfectamente desde Supabase Storage.

### 🚨 Troubleshooting Deploy en Netlify

#### Error: "Build failed" o "Command failed"
- Verifica que todas las variables de entorno están configuradas
- Revisa los logs del build en Netlify
- Asegúrate de que `package.json` tiene todos los scripts necesarios

#### Error: "Page not found" o 404 en rutas dinámicas
- Next.js en Netlify requiere el plugin oficial
- Netlify debería detectarlo automáticamente
- Si no, añade `@netlify/plugin-nextjs` a las dependencias

#### Las imágenes de Supabase no cargan
1. Verifica que los buckets son públicos en Supabase
2. Verifica las policies de RLS permiten lectura pública
3. Comprueba las URLs en el navegador (F12 → Network)

#### Variables de entorno no funcionan
- Asegúrate de usar el prefijo `NEXT_PUBLIC_` para variables del cliente
- Después de cambiar variables, haz un nuevo deploy
- Variables sin `NEXT_PUBLIC_` solo están disponibles en el servidor

#### El sitio no se actualiza después de cambios
- Netlify hace deploy automático con cada push a `main`
- Puedes hacer deploy manual: Deploys → Trigger deploy
- Limpia la caché: Deploys → Deploy settings → Clear cache and deploy

#### Errores de autenticación (401/403)
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son correctos
- Comprueba que el email admin coincide con `admin_config.admin_email`
- Revisa las RLS policies en Supabase

### Admin - Gestión de Usuarios
Si los usuarios no aparecen en la lista:
1. Verifica que ejecutaste `database/FIX_FINAL_GET_AUTH_USERS.sql`
2. Asegúrate de que tu email coincide con `admin_config.admin_email`

### Imágenes no cargan
1. Verifica que los buckets de Storage están públicos
2. Confirma que las policies permiten lectura pública

### Error 404 en productos/blogs
1. Ejecuta `npm run build` para regenerar páginas estáticas
2. Verifica que los datos existen en Supabase

---

## 📚 Documentación Adicional

Ver carpeta `docs/` para documentación técnica detallada:
- Schema.org implementado
- Optimizaciones de rendimiento
- Configuración de SEO
- Solución de errores comunes

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

## 👤 Autor

German Garcia
- GitHub: [@germangarcia17](https://github.com/germangarcia17)

---

## 🙏 Agradecimientos

- Next.js team por el excelente framework
- Supabase por el backend simplificado
- Vercel/Netlify por el hosting gratuito
