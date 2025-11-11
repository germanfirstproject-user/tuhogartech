-- Tabla de usuarios para autenticación simple
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user' o 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer su propio usuario
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.email() = email);

-- Política: Cualquiera puede leer la tabla (para validaciones públicas)
CREATE POLICY "Public read" ON users
  FOR SELECT USING (true);

-- Política: Solo admin puede insertar/actualizar/eliminar
CREATE POLICY "Admin only insert" ON users
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE email = auth.email()) = 'admin'
  );

CREATE POLICY "Admin only update" ON users
  FOR UPDATE USING (
    (SELECT role FROM users WHERE email = auth.email()) = 'admin'
  ) WITH CHECK (
    (SELECT role FROM users WHERE email = auth.email()) = 'admin'
  );

CREATE POLICY "Admin only delete" ON users
  FOR DELETE USING (
    (SELECT role FROM users WHERE email = auth.email()) = 'admin'
  );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
