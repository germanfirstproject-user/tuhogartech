# 🗄️ Configuración de Supabase

Este proyecto utiliza Supabase como base de datos para almacenar productos con estructura compatible con Amazon Product Advertising API 5.0.

## 📋 Requisitos

1. Cuenta en [Supabase](https://supabase.com)
2. Proyecto creado en Supabase

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota las credenciales:
   - **URL del proyecto**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGci...`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Crear Tabla de Productos

En el panel de Supabase, ve a **SQL Editor** y ejecuta el script:

```sql
-- Copiar y pegar el contenido de database/products_table.sql
```

O usa el archivo directamente:
1. Abre `database/products_table.sql`
2. Copia todo el contenido
3. Pégalo en SQL Editor de Supabase
4. Ejecuta el script

## 📊 Estructura de la Tabla

La tabla `products` tiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT | ID único del producto (ej: "p-1001") |
| `asin` | TEXT | Amazon Standard Identification Number |
| `title` | TEXT | Nombre del producto |
| `brand` | TEXT | Marca del producto |
| `price` | DECIMAL | Precio del producto |
| `currency` | TEXT | Moneda (default: "EUR") |
| `rating` | DECIMAL | Valoración (0-5) |
| `reviews_count` | INTEGER | Número de reseñas |
| `images` | TEXT[] | Array de URLs de imágenes |
| `features` | TEXT[] | Array de características |
| `specs` | JSONB | Especificaciones técnicas (JSON) |
| `description` | TEXT | Descripción del producto |
| `pros` | TEXT[] | Ventajas del producto |
| `cons` | TEXT[] | Desventajas del producto |
| `category` | TEXT | Categoría principal |
| `subcategory` | TEXT | Subcategoría |
| `stock` | TEXT | Estado del stock |
| `affiliate_link` | TEXT | Link de afiliado de Amazon |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

## 📦 Importar Datos Iniciales

### Opción 1: Usar la Interfaz de Supabase

1. Ve a **Table Editor** → `products`
2. Click en **Insert** → **Insert row**
3. Completa los campos manualmente

### Opción 2: Importar desde JSON (Recomendado)

1. Abre `src/data/products.js`
2. Copia los productos del array `products`
3. Usa este script en SQL Editor:

```sql
-- Ejemplo de inserción
INSERT INTO products (
  id, asin, title, brand, price, currency, rating, reviews_count,
  images, features, specs, description, pros, cons,
  category, subcategory, stock, affiliate_link
) VALUES (
  'p-1001',
  'B09X5JHGYZ',
  'Sony WH-1000XM5 - Auriculares',
  'Sony',
  349.99,
  'EUR',
  4.7,
  8245,
  ARRAY['https://m.media-amazon.com/images/I/...'],
  ARRAY['Cancelación de ruido líder...', 'Batería de hasta 30 horas...'],
  '{"peso": "250g", "conectividad": "Bluetooth 5.2"}'::jsonb,
  'Los auriculares premium...',
  ARRAY['Excelente cancelación de ruido', 'Sonido de alta calidad'],
  ARRAY['Precio elevado', 'No resistentes al agua'],
  'audio',
  'auriculares',
  'in_stock',
  'https://amazon.es/dp/B09X5JHGYZ?tag=tu-tag-21'
);
```

### Opción 3: Script de Migración Automática

Próximamente se agregará un script Node.js para importar automáticamente desde `products.js`.

## 🔧 Uso en el Código

El proyecto ya está configurado para usar Supabase. Los archivos relevantes son:

- **`src/lib/supabase.js`**: Cliente de Supabase y funciones helper
- **`app/categoria/[slug]/page.js`**: Usa `getProductsByCategory()`
- **`app/producto/[id]/page.js`**: Usa `getProductById()`

### Ejemplo de Uso

```javascript
import { getProducts, getProductsByCategory } from '@/lib/supabase';

// Obtener todos los productos
const products = await getProducts();

// Obtener productos de una categoría
const audioProducts = await getProductsByCategory('audio');

// Buscar productos
const results = await searchProducts('Sony auriculares');
```

## 🔄 Integración con Amazon PA-API

### Flujo de Trabajo Futuro

1. **Fase Actual**: Los productos se gestionan manualmente en Supabase
2. **Fase Futura** (cuando tengas credenciales de PA-API):
   - Usa la página `/generar-excel` para obtener datos de Amazon
   - El backend Flask (`server/generate_amazon_excel.py`) consulta la PA-API
   - Los productos se pueden importar masivamente a Supabase
   - O sincronizar automáticamente con cron jobs

### Preparación para PA-API

La estructura de la tabla **ya es compatible** con PA-API 5.0. Cuando actives la API:

1. Configura las credenciales en `server/.env`
2. Descomenta el código de PA-API en `generate_amazon_excel.py`
3. Usa la página `/generar-excel` para obtener productos
4. Importa el Excel a Supabase o crea un endpoint para insertar directamente

## 🛡️ Seguridad y Permisos

### Row Level Security (RLS)

Por defecto, Supabase tiene RLS desactivado. Para producción:

```sql
-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Allow public read access"
ON products FOR SELECT
USING (true);

-- Permitir inserción solo a usuarios autenticados (opcional)
CREATE POLICY "Allow authenticated insert"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Variables de Entorno

- `NEXT_PUBLIC_SUPABASE_URL`: **Pública** (se expone al cliente)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: **Pública** (clave anónima con permisos limitados)
- **NO expongas** la clave `service_role` en el frontend

## 📝 Notas Importantes

1. **Datos de Prueba**: Puedes copiar productos de `src/data/products.js` para poblar la base de datos inicialmente
2. **Excel/PA-API**: La página `/generar-excel` NO afecta el funcionamiento actual. Es para uso futuro
3. **Sincronización**: Los productos en Supabase son independientes de la PA-API hasta que decidas integrarla
4. **Imágenes**: Usa URLs públicas de Amazon o sube tus propias imágenes a Supabase Storage

## 🚨 Troubleshooting

### Error: "Supabase URL is required"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor Next.js después de crear `.env.local`

### Error: "relation 'products' does not exist"
- Ejecuta el script SQL de `database/products_table.sql` en Supabase

### Productos no aparecen
- Verifica que la tabla tiene datos: `SELECT COUNT(*) FROM products;`
- Revisa la consola del navegador para errores de Supabase
- Verifica que RLS permite lectura pública (o desactívalo temporalmente)

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
