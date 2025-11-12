-- Tabla de categorías con SEO e imágenes

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información básica
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  
  -- Imagen de la categoría (almacenada en Supabase Storage)
  image_url VARCHAR(500),
  image_alt VARCHAR(255),
  
  -- Icono o emoji
  icon VARCHAR(50),
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  
  -- Open Graph
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  
  -- Orden y estado
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Estadísticas
  product_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_category_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Si ya tiene slug, no hacer nada
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generar slug base desde el nombre
  base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Verificar si el slug existe y agregar número si es necesario
  WHILE EXISTS (SELECT 1 FROM categories WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_generate_slug
BEFORE INSERT OR UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION generate_category_slug();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_categories_updated_at();

-- Habilitar Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can read active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can read all categories" ON categories
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE 
  TO authenticated
  USING (true);

-- Comentarios
COMMENT ON TABLE categories IS 'Categorías de productos con SEO e imágenes';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier, se genera automáticamente del nombre';
COMMENT ON COLUMN categories.image_url IS 'URL de la imagen almacenada en Supabase Storage (bucket: category-images)';
COMMENT ON COLUMN categories.product_count IS 'Contador de productos en esta categoría (actualizado por trigger)';
