-- ============================================================
-- G&P — Sprint 2: Marketplace de inmobiliarias socias
-- Correr en Supabase SQL Editor (adicional a los anteriores)
-- ============================================================

-- ─── PLANES disponibles ──────────────────────────────────────
-- free:       5 publicaciones, sin destacados
-- starter:    15 publicaciones, 2 destacados/mes
-- pro:        ilimitadas, 10 destacados/mes, badge verificado
-- enterprise: todo ilimitado + soporte prioritario

-- La tabla inmobiliarias ya existe del schema base.
-- Agregamos columnas que faltan:

ALTER TABLE inmobiliarias 
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS descripcion TEXT,
  ADD COLUMN IF NOT EXISTS sitio_web TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS direccion TEXT,
  ADD COLUMN IF NOT EXISTS barrios_operacion TEXT[],
  ADD COLUMN IF NOT EXISTS plan_vencimiento TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_precio_mensual NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS destacados_usados INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS destacados_limite INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS publicaciones_limite INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS saldo_pendiente NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS token_acceso TEXT UNIQUE,   -- Para login del vendedor
  ADD COLUMN IF NOT EXISTS aprobada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS aprobada_por UUID REFERENCES usuarios_portal(id);

-- ─── SOLICITUDES de alta al marketplace ──────────────────────
CREATE TABLE IF NOT EXISTS marketplace_solicitudes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  email           TEXT NOT NULL,
  telefono        TEXT,
  nombre_empresa  TEXT,
  sitio_web       TEXT,
  mensaje         TEXT,
  plan_interes    TEXT DEFAULT 'starter',
  estado          TEXT DEFAULT 'pendiente' 
                  CHECK (estado IN ('pendiente','aprobada','rechazada','contactada')),
  notas_internas  TEXT,
  creada_en       TIMESTAMPTZ DEFAULT NOW(),
  procesada_en    TIMESTAMPTZ,
  procesada_por   UUID REFERENCES usuarios_portal(id)
);

-- ─── OPERACIONES / COMISIONES ────────────────────────────────
CREATE TABLE IF NOT EXISTS operaciones (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  propiedad_id      UUID REFERENCES propiedades(id),
  lead_id           UUID REFERENCES leads(id),
  inmobiliaria_id   UUID REFERENCES inmobiliarias(id),   -- inmobiliaria que publicó
  referidor_id      UUID REFERENCES inmobiliarias(id),   -- inmobiliaria que trajo el lead (interior)
  tipo              TEXT CHECK (tipo IN ('venta','alquiler','referido')),
  precio_operacion  NUMERIC(14,2),
  moneda            TEXT DEFAULT 'USD',
  comision_total_pct NUMERIC(4,2),
  comision_gnp      NUMERIC(12,2),
  comision_socia    NUMERIC(12,2),
  comision_referido NUMERIC(12,2),
  estado            TEXT DEFAULT 'en_proceso'
                    CHECK (estado IN ('en_proceso','cerrada','cancelada')),
  notas             TEXT,
  fecha_cierre      DATE,
  creada_en         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON marketplace_solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_operaciones_inmobiliaria ON operaciones(inmobiliaria_id);
CREATE INDEX IF NOT EXISTS idx_inmobiliarias_plan ON inmobiliarias(plan, activa);

-- ─── FUNCIÓN: stats del marketplace ──────────────────────────
CREATE OR REPLACE FUNCTION marketplace_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'socias_activas',     (SELECT COUNT(*) FROM inmobiliarias WHERE activa=TRUE AND tipo='socia'),
    'socias_pro',         (SELECT COUNT(*) FROM inmobiliarias WHERE plan='pro' AND activa=TRUE),
    'props_marketplace',  (SELECT COUNT(*) FROM propiedades WHERE inmobiliaria_id IS NOT NULL AND publicada=TRUE),
    'solicitudes_pend',   (SELECT COUNT(*) FROM marketplace_solicitudes WHERE estado='pendiente'),
    'operaciones_mes',    (SELECT COUNT(*) FROM operaciones WHERE creada_en > DATE_TRUNC('month', NOW()))
  );
$$ LANGUAGE SQL SECURITY DEFINER;
