# AffiliPro - Plataforma de Afiliados Amazon

Plataforma Next.js 14+ ultra-optimizada con Supabase Auth, CSS Modules y JavaScript puro.

## ✨ Cambios Recientes (Nov 2025)

✅ **Autenticación Completa con Supabase Auth**
- Sistema de registro e inicio de sesión
- Admin panel protegido (solo para admins)
- Rol de admin en `user.user_metadata.is_admin`
- Sin tabla de perfiles (Auth solo)

✅ **Limpieza Completa del Proyecto**
- Removidos: TypeScript, Vite, Tailwind, shadcn/ui components, AuthContext
- Mantenido: Next.js 14.2 + JavaScript + CSS Modules puro
- Reducido: Dependencias innecesarias (8 paquetes menos)
- Resultado: Proyecto limpio, mantenible y enfocado

✅ **Stack Final**
- Next.js 14.2 + App Router + JavaScript
- CSS Modules para estilos locales (sin conflictos)
- Supabase Auth + Products DB
- Python (opcional) para generador de Excel

## 🚀 Características

- ✅ **Autenticación Supabase** (Signup/Login/Logout/Admin)
- ✅ **Admin Panel protegido** con redirección automática
- ✅ **Next.js 14+** con App Router para SEO
- ✅ **Supabase** como BD de productos  
- ✅ **CSS Modules** para estilos scoped
- ✅ **JavaScript puro** (sin TypeScript)
- ✅ **Sitemap + robots.txt** dinámicos
- ✅ **Metadata automática** en cada página
- ✅ **Design System** completo
- ✅ **Generador de Excel** (futuro: PA-API)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Supabase](https://supabase.com) (gratis)
- **Opcional**: Python 3.8+ (para backend Flask cuando tengas PA-API)
- **Opcional**: Credenciales de Amazon Product Advertising API (futuro)

## 🔐 Autenticación (Supabase Auth)

### Características

✅ **Registro**: Crear cuenta nueva con email/password  
✅ **Login**: Iniciar sesión automático a `/admin` si es admin  
✅ **Logout**: Limpiar sesión y localStorage  
✅ **Admin Panel**: Protegido - solo admins  
✅ **Home Section**: "Panel Admin" solo para admins  

### Flujo Rápido

1. **Ir a `/login`**
2. **Registrarse**: Email, password, nombre
3. **Hacer admin** (SQL en Supabase):
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'
WHERE email = 'tu_email@example.com';
```
4. **Login nuevamente** → Redirige a `/admin` automáticamente

Ver **ADMIN_SETUP.md** y **TESTING_AUTH.md** para más detalles.

## 🛠️ Configuración de Supabase

### Paso 1: Crear proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota las credenciales:
   - **URL del proyecto**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGci...`

### Paso 2: Crear tabla de productos

1. En el panel de Supabase, ve a **SQL Editor**
2. Ejecuta el script de `database/products_table.sql`
3. La tabla tendrá estructura compatible con Amazon PA-API

### Paso 3: Configurar variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Amazon PA-API (OPCIONAL - Para futuro)
PAAPI_ACCESS_KEY=
PAAPI_SECRET_KEY=
PAAPI_PARTNER_TAG=
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Paso 4: Importar datos iniciales

Puedes usar los productos de ejemplo en `src/data/products.js` para poblar Supabase.

Ver **SUPABASE_SETUP.md** para instrucciones detalladas de importación.

## 🛠️ Instalación

### Frontend (Next.js)

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación Completa

- **SUPABASE_SETUP.md**: Guía completa de configuración de Supabase
- **PROYECTO_JAVASCRIPT.md**: Detalles técnicos del proyecto
- **.env.example**: Plantilla de variables de entorno

## 🔮 Integración Futura con Amazon PA-API

### Cuando tengas credenciales de PA-API:

1. **Configura el backend Flask** (ver instrucciones abajo)
2. **Descomenta el código de PA-API** en `server/generate_amazon_excel.py`
3. **Usa la página `/generar-excel`** para obtener productos de Amazon
4. **Importa los datos** a Supabase o sincroniza automáticamente

### Backend (Flask) - OPCIONAL

```bash
# Desde la raíz del proyecto
cd server

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env en server/
# Copiar credenciales de PA-API

# Ejecutar servidor Flask
python generate_amazon_excel.py
```

El servidor Flask estará disponible en `http://localhost:8000`

## 🏗️ Estructura del Proyecto

```
app/                    # Next.js App Router
├── layout.js          # Layout principal + SEO
├── page.js            # Home
├── sitemap.js         # Sitemap dinámico
├── robots.js          # Robots.txt
├── categoria/         # Categorías de productos (Supabase)
├── producto/          # Detalle de productos (Supabase)
├── blog/              # Blog posts
└── generar-excel/     # Generador Excel PA-API (futuro)

src/
├── components/        # Componentes React
│   ├── ProductCard.jsx
│   └── ui/           # shadcn/ui
├── data/
│   ├── products.js   # Estructura de referencia (categorías)
│   └── blog.js
└── lib/
    ├── supabase.js   # Cliente de Supabase + funciones
    └── utils.js

server/                # Backend Flask (opcional)
├── generate_amazon_excel.py
└── requirements.txt

database/              # Scripts SQL
└── products_table.sql # Estructura de tabla Supabase
```

## 🔑 Variables de Entorno

Ver `.env.example` para la plantilla completa.

**Requeridas (Supabase):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Opcionales (Amazon PA-API - futuro):**
- `PAAPI_ACCESS_KEY`
- `PAAPI_SECRET_KEY`
- `PAAPI_PARTNER_TAG`
- `NEXT_PUBLIC_API_URL`

## 🎯 Flujo de Trabajo Actual

1. **Desarrollo**: Los productos se gestionan en Supabase manualmente
2. **Producción**: Los productos se obtienen dinámicamente de Supabase
3. **Futuro**: Cuando tengas PA-API, usa `/generar-excel` para sincronizar datos

## � Notas Importantes

- La página `/generar-excel` está lista pero **no afecta el funcionamiento actual**
- Los productos en Supabase usan la **misma estructura que Amazon PA-API**
- Cuando obtengas credenciales de PA-API, la integración será **automática**
- El backend Flask es **opcional** hasta que tengas las credenciales

## 🛡️ Tecnologías Utilizadas

- **Next.js 14.2** - Framework React con SSR/SSG
- **React 18.3** - Librería de UI
- **Supabase** - Base de datos PostgreSQL
- **TailwindCSS 3.4** - Framework CSS utility-first
- **shadcn/ui** - Componentes de interfaz
- **Flask** - Backend Python (opcional)
- **Amazon PA-API 5.0** - API de productos (futuro)

## 📝 Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm start           # Servidor de producción
npm run lint        # Linter ESLint
```
## 📧 Soporte

Para más información, consulta:
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Amazon PA-API Documentation](https://webservices.amazon.es/paapi5/documentation/)

## 📄 Licencia

Este proyecto está bajo licencia MIT.

