-- Tabla de productos compatible con Amazon Product Advertising API 5.0
-- Esta estructura coincide con los campos devueltos por PA-API

CREATE TABLE products (
  -- Identificadores
  id TEXT PRIMARY KEY,
  asin TEXT UNIQUE NOT NULL,
  
  -- Información básica
  title TEXT NOT NULL,
  brand TEXT,
  
  -- Precio
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  
  -- Valoraciones
  rating DECIMAL(2,1),
  reviews_count INTEGER DEFAULT 0,
  
  -- Multimedia
  images TEXT[], -- Array de URLs de imágenes
  
  -- Descripción
  features TEXT[], -- Array de características principales
  specs JSONB, -- Especificaciones técnicas como JSON (ej: {"peso": "250g", "dimensiones": "..."})
  description TEXT,
  
  -- Pros y contras (para contenido de afiliados)
  pros TEXT[], -- Ventajas del producto
  cons TEXT[], -- Desventajas del producto
  
  -- Categorización
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Estado
  stock TEXT DEFAULT 'in_stock', -- in_stock, out_of_stock, limited
  
  -- Afiliado
  affiliate_link TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_asin ON products(asin);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Índice para búsqueda de texto completo
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('spanish', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, '')));

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE products IS 'Productos de Amazon con estructura compatible con PA-API 5.0';
COMMENT ON COLUMN products.asin IS 'Amazon Standard Identification Number - Identificador único de Amazon';
COMMENT ON COLUMN products.specs IS 'Especificaciones técnicas en formato JSON';
COMMENT ON COLUMN products.images IS 'Array de URLs de imágenes del producto';
COMMENT ON COLUMN products.features IS 'Características principales del producto';
COMMENT ON COLUMN products.pros IS 'Ventajas del producto (para contenido de afiliados)';
COMMENT ON COLUMN products.cons IS 'Desventajas del producto (para contenido de afiliados)';
