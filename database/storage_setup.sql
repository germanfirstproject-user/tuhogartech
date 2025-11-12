-- Configuración de Storage para Supabase
-- Este script debe ejecutarse en el editor SQL de Supabase

-- IMPORTANTE: Este script es solo de referencia
-- Los buckets se crean desde la interfaz de Supabase Storage o usando el cliente

-- Instrucciones para crear el bucket manualmente:
-- 1. Ve a Storage en el panel de Supabase
-- 2. Click en "New bucket"
-- 3. Nombre: "category-images"
-- 4. Public: true (para que las imágenes sean accesibles públicamente)
-- 5. File size limit: 5 MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Políticas de Storage (ejecutar después de crear el bucket)

-- Política: Cualquiera puede leer imágenes de categorías
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'category-images' );

-- Política: Usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'category-images' );

-- Política: Usuarios autenticados pueden actualizar imágenes
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'category-images' );

-- Política: Usuarios autenticados pueden eliminar imágenes
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'category-images' );

-- Nota: Si las políticas ya existen, primero elimínalas:
-- DROP POLICY IF EXISTS "Public Access" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
