-- Tabla de blogs/artículos
-- Incluye campos completos de SEO

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información básica
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- Imagen principal
  featured_image VARCHAR(500),
  featured_image_alt VARCHAR(255),
  
  -- SEO Fields
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  og_image VARCHAR(500),
  og_title VARCHAR(255),
  og_description TEXT,
  
  -- Categorización
  category VARCHAR(100),
  tags TEXT[], -- Array de tags
  
  -- Estado y publicación
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Autoría
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  
  -- Métricas
  views_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);

-- Índice para búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_blogs_search ON blogs USING GIN (to_tsvector('spanish', title || ' ' || content));

-- Habilitar Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer blogs publicados
CREATE POLICY "Anyone can read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

-- Política: Solo admins pueden insertar blogs
CREATE POLICY "Admins can insert blogs" ON blogs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id
    )
  );

-- Política: Solo admins pueden actualizar blogs
CREATE POLICY "Admins can update blogs" ON blogs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id
    )
  );

-- Política: Solo admins pueden eliminar blogs
CREATE POLICY "Admins can delete blogs" ON blogs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id
    )
  );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_blogs_updated_at();

-- Función para generar slug automáticamente
CREATE OR REPLACE FUNCTION generate_blog_slug()
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
  
  -- Generar slug base desde el título
  base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Verificar si el slug existe y agregar número si es necesario
  WHILE EXISTS (SELECT 1 FROM blogs WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_generate_slug
BEFORE INSERT OR UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION generate_blog_slug();

-- Comentarios para documentación
COMMENT ON TABLE blogs IS 'Tabla de blogs/artículos con campos completos de SEO';
COMMENT ON COLUMN blogs.slug IS 'URL-friendly identifier, se genera automáticamente del título';
COMMENT ON COLUMN blogs.status IS 'Estado: draft, published, archived';
COMMENT ON COLUMN blogs.tags IS 'Array de tags/etiquetas';
