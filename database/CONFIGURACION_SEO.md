# 🔧 Instalación de la Configuración SEO

## Paso 1: Ejecutar el SQL en Supabase

1. Ve a tu panel de Supabase
2. Navega a **SQL Editor**
3. Crea una nueva query
4. Copia y pega el contenido del archivo `database/site_settings_table.sql`
5. Haz clic en **Run** o presiona `Ctrl+Enter`

## Paso 2: Verificar la instalación

Después de ejecutar el SQL, deberías ver:
- ✅ Tabla `site_settings` creada
- ✅ Un registro inicial con valores por defecto
- ✅ Políticas RLS configuradas

## Paso 3: Usar la configuración

1. Inicia sesión como administrador en tu aplicación
2. Ve a `/admin/settings`
3. Completa los campos de SEO para la home
4. Guarda los cambios

## 📋 Funcionalidades implementadas

### Frontend
- **Header**: Muestra el nombre del sitio desde la configuración
- **Home**: 
  - Título dinámico desde la BD
  - Descripción dinámica desde la BD
- **Footer**: Muestra el nombre del sitio en copyright y disclaimer
- **Layout**: Metadata SEO completa (meta tags, Open Graph, Twitter Card)

### Panel de Admin
- **Settings Page** (`/admin/settings`):
  - Formulario completo con validación
  - Contador de caracteres para SEO
  - 4 secciones: Info General, SEO Básico, Open Graph, Twitter Card
  - Guardado automático en base de datos

### Base de Datos
- Tabla `site_settings` con todos los campos necesarios
- Trigger automático para `updated_at`
- Políticas RLS configuradas
- Valores por defecto

## 🎯 Campos disponibles

### Información General
- `site_name`: Nombre del sitio
- `site_url`: URL principal del sitio

### SEO Básico (Home)
- `home_title`: Meta title (max 60 caracteres)
- `home_description`: Meta description (max 160 caracteres)
- `home_keywords`: Keywords separadas por comas

### Open Graph
- `home_og_title`: OG Title
- `home_og_description`: OG Description
- `home_og_image`: URL de la imagen (1200x630px)

### Twitter Card
- `home_twitter_title`: Twitter Title
- `home_twitter_description`: Twitter Description
- `home_twitter_image`: URL de la imagen (1200x675px)

## 🚀 Próximos pasos opcionales

Si quieres expandir la funcionalidad, podrías añadir:
- Google Analytics ID
- Facebook Pixel
- Scripts personalizados
- Configuración de redes sociales
- Configuración de Amazon Affiliate ID
