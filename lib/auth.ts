import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from './supabase'

export type UserRole = 'admin' | 'empleado' | 'vendedor' | 'cliente'

export interface SessionUser {
  id: string
  email: string
  nombre: string
  rol: UserRole
  inmobiliaria_id?: string
}

const COOKIE = 'gnp_session'
const COOKIE_MAX = 60 * 60 * 24 * 30

// ─── Crear sesión ────────────────────────────────────────────────
export async function createSession(user: SessionUser) {
  const store = await cookies()
  store.set(COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX,
    path: '/',
  })
}

// ─── Leer sesión ─────────────────────────────────────────────────
export async function getSession(): Promise<SessionUser | null> {
  try {
    const store = await cookies()
    const val = store.get(COOKIE)?.value
    if (!val) return null
    return JSON.parse(val) as SessionUser
  } catch {
    return null
  }
}

// ─── Cerrar sesión ───────────────────────────────────────────────
export async function clearSession() {
  const store = await cookies()
  store.delete(COOKIE)
}

// ─── Proteger rutas ──────────────────────────────────────────────
export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const user = await getSession()
  if (!user) redirect('/login')
  if (allowedRoles && !allowedRoles.includes(user.rol)) redirect('/acceso-denegado')
  return user
}

// ─── Login con email + password via Supabase ─────────────────────
export async function loginWithCredentials(email: string, password: string): Promise<SessionUser | null> {
  const db = getSupabaseAdmin()

  // Buscar usuario en tabla usuarios_portal
  const { data: usuario } = await db
    .from('usuarios_portal')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('activo', true)
    .single()

  if (!usuario) return null

  // Verificar password con bcrypt
  const bcrypt = await import('bcryptjs')
  const ok = await bcrypt.compare(password, usuario.password_hash)
  if (!ok) return null

  // Actualizar último login
  await db.from('usuarios_portal').update({ ultimo_login: new Date().toISOString() }).eq('id', usuario.id)

  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol as UserRole,
    inmobiliaria_id: usuario.inmobiliaria_id,
  }
}

// ─── Permisos por rol ────────────────────────────────────────────
export const PERMISOS = {
  admin:    { verAdmin: true,  editarPropiedades: true,  verLeads: true,  moderarMarketplace: true, verConfig: true },
  empleado: { verAdmin: true,  editarPropiedades: true,  verLeads: true,  moderarMarketplace: false, verConfig: false },
  vendedor: { verAdmin: false, editarPropiedades: true,  verLeads: false, moderarMarketplace: false, verConfig: false },
  cliente:  { verAdmin: false, editarPropiedades: false, verLeads: false, moderarMarketplace: false, verConfig: false },
}
