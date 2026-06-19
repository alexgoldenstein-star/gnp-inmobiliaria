-- ============================================================
-- G&P — Módulo de factibilidad de terrenos (estilo Terres)
-- ============================================================

CREATE TABLE IF NOT EXISTS factibilidad_solicitudes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre            TEXT NOT NULL,
  email             TEXT NOT NULL,
  telefono          TEXT NOT NULL,
  direccion         TEXT NOT NULL,
  barrio            TEXT,
  superficie_m2     NUMERIC(10,2),
  frente_m          NUMERIC(6,2),

  -- Resultado del cálculo automático
  zonificacion      TEXT,              -- ej "USAA - Corredor de Centralidad"
  fot               NUMERIC(4,2),      -- Factor de Ocupación Total
  fos               NUMERIC(4,2),      -- Factor de Ocupación del Suelo
  altura_max_m      NUMERIC(6,2),
  m2_construibles   NUMERIC(10,2),
  incidencia_estimada_usd NUMERIC(14,2),
  valor_terreno_estimado_usd NUMERIC(14,2),

  -- Estado del lead
  estado            TEXT DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','calculado','contactado','en_negociacion','cerrado','descartado')),
  notas             TEXT,
  fuente_calculo    TEXT DEFAULT 'estimado',  -- 'estimado' | 'catastro_caba' | 'manual'

  creada_en         TIMESTAMPTZ DEFAULT NOW(),
  calculada_en      TIMESTAMPTZ,
  asignado_a        UUID REFERENCES usuarios_portal(id)
);

CREATE INDEX IF NOT EXISTS idx_factibilidad_estado ON factibilidad_solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_factibilidad_barrio ON factibilidad_solicitudes(barrio);

-- Stats reales para mostrar en el sitio (se actualiza desde admin)
INSERT INTO landing_content (clave, titulo, subtitulo) VALUES
  ('terrenos_stat_analisis', '0', 'Análisis entregados'),
  ('terrenos_stat_desarrolladores', '0', 'Desarrolladores en la red')
ON CONFLICT (clave) DO NOTHING;
