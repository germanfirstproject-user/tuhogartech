-- Tabla unificada de datos de usuario
-- Contiene toda la información y preferencias del usuario en un solo lugar
-- Relación 1:1 con auth.users

CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relación con auth.users (1:1)
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Productos guardados/favoritos (array de IDs)
  favorite_products TEXT[] DEFAULT '{}',
  
  -- Historial de productos visitados (array de IDs)
  -- Los más recientes primero
  visited_products TEXT[] DEFAULT '{}',
  
  -- Historial de blogs leídos (array de UUIDs)
  read_blogs UUID[] DEFAULT '{}',
  
  -- Preferencias del usuario (JSON)
  preferences JSONB DEFAULT '{
    "email_notifications": true,
    "newsletter": false,
    "price_alerts": true,
    "dark_mode": false,
    "language": "es"
  }'::jsonb,
  
  -- Estadísticas
  total_product_views INTEGER DEFAULT 0,
  total_blog_reads INTEGER DEFAULT 0,
  
  -- Información adicional del perfil (opcional)
  full_name VARCHAR(255),
  username VARCHAR(100),
  avatar_url VARCHAR(500),
  bio TEXT,
  location VARCHAR(255),
  phone VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_username ON user_data(username);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_user_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_data_updated_at
BEFORE UPDATE ON user_data
FOR EACH ROW
EXECUTE FUNCTION update_user_data_updated_at();

-- Función para crear user_data automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user_data()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_data (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que llama la función cuando se crea un usuario en auth
DROP TRIGGER IF EXISTS on_auth_user_created_data ON auth.users;
CREATE TRIGGER on_auth_user_created_data
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_data();

-- Habilitar Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can read their own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" ON user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data" ON user_data
  FOR DELETE USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON TABLE user_data IS 'Datos unificados del usuario: favoritos, historial, preferencias y perfil';
COMMENT ON COLUMN user_data.user_id IS 'Relación 1:1 con auth.users';
COMMENT ON COLUMN user_data.favorite_products IS 'Array de IDs de productos guardados/favoritos';
COMMENT ON COLUMN user_data.visited_products IS 'Array de IDs de productos visitados (historial)';
COMMENT ON COLUMN user_data.read_blogs IS 'Array de UUIDs de blogs leídos';
COMMENT ON COLUMN user_data.preferences IS 'Preferencias del usuario en formato JSON';
COMMENT ON COLUMN user_data.total_product_views IS 'Contador total de productos visitados';
COMMENT ON COLUMN user_data.total_blog_reads IS 'Contador total de blogs leídos';

-- Funciones auxiliares para gestionar arrays

-- Agregar producto a favoritos (evita duplicados)
CREATE OR REPLACE FUNCTION add_favorite_product(p_user_id UUID, p_product_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE user_data
  SET favorite_products = array_append(
    CASE 
      WHEN p_product_id = ANY(favorite_products) THEN favorite_products
      ELSE favorite_products
    END,
    CASE 
      WHEN p_product_id = ANY(favorite_products) THEN NULL
      ELSE p_product_id
    END
  )
  WHERE user_id = p_user_id AND NOT (p_product_id = ANY(favorite_products));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar producto de favoritos
CREATE OR REPLACE FUNCTION remove_favorite_product(p_user_id UUID, p_product_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE user_data
  SET favorite_products = array_remove(favorite_products, p_product_id)
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar producto visitado (mantiene los últimos 50)
CREATE OR REPLACE FUNCTION add_visited_product(p_user_id UUID, p_product_id TEXT)
RETURNS void AS $$
DECLARE
  updated_array TEXT[];
BEGIN
  -- Obtener array actualizado sin duplicados y con el nuevo producto al inicio
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      array_prepend(p_product_id, array_remove(visited_products, p_product_id))
    ) LIMIT 50
  ) INTO updated_array
  FROM user_data
  WHERE user_id = p_user_id;
  
  -- Actualizar la tabla
  UPDATE user_data
  SET 
    visited_products = updated_array,
    total_product_views = total_product_views + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar blog leído (mantiene los últimos 100)
CREATE OR REPLACE FUNCTION add_read_blog(p_user_id UUID, p_blog_id UUID)
RETURNS void AS $$
DECLARE
  updated_array UUID[];
BEGIN
  -- Obtener array actualizado sin duplicados y con el nuevo blog al inicio
  SELECT ARRAY(
    SELECT DISTINCT unnest(
      array_prepend(p_blog_id, array_remove(read_blogs, p_blog_id))
    ) LIMIT 100
  ) INTO updated_array
  FROM user_data
  WHERE user_id = p_user_id;
  
  -- Actualizar la tabla
  UPDATE user_data
  SET 
    read_blogs = updated_array,
    total_blog_reads = total_blog_reads + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
