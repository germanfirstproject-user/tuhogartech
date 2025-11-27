-- Hero Carousel Setup for site_settings table
-- Añadir campos para las 4 imágenes del carousel en la homepage

-- Añadir columnas para hero carousel a site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_1 TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_2 TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_2_link TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_2_alt TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_3 TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_3_link TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_3_alt TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_4 TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_4_link TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_4_alt TEXT;

-- Crear bucket para imágenes del hero carousel
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para lectura pública de imágenes hero
DROP POLICY IF EXISTS "Public read hero images" ON storage.objects;
CREATE POLICY "Public read hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

-- Política para que usuarios autenticados (admins) puedan subir imágenes hero
DROP POLICY IF EXISTS "Authenticated users can upload hero images" ON storage.objects;
CREATE POLICY "Authenticated users can upload hero images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-images');

-- Política para que usuarios autenticados (admins) puedan actualizar imágenes hero
DROP POLICY IF EXISTS "Authenticated users can update hero images" ON storage.objects;
CREATE POLICY "Authenticated users can update hero images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-images');

-- Política para que usuarios autenticados (admins) puedan eliminar imágenes hero
DROP POLICY IF EXISTS "Authenticated users can delete hero images" ON storage.objects;
CREATE POLICY "Authenticated users can delete hero images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-images');

-- Comentarios explicativos
COMMENT ON COLUMN site_settings.hero_image_1 IS 'URL de la imagen de fondo para el primer slide (con texto y botones)';
COMMENT ON COLUMN site_settings.hero_image_2 IS 'URL de la imagen para el segundo slide';
COMMENT ON COLUMN site_settings.hero_image_2_link IS 'Link de destino al hacer click en el segundo slide';
COMMENT ON COLUMN site_settings.hero_image_2_alt IS 'Texto alternativo para la imagen del segundo slide';
COMMENT ON COLUMN site_settings.hero_image_3 IS 'URL de la imagen para el tercer slide';
COMMENT ON COLUMN site_settings.hero_image_3_link IS 'Link de destino al hacer click en el tercer slide';
COMMENT ON COLUMN site_settings.hero_image_3_alt IS 'Texto alternativo para la imagen del tercer slide';
COMMENT ON COLUMN site_settings.hero_image_4 IS 'URL de la imagen para el cuarto slide';
COMMENT ON COLUMN site_settings.hero_image_4_link IS 'Link de destino al hacer click en el cuarto slide';
COMMENT ON COLUMN site_settings.hero_image_4_alt IS 'Texto alternativo para la imagen del cuarto slide';
