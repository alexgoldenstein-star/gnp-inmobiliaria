# G&P Negocios Inmobiliarios — Plataforma

## Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL + Auth + RLS)
- **Imágenes:** Cloudinary
- **Deploy:** Vercel
- **Emails:** Resend

## Setup inicial (5 pasos)

### 1. Clonar el repo
```bash
git clone https://github.com/TU_USUARIO/gnp-inmobiliaria.git
cd gnp-inmobiliaria
npm install
```

### 2. Configurar Supabase
1. Ir a [supabase.com](https://supabase.com) → New project
2. Nombre: `gnp-inmobiliaria`
3. Correr el SQL en `gnp-supabase-schema.sql` en el SQL Editor
4. Copiar URL y keys en `.env.local`

### 3. Configurar Cloudinary
1. Ir a [cloudinary.com](https://cloudinary.com) → crear cuenta gratis
2. Copiar Cloud Name, API Key y API Secret en `.env.local`

### 4. Variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 5. Correr en desarrollo
```bash
npm run dev
# → http://localhost:3000
```

## Deploy en Vercel
```bash
# Primera vez
npx vercel

# Con repo conectado (automático en cada push)
git push origin main
```

## Estructura de URLs
- `/` → Home pública
- `/propiedades` → Listado con filtros
- `/propiedades/[slug]` → Ficha de propiedad
- `/admin` → Dashboard admin
- `/admin/propiedades` → Gestión de propiedades
- `/admin/leads` → CRM de leads
- `/admin/nueva` → Alta de propiedad

## Roadmap
- [ ] Sprint 1 ✅ — Sitio público + admin + leads
- [ ] Sprint 2 — Marketplace de inmobiliarias socias
- [ ] Sprint 3 — Red del interior + generador IA + Ads
