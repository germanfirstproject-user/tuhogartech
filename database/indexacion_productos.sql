-- Indexación de las fichas de producto
--
-- Regla vigente (desde el 19-10-2026): se indexan TODAS las fichas.
--
-- Antes (19-09 a 19-10-2026) solo se indexaba una ficha si algún artículo la
-- enlazaba, y este script la recalculaba cada vez que se publicaba un
-- artículo. Germán decidió indexarlas todas: ya no hay nada que recalcular al
-- publicar, y una ficha nueva entra indexada porque product_seo.meta_robots
-- tiene 'index, follow' como valor por defecto.
--
-- Dónde vive la decisión: product_seo.meta_robots, que la ficha vuelca en su
-- etiqueta robots (app/resenas/[ficha]/page.js) y que el sitemap consulta
-- para no listar lo que pide no ser indexado (app/sitemap.js). Una ficha
-- concreta se puede seguir sacando a mano desde la pestaña SEO del admin.
--
-- Copia del reparto anterior: tabla product_seo_robots_backup_20261019.
-- Para volver a él:
--   UPDATE product_seo s SET meta_robots = b.meta_robots, updated_at = NOW()
--   FROM product_seo_robots_backup_20261019 b WHERE b.product_id = s.product_id;

UPDATE product_seo
SET meta_robots = 'index, follow',
    updated_at = NOW()
WHERE meta_robots IS DISTINCT FROM 'index, follow';

-- Comprobación
SELECT meta_robots, COUNT(*) FROM product_seo GROUP BY 1 ORDER BY 2 DESC;
