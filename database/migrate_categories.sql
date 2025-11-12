-- Script de migración: Crear categorías desde productos existentes
-- Este script extrae las categorías únicas de la tabla products y las inserta en categories

-- PASO 1: Insertar categorías únicas desde products (solo las que NO existen)
INSERT INTO categories (name, slug, description, seo_title, seo_description, is_active, display_order)
SELECT DISTINCT ON (p.category)
  p.category AS name,
  lower(regexp_replace(p.category, '[^a-zA-Z0-9\s-]', '', 'g')) AS slug,
  'Categoría de productos de ' || p.category AS description,
  p.category || ' - Los Mejores Productos | AffiliPro' AS seo_title,
  'Descubre nuestra selección de productos de ' || p.category || '. Análisis detallados, comparativas y las mejores ofertas.' AS seo_description,
  true AS is_active,
  COALESCE((SELECT MAX(display_order) FROM categories), 0) + ROW_NUMBER() OVER (ORDER BY p.category) AS display_order
FROM products p
WHERE p.category IS NOT NULL 
  AND p.category != ''
  AND p.category NOT IN (SELECT name FROM categories)
ORDER BY p.category;

-- PASO 2: Actualizar contador de productos por categoría
UPDATE categories
SET product_count = (
  SELECT COUNT(*)
  FROM products
  WHERE products.category = categories.name
);

-- PASO 3: Verificar el resultado
SELECT 
  name,
  slug,
  product_count,
  is_active,
  seo_title,
  created_at
FROM categories
ORDER BY display_order;

-- Nota: Este script es seguro de ejecutar múltiples veces
-- gracias a la cláusula NOT EXISTS que evita duplicados
