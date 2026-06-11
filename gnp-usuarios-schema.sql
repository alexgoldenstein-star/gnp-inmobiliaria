-- ============================================================
-- G&P — Sistema de usuarios con roles
-- Correr en Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLA: usuarios_portal
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios_portal (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,   -- hash bcrypt generado por la API
  rol             TEXT NOT NULL DEFAULT 'cliente' 
                  CHECK (rol IN ('admin','empleado','vendedor','cliente')),
  avatar_url      TEXT,
  telefono        TEXT,
  inmobiliaria_id UUID REFERENCES inmobiliarias(id) ON DELETE SET NULL,
  activo          BOOLEAN DEFAULT TRUE,
  ultimo_login    TIMESTAMPTZ,
  creado_en       TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios_portal(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol   ON usuarios_portal(rol);

-- ─────────────────────────────────────────────────────────────
-- PERMISOS POR ROL
-- admin:    todo — propiedades, leads, marketplace, config, usuarios
-- empleado: propiedades + leads — sin config ni gestión de usuarios  
-- vendedor: solo sus propias propiedades — sin leads ajenos
-- cliente:  portal público únicamente
-- ─────────────────────────────────────────────────────────────
