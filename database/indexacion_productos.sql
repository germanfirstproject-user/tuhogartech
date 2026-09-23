-- Indexación de las fichas de producto
--
-- Regla: solo se indexa una ficha si algún artículo la enlaza. Una ficha sin
-- enlaces propios no tiene por qué competir en el buscador, y 268 páginas casi
-- iguales reparten la autoridad del dominio entre todas.
--
-- Dónde vive la decisión: product_seo.meta_robots, que es el campo que la ficha
-- ya vuelca en su etiqueta robots (app/producto/[id]/page.js) y que el sitemap
-- consulta para no listar lo que pide no ser indexado (app/sitemap.js).
--
-- La regla se recalcula con este script cada vez que se publica, se edita o se
-- archiva un artículo que enlace productos. Cuenta cualquier artículo, esté
-- publicado o no, porque los archivados están pendientes de volver.
--
-- Para volver atrás:
--   UPDATE product_seo SET meta_robots = 'index, follow';

WITH enlazados AS (
  -- Mismo patrón que extractProductIds() en src/lib/blogProducts.js
  SELECT DISTINCT m[1] AS product_id
  FROM blogs b, regexp_matches(b.content, '/producto/([A-Za-z0-9-]+)', 'g') m
)
UPDATE product_seo s
SET meta_robots = CASE WHEN s.product_id IN (SELECT product_id FROM enlazados)
                       THEN 'index, follow'
                       ELSE 'noindex, follow' END,
    updated_at = NOW()
WHERE s.meta_robots IS DISTINCT FROM
      (CASE WHEN s.product_id IN (SELECT product_id FROM enlazados)
            THEN 'index, follow'
            ELSE 'noindex, follow' END);

-- Comprobación
SELECT meta_robots, COUNT(*) FROM product_seo GROUP BY 1 ORDER BY 2 DESC;
