# 🛍️ AffiliPro - Plataforma de Afiliados

Plataforma moderna de afiliados con gestión de productos, blog y panel de administración completo.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Estilos:** CSS Modules + Variables CSS
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
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

Crea un archivo `.env.local` en la raíz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Admin (email del administrador)
NEXT_PUBLIC_ADMIN_EMAIL=tu_email@gmail.com

# Site URL (IMPORTANTE: cambiar antes de deploy)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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

#### 1. **Cambiar URLs placeholder**

Buscar y reemplazar `https://tupagina.com` por tu dominio real en:
- `app/producto/[id]/page.js` (2 lugares)
- `app/blog/[id]/page.js` (2 lugares)
- `app/categoria/[slug]/page.js` (1 lugar)
- `app/robots.js` (1 lugar)
- `app/sitemap.js` (1 lugar)

#### 2. **Actualizar variables de entorno**

En `.env.local` (y luego en Netlify):
```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

#### 3. **Verificar configuración de Supabase**

- ✅ Todas las tablas creadas
- ✅ Storage buckets configurados
- ✅ RLS policies habilitadas
- ✅ Admin configurado correctamente

### Deploy Steps

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Ready for deploy"
   git push origin main
   ```

2. **Conectar con Netlify**
   - Ve a [Netlify](https://app.netlify.com/)
   - New site from Git
   - Selecciona tu repositorio
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Configurar variables de entorno en Netlify**
   - Site settings → Environment variables
   - Añade todas las variables de `.env.local`

4. **Configurar dominio personalizado**
   - Domain management → Add custom domain
   - Sigue las instrucciones para DNS

5. **Habilitar HTTPS**
   - Se activa automáticamente con Let's Encrypt

### Post-Deploy

1. **Verificar SEO**
   - https://search.google.com/test/rich-results
   - Validar Schema.org de productos y blogs

2. **Configurar Google Search Console**
   - Añade tu sitio
   - Envía sitemap: `https://tudominio.com/sitemap.xml`

3. **Probar funcionalidades**
   - ✅ Login/registro
   - ✅ Admin panel
   - ✅ Crear producto
   - ✅ Crear blog
   - ✅ Upload de imágenes

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
