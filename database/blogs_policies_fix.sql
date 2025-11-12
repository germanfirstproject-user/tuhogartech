-- Eliminar las políticas antiguas que causan problemas
DROP POLICY IF EXISTS "Admins can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON blogs;

-- Política: Usuarios autenticados pueden insertar blogs
-- (El control de admin se hace en el frontend/middleware)
CREATE POLICY "Authenticated users can insert blogs" ON blogs
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar blogs
CREATE POLICY "Authenticated users can update blogs" ON blogs
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden eliminar blogs
CREATE POLICY "Authenticated users can delete blogs" ON blogs
  FOR DELETE 
  TO authenticated
  USING (true);

-- Política: Usuarios autenticados pueden ver todos los blogs (incluyendo drafts)
CREATE POLICY "Authenticated users can view all blogs" ON blogs
  FOR SELECT
  TO authenticated
  USING (true);

-- La política para usuarios no autenticados se mantiene
-- (solo pueden ver blogs publicados, ya existe)
