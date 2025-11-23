-- Tabla para productos destacados (seleccionados por admin)
CREATE TABLE IF NOT EXISTS featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id)
);

-- Índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_featured_products_order ON featured_products(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_products_active ON featured_products(is_active);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_featured_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER featured_products_updated_at
BEFORE UPDATE ON featured_products
FOR EACH ROW
EXECUTE FUNCTION update_featured_products_updated_at();

-- Habilitar Row Level Security
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Todos pueden leer productos destacados activos
CREATE POLICY "Anyone can read active featured products" ON featured_products
  FOR SELECT USING (is_active = true);

-- Solo admins pueden gestionar (necesitarás configurar esto según tu sistema de auth)
-- Por ahora, permitimos que usuarios autenticados puedan ver todos
CREATE POLICY "Authenticated users can read all featured products" ON featured_products
  FOR SELECT TO authenticated USING (true);

-- Permitir a usuarios autenticados insertar productos destacados
CREATE POLICY "Authenticated users can insert featured products" ON featured_products
  FOR INSERT TO authenticated WITH CHECK (true);

-- Permitir a usuarios autenticados actualizar productos destacados
CREATE POLICY "Authenticated users can update featured products" ON featured_products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Permitir a usuarios autenticados eliminar productos destacados
CREATE POLICY "Authenticated users can delete featured products" ON featured_products
  FOR DELETE TO authenticated USING (true);

-- Comentarios
COMMENT ON TABLE featured_products IS 'Productos destacados seleccionados por el administrador para mostrar en la home';
COMMENT ON COLUMN featured_products.product_id IS 'ID del producto destacado';
COMMENT ON COLUMN featured_products.display_order IS 'Orden de visualización (menor = primero)';
COMMENT ON COLUMN featured_products.is_active IS 'Si el producto destacado está activo';
