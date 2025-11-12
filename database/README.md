# Instrucciones para Configurar la Base de Datos

## Orden de Ejecución de Scripts SQL en Supabase

Ejecuta los siguientes archivos SQL en el editor SQL de Supabase en este orden:

### 1. Tablas Base
```sql
-- Primero crear la tabla de productos
database/products_table.sql
```

### 2. Tabla de Blogs
```sql
-- Crear la tabla de blogs con sus funciones y triggers
database/blogs_table.sql
```

### 3. Tablas Nuevas - SEO y Categorías

```sql
-- Tabla de SEO para productos (relación 1:1 con products)
database/product_seo_table.sql
```

```sql
-- Tabla de categorías con SEO e imágenes
database/categories_table.sql
```

### 4. Políticas de Seguridad (RLS)

**IMPORTANTE**: Ejecuta estos archivos para corregir los problemas de permisos:

```sql
-- Políticas actualizadas para blogs (corrige el error 403)
database/blogs_policies_fix.sql
```

```sql
-- Políticas para productos
database/products_policies.sql
```

### 5. Configurar Storage para Imágenes de Categorías

#### Opción A: Crear bucket desde la interfaz de Supabase (RECOMENDADO)

1. Ve a **Storage** en el panel de Supabase
2. Click en **"New bucket"**
3. Configuración:
   - **Nombre**: `category-images`
   - **Public bucket**: ✅ Activado (para que las imágenes sean accesibles públicamente)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
4. Click en **"Create bucket"**

#### Opción B: Ejecutar políticas de Storage (después de crear el bucket)

```sql
-- Ejecutar este archivo para configurar las políticas de acceso
database/storage_setup.sql
```

## Verificar que RLS está Habilitado

Después de ejecutar los scripts, verifica en Supabase:

1. Ve a **Table Editor** → **products**
2. Click en **RLS** (debería mostrar "RLS enabled")
3. Ve a **Policies** y verifica que existan las 4 políticas (SELECT, INSERT, UPDATE, DELETE)
4. Repite lo mismo para las tablas: **blogs**, **product_seo**, **categories**

## Estructura de Tablas

### Products
- `id`, `asin`, `title`, `brand`, `price`, `currency`
- `rating`, `reviews_count`, `images[]`, `features[]`
- `specs` (JSONB), `description`, `pros[]`, `cons[]`
- `category`, `subcategory`, `stock`, `affiliate_link`

### Product SEO (Relación 1:1 con Products)
- `product_id` (FK a products.id)
- **SEO Básico**: `seo_title`, `seo_description`, `seo_keywords`
- **Open Graph**: `og_title`, `og_description`, `og_image`, `og_type`
- **Twitter**: `twitter_card`, `twitter_title`, `twitter_description`, `twitter_image`
- **Otros**: `canonical_url`, `meta_robots`, `schema_data` (JSONB)

### Categories
- **Básico**: `id`, `name`, `slug`, `description`
- **Imagen**: `image_url` (Storage), `image_alt`, `icon`
- **SEO**: `seo_title`, `seo_description`, `seo_keywords`
- **Open Graph**: `og_title`, `og_description`, `og_image`
- **Control**: `display_order`, `is_active`, `product_count`

### Blogs
- `id`, `title`, `slug`, `content`, `excerpt`
- `featured_image`, `featured_image_alt`
- `seo_title`, `seo_description`, `seo_keywords`
- `og_title`, `og_description`, `og_image`
- `category`, `tags[]`, `status`, `published_at`
- `author_id`, `author_name`, `views_count`

## Funcionalidades del Admin Panel

### 1. Gestión de Productos
- ✅ Crear, editar y eliminar productos
- ✅ Todos los campos de Amazon PA-API
- ✅ **Botón "SEO"** para configurar SEO específico de cada producto

### 2. Modal de SEO para Productos
- SEO Básico (title, description, keywords)
- Open Graph para redes sociales
- Twitter Cards
- URL canónica y meta robots

### 3. Gestión de Categorías
- ✅ Crear, editar y eliminar categorías
- ✅ **Subir imágenes** a Supabase Storage
- ✅ Configurar SEO completo para cada categoría
- ✅ Open Graph para compartir en redes
- ✅ Control de orden y visibilidad

### 4. Gestión de Blogs
- ✅ Crear, editar y eliminar blogs
- ✅ SEO y Open Graph integrados
- ✅ Sistema de tags y categorías
- ✅ Estados: draft, published, archived

## Problemas Resueltos

### Error 403 en Blogs
**Síntoma**: `permission denied for table users`

**Solución**: Políticas RLS actualizadas en `blogs_policies_fix.sql`

### Error 400 en Productos  
**Síntoma**: `Could not find the 'image_url' column`

**Solución**: Formulario actualizado para usar campos correctos de la base de datos

## Uso de Storage

### Subir imágenes de categorías:

```javascript
import { uploadCategoryImage, deleteCategoryImage } from '@/lib/supabase';

// Subir imagen
const result = await uploadCategoryImage(file, categorySlug);
if (result.success) {
  console.log('URL de la imagen:', result.data.url);
}

// Eliminar imagen
await deleteCategoryImage(imageUrl);
```

### Estructura en Storage:
```
category-images/
  ├── tecnologia-1699876543210.jpg
  ├── hogar-1699876543211.png
  └── deportes-1699876543212.webp
```

## Próximos Pasos

1. ✅ Ejecutar todos los scripts SQL en orden
2. ✅ Crear el bucket `category-images` en Storage
3. ✅ Verificar que RLS esté habilitado en todas las tablas
4. ✅ Probar crear una categoría con imagen
5. ✅ Probar editar el SEO de un producto
6. ✅ Verificar que las políticas de Storage funcionen

## Soporte

Si encuentras algún error:
1. Verifica que las tablas existan: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`
2. Verifica RLS: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
3. Verifica políticas: `SELECT * FROM pg_policies;`
4. Verifica el bucket: Ve a Storage → category-images
