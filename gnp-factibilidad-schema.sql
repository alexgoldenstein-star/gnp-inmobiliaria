-- ============================================================
-- G&P — Módulo de factibilidad de terrenos
-- Basado en el Código Urbanístico de CABA (Ley 6.099 — CUr)
-- Sistema de Unidades de Edificabilidad (NO FOT/FOS)
-- ============================================================

-- Si ya corriste una versión anterior con columnas fot/fos, borrá la tabla primero:
-- DROP TABLE IF EXISTS factibilidad_solicitudes CASCADE;

CREATE TABLE IF NOT EXISTS factibilidad_solicitudes (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre            TEXT NOT NULL,
  email             TEXT,
  telefono          TEXT NOT NULL,
  direccion         TEXT NOT NULL,
  barrio            TEXT,
  superficie_m2     NUMERIC(10,2),
  frente_m          NUMERIC(6,2),

  -- Resultado del cálculo automático (Código Urbanístico — Unidades de Edificabilidad)
  unidad_edificabilidad        TEXT,         -- código: CA, CM, USAA, USAM, USAB2, USAB1
  unidad_edificabilidad_nombre TEXT,         -- nombre completo de la unidad
  altura_maxima_m              NUMERIC(5,2), -- altura máxima permitida (plano límite)
  pisos_estimados               INTEGER,      -- cantidad de niveles (PB + pisos + retiros)
  m2_cubiertos_total            NUMERIC(10,2),-- total construible estimado
  m2_vendible_estimado          NUMERIC(10,2),-- ponderado, descontando áreas comunes
  incidencia_estimada_usd       NUMERIC(10,2),-- USD por m² vendible, según barrio
  valor_terreno_estimado_usd    NUMERIC(14,2),-- valoración final del terreno

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
CREATE INDEX IF NOT EXISTS idx_factibilidad_unidad ON factibilidad_solicitudes(unidad_edificabilidad);

-- Stats reales para mostrar en el sitio (se actualiza desde admin)
INSERT INTO landing_content (clave, titulo, subtitulo) VALUES
  ('terrenos_stat_analisis', '0', 'Análisis entregados'),
  ('terrenos_stat_desarrolladores', '0', 'Desarrolladores en la red')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================
-- REFERENCIA: Unidades de Edificabilidad del Código Urbanístico
-- (Título 6.2 — Ley 6.099, valores de plano límite sin sobrerecorrido)
-- ============================================================
-- CA     (Corredor Alto)   → 38,00 m  | PB + 12 pisos + 2 retiros | Basamento 6m
-- CM     (Corredor Medio)  → 31,20 m  | PB + 10 pisos + 2 retiros | Basamento 6m
-- USAA   (Sust. Alta)      → 22,80 m  | PB + 7 pisos + 2 retiros  | Sin basamento
-- USAM   (Sust. Media)     → 17,20 m  | PB + 5 pisos + 2 retiros  | Sin basamento
-- USAB2  (Sust. Baja 2)    → 11,60 m  | PB + 3 pisos + 1 retiro   | Sin basamento
-- USAB1  (Sust. Baja 1)    →  9,00 m  | PB + 2 pisos              | Sin basamento
--
-- La unidad aplicable a cada parcela se confirma en:
-- mapa.buenosaires.gob.ar → "Información para tu proyecto" (plancheta catastral)
