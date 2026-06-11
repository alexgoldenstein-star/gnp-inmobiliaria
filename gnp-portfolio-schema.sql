-- ============================================================
-- G&P — Portfolio de proyectos comercializados + contenido editable
-- ============================================================

-- ─── TABLA: portfolio_proyectos ─────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_proyectos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre      TEXT NOT NULL,
  barrio      TEXT,
  direccion   TEXT,
  anio        INTEGER,
  tipo        TEXT,               -- 'Departamentos', 'PH y Departamentos', etc
  unidades    INTEGER,
  estado      TEXT DEFAULT 'Entregado',
  descripcion TEXT,
  foto_url    TEXT,               -- foto principal
  fotos       TEXT[] DEFAULT '{}',
  visible     BOOLEAN DEFAULT TRUE,
  orden       INTEGER DEFAULT 0,
  creado_en   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: landing_content — contenido editable desde admin ─
CREATE TABLE IF NOT EXISTS landing_content (
  clave       TEXT PRIMARY KEY,
  titulo      TEXT,
  subtitulo   TEXT,
  descripcion TEXT,
  imagen_url  TEXT,
  activo      BOOLEAN DEFAULT TRUE,
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Contenido inicial editable
INSERT INTO landing_content (clave, titulo, subtitulo, descripcion) VALUES
  ('hero_titulo',    'INVERTÍ EN TU FUTURO EN BUENOS AIRES', null, null),
  ('hero_subtitulo', 'Las mejores propiedades del mercado en un solo lugar. Acompañamos cada etapa, de la búsqueda al cierre.', null, null),
  ('nosotros_titulo','TU ASESOR DE CONFIANZA', null, null),
  ('nosotros_desc',  'Somos una inmobiliaria con años de experiencia en el mercado de CABA y GBA. Accedés a las mejores propiedades del mercado, con acompañamiento real en cada etapa del proceso.', null, null),
  ('stat_1_num',     '12+', 'Años en el mercado', null),
  ('stat_2_num',     '180+', 'Operaciones cerradas', null),
  ('stat_3_num',     '40+', 'Propiedades activas', null),
  ('whatsapp',       '5491112345678', null, null),
  ('email',          'info@gnpinmobiliaria.com.ar', null, null),
  ('instagram',      '@gnpinmobiliaria', null, null),
  ('direccion',      'Buenos Aires, CABA, Argentina', null, null),
  ('matricula',      '', null, null)
ON CONFLICT (clave) DO NOTHING;

-- Proyectos de ejemplo (reemplazá con los reales)
INSERT INTO portfolio_proyectos (nombre, barrio, anio, tipo, unidades, descripcion, visible) VALUES
  ('Proyecto Palermo Norte', 'Palermo', 2023, 'Departamentos', 12, 'Edificio residencial de 8 pisos con amenities completos. 12 unidades de 1, 2 y 3 ambientes a estrenar.', true),
  ('Torre Villa Crespo', 'Villa Crespo', 2022, 'PH y Departamentos', 8, 'Desarrollo boutique con 8 unidades de diseño en una de las zonas de mayor crecimiento de CABA.', true),
  ('Complejo Almagro', 'Almagro', 2024, 'Departamentos', 20, 'Complejo residencial con 20 unidades, sum, gimnasio y terraza panorámica.', true)
ON CONFLICT DO NOTHING;
