-- Tabla de SEO para productos
-- Relación 1:1 con la tabla products

CREATE TABLE IF NOT EXISTS product_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relación con productos
  product_id TEXT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  
  -- Campos SEO básicos
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  
  -- Open Graph / Social Media
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  og_type VARCHAR(50) DEFAULT 'product',
  
  -- Twitter Card
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  
  -- Schema.org / Datos estructurados
  schema_data JSONB, -- Para datos estructurados personalizados
  
  -- URL canónica
  canonical_url VARCHAR(500),
  
  -- Meta robots
  meta_robots VARCHAR(100) DEFAULT 'index, follow',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_product_seo_product_id ON product_seo(product_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_product_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_seo_updated_at
BEFORE UPDATE ON product_seo
FOR EACH ROW
EXECUTE FUNCTION update_product_seo_updated_at();

-- Habilitar Row Level Security
ALTER TABLE product_seo ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can read product SEO" ON product_seo
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert product SEO" ON product_seo
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update product SEO" ON product_seo
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete product SEO" ON product_seo
  FOR DELETE 
  TO authenticated
  USING (true);

-- Comentarios
COMMENT ON TABLE product_seo IS 'Configuración SEO para cada producto';
COMMENT ON COLUMN product_seo.product_id IS 'Relación 1:1 con products.id';
COMMENT ON COLUMN product_seo.schema_data IS 'Datos estructurados JSON-LD para Schema.org';
