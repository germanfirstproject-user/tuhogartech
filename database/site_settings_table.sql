-- Tabla de configuración general del sitio
-- Almacena configuración SEO de la home y ajustes generales

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Solo debe haber un registro de configuración
  is_default BOOLEAN DEFAULT true UNIQUE,
  
  -- SEO Home Page
  home_title VARCHAR(255) DEFAULT 'Encuentra los mejores productos al mejor precio',
  home_description TEXT DEFAULT 'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra',
  home_keywords TEXT,
  
  -- Open Graph (Home)
  home_og_title VARCHAR(255),
  home_og_description TEXT,
  home_og_image VARCHAR(500),
  home_og_type VARCHAR(50) DEFAULT 'website',
  
  -- Twitter Card (Home)
  home_twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  home_twitter_title VARCHAR(255),
  home_twitter_description TEXT,
  home_twitter_image VARCHAR(500),
  
  -- Información general del sitio
  site_name VARCHAR(255) DEFAULT 'AffiliPro',
  site_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración por defecto
INSERT INTO site_settings (
  is_default,
  home_title,
  home_description,
  home_keywords,
  site_name
) VALUES (
  true,
  'Encuentra los mejores productos al mejor precio',
  'Reseñas honestas, comparativas detalladas y ofertas exclusivas para que tomes la mejor decisión de compra',
  'productos, ofertas, comparativas, reseñas, afiliados, amazon',
  'AffiliPro'
) ON CONFLICT (is_default) DO NOTHING;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();

-- Habilitar Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" ON site_settings
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings" ON site_settings
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Comentarios
COMMENT ON TABLE site_settings IS 'Configuración general del sitio y SEO de la home';
COMMENT ON COLUMN site_settings.is_default IS 'Solo debe existir un registro con is_default = true';
