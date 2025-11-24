# 🔍 Planteamiento: Búsqueda Universal (Productos + Blogs)

## 🎯 Objetivo

Crear un buscador que permita encontrar:
1. **Productos** que coincidan con la búsqueda
2. **Blogs** que mencionen esos productos o el término buscado

**Ejemplo de uso:**
- Usuario busca: "auriculares sony"
- Resultados:
  - ✅ Productos: Auriculares Sony WH-1000XM5, etc.
  - ✅ Blogs: "Los 10 mejores auriculares 2025", "Review Sony WH-1000XM5", etc.

---

## 📊 Análisis Técnico

### Campos donde buscar:

#### En **Productos** (tabla `products`):
- `title` - Nombre del producto
- `description` - Descripción
- `brand` - Marca
- `category` - Categoría
- `subcategory` - Subcategoría

#### En **Blogs** (tabla `blogs`):
- `title` - Título del blog
- `content` - Contenido completo (HTML/Markdown)
- `excerpt` - Resumen
- `tags` - Array de etiquetas
- `category` - Categoría

### Relación Producto-Blog:

**Método 1: Búsqueda por contenido** (RECOMENDADO - más flexible)
- Buscar si el blog menciona el título del producto en su `content`
- Buscar si el blog menciona la marca + categoría
- Buscar términos relacionados en tags

**Método 2: Relación explícita** (opcional - más precisa)
- Crear tabla `blog_products` para relacionar blogs con productos
- Requiere más gestión pero más preciso

---

## 💡 Propuesta de Implementación

### Arquitectura de la Búsqueda

```
Usuario escribe "auriculares sony"
           ↓
    [SearchBar Component]
           ↓
  ┌─────────────────────┐
  │  searchUnified()    │ ← Nueva función en supabase.js
  └─────────────────────┘
           ↓
    ┌─────┴──────┐
    ↓            ↓
[Productos]  [Blogs]
    ↓            ↓
    └─────┬──────┘
          ↓
   [Resultados Combinados]
          ↓
   [Página /buscar]
```

---

## 🛠️ Funciones Necesarias

### 1. Nueva función en `src/lib/supabase.js`

```javascript
/**
 * Búsqueda unificada de productos y blogs relacionados
 * @param {string} query - Término de búsqueda
 * @returns {Object} { products: [], blogs: [], relatedBlogs: [] }
 */
export async function searchUnified(query) {
  try {
    const searchTerm = query.trim();
    
    // 1. Buscar productos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('rating', { ascending: false });
    
    if (productsError) throw productsError;
    
    // 2. Buscar blogs por el término
    const { data: directBlogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });
    
    if (blogsError) throw blogsError;
    
    // 3. Si encontramos productos, buscar blogs que los mencionen
    let relatedBlogs = [];
    if (products && products.length > 0) {
      // Buscar blogs que mencionen los productos encontrados
      const productTitles = products.slice(0, 5).map(p => p.title); // Top 5 productos
      const productBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
      
      const relatedConditions = [];
      
      // Buscar por títulos de productos
      productTitles.forEach(title => {
        relatedConditions.push(`content.ilike.%${title}%`);
      });
      
      // Buscar por marcas
      productBrands.forEach(brand => {
        relatedConditions.push(`content.ilike.%${brand}%`);
      });
      
      if (relatedConditions.length > 0) {
        const { data: related } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .or(relatedConditions.join(','))
          .order('published_at', { ascending: false })
          .limit(10);
        
        if (related) {
          relatedBlogs = related;
        }
      }
    }
    
    // Combinar y deduplicar blogs
    const allBlogsMap = new Map();
    [...(directBlogs || []), ...(relatedBlogs || [])].forEach(blog => {
      allBlogsMap.set(blog.id, blog);
    });
    const blogs = Array.from(allBlogsMap.values());
    
    return {
      success: true,
      data: {
        products: products || [],
        blogs: blogs,
        stats: {
          productsCount: products?.length || 0,
          blogsCount: blogs.length,
          hasResults: (products?.length || 0) > 0 || blogs.length > 0
        }
      }
    };
    
  } catch (err) {
    console.error('Error in unified search:', err);
    return {
      success: false,
      error: err.message,
      data: { products: [], blogs: [], stats: {} }
    };
  }
}
```

---

## 🎨 Diseño de la Página de Resultados

### Layout propuesto:

```
┌─────────────────────────────────────────────────┐
│ Resultados para "auriculares sony"              │
│ 12 productos · 5 artículos                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ 📦 PRODUCTOS (12)                               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│ │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │           │
│ │Title │ │Title │ │Title │ │Title │           │
│ └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│ 📝 ARTÍCULOS RELACIONADOS (5)                   │
│ ┌─────────────────────────────────────────┐    │
│ │ 📰 Los 10 mejores auriculares 2025     │    │
│ │    Review completa de los mejores...   │    │
│ │    hace 2 días                          │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
│ ┌─────────────────────────────────────────┐    │
│ │ 📰 Review Sony WH-1000XM5              │    │
│ │    Análisis completo del mejor...      │    │
│ │    hace 1 semana                        │    │
│ └─────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
app/
  buscar/
    page.js              # Página de resultados unificados
    page.module.css      # Estilos
    loading.js           # Skeleton mientras carga

src/components/
  SearchBar.js           # Barra de búsqueda en Header
  SearchBar.module.css   # Estilos
  BlogCard.js            # Card para mostrar blog (nuevo)
  BlogCard.module.css    # Estilos
```

---

## 🔨 Implementación Paso a Paso

### **Paso 1: Crear función de búsqueda unificada**
Archivo: `src/lib/supabase.js`

Agregar la función `searchUnified(query)` que:
- Busca productos por término
- Busca blogs por término
- Busca blogs que mencionen los productos encontrados
- Retorna todo combinado

### **Paso 2: Crear componente SearchBar**
Archivo: `src/components/SearchBar.js`

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <input
        type="search"
        placeholder="Buscar productos y artículos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        🔍
      </button>
    </form>
  );
}
```

### **Paso 3: Integrar SearchBar en Header**
Archivo: `src/components/Header.js`

```jsx
import SearchBar from '@/components/SearchBar';

// Dentro del JSX, después del logo:
<div className={styles.logo}>
  {siteName}
</div>
<SearchBar />  {/* ← NUEVO */}
<nav className={styles.desktopNav}>
  ...
</nav>
```

### **Paso 4: Crear página de resultados**
Archivo: `app/buscar/page.js`

```jsx
import Link from 'next/link';
import { searchUnified } from '@/lib/supabase';
import ProductsGrid from '@/components/ProductsGrid';
import BlogCard from '@/components/BlogCard';
import styles from './page.module.css';

export const metadata = {
  title: 'Búsqueda - AffiliPro',
};

export default async function BuscarPage({ searchParams }) {
  const query = searchParams.q || '';
  
  if (!query.trim()) {
    return (
      <main className={styles.container}>
        <h1>Escribe algo para buscar</h1>
        <Link href="/">Volver al inicio</Link>
      </main>
    );
  }

  const result = await searchUnified(query);
  const { products, blogs, stats } = result.success ? result.data : { products: [], blogs: [], stats: {} };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Resultados para "{query}"
        </h1>
        <p className={styles.stats}>
          {stats.productsCount} productos · {stats.blogsCount} artículos
        </p>
      </div>

      {!stats.hasResults && (
        <div className={styles.noResults}>
          <p>No se encontraron resultados para "{query}"</p>
          <Link href="/productos">Explorar todos los productos</Link>
        </div>
      )}

      {/* Productos */}
      {products.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            📦 Productos ({products.length})
          </h2>
          <ProductsGrid products={products} />
        </section>
      )}

      {/* Blogs */}
      {blogs.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            📝 Artículos Relacionados ({blogs.length})
          </h2>
          <div className={styles.blogsGrid}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
```

### **Paso 5: Crear componente BlogCard**
Archivo: `src/components/BlogCard.js`

```jsx
import Link from 'next/link';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/blog/${blog.slug || blog.id}`} className={styles.card}>
      {blog.featured_image && (
        <div className={styles.imageContainer}>
          <img 
            src={blog.featured_image} 
            alt={blog.featured_image_alt || blog.title}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{blog.title}</h3>
        {blog.excerpt && (
          <p className={styles.excerpt}>{blog.excerpt}</p>
        )}
        <div className={styles.meta}>
          {blog.category && (
            <span className={styles.category}>{blog.category}</span>
          )}
          {blog.published_at && (
            <span className={styles.date}>{formatDate(blog.published_at)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

---

## 🎨 Estilos CSS

### SearchBar.module.css
```css
.searchForm {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  max-width: 500px;
}

.searchInput {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s;
}

.searchInput:focus {
  outline: none;
  border-color: var(--color-primary);
}

.searchButton {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.2s;
}

.searchButton:hover {
  background: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .searchForm {
    max-width: 100%;
  }
}
```

### BlogCard.module.css
```css
.card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: all 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.imageContainer {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  flex: 1;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.excerpt {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.category {
  background: var(--color-primary-very-light);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
}
```

---

## ✅ Checklist de Implementación

- [ ] Agregar función `searchUnified()` en `src/lib/supabase.js`
- [ ] Crear `src/components/SearchBar.js`
- [ ] Crear `src/components/SearchBar.module.css`
- [ ] Integrar `<SearchBar />` en `Header.js`
- [ ] Ajustar estilos del Header para que quepa la búsqueda
- [ ] Crear `app/buscar/page.js`
- [ ] Crear `app/buscar/page.module.css`
- [ ] Crear `src/components/BlogCard.js`
- [ ] Crear `src/components/BlogCard.module.css`
- [ ] Probar búsqueda con diferentes términos
- [ ] Verificar resultados de productos
- [ ] Verificar resultados de blogs
- [ ] Verificar blogs relacionados con productos
- [ ] Responsive en móvil

---

## 🚀 Mejoras Futuras (Opcional)

1. **Autocomplete** - Sugerencias mientras escribes
2. **Búsqueda por categoría** - Filtrar por tipo
3. **Resaltado de términos** - Highlight en resultados
4. **Paginación** - Para muchos resultados
5. **Ordenamiento** - Por relevancia, fecha, etc.
6. **Historial de búsqueda** - localStorage
7. **Búsquedas populares** - Mostrar trending

---

## 💡 Ventajas de este Sistema

✅ **Búsqueda completa** - Encuentra productos Y contenido relacionado
✅ **Mejor descubrimiento** - Los usuarios encuentran blogs útiles
✅ **SEO-friendly** - URLs limpias con query params
✅ **Rápido** - Usa funciones nativas de Supabase
✅ **Escalable** - Funciona con 10 o 10,000 productos
✅ **UX mejorada** - Una búsqueda, múltiples resultados

---

**¿Quieres que implemente esto ahora?** En aproximadamente 1 hora tendrás búsqueda completa funcionando.
