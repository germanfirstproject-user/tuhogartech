-- Habilitar Row Level Security para productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer productos
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

-- Política: Usuarios autenticados pueden insertar productos
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar productos
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política: Usuarios autenticados pueden eliminar productos
CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE 
  TO authenticated
  USING (true);
