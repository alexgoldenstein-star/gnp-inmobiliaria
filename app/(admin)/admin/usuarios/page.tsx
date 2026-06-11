'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, UserCheck, UserX, Loader2, X, Save } from 'lucide-react'

const ROL_COLOR: Record<string, string> = {
  admin:    'bg-red-100 text-red-700',
  empleado: 'bg-blue-100 text-blue-700',
  vendedor: 'bg-purple-100 text-purple-700',
  cliente:  'bg-gray-100 text-gray-500',
}
const ROL_LABEL: Record<string, string> = {
  admin: 'Administrador', empleado: 'Empleado', vendedor: 'Vendedor / Inmobiliaria', cliente: 'Cliente',
}

interface Usuario {
  id: string; nombre: string; email: string; rol: string
  activo: boolean; telefono?: string; ultimo_login?: string; creado_en: string
}

const EMPTY_FORM = { nombre: '', email: '', password: '', rol: 'empleado', telefono: '' }

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'nuevo' | { usuario: Usuario } | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const res = await fetch('/api/usuarios')
    const data = await res.json()
    setUsuarios(data.usuarios ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNuevo = () => { setForm(EMPTY_FORM); setError(''); setModal('nuevo') }
  const openEditar = (u: Usuario) => {
    setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol, telefono: u.telefono ?? '' })
    setError('')
    setModal({ usuario: u })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const esNuevo = modal === 'nuevo'
      const url = esNuevo ? '/api/usuarios' : `/api/usuarios/${(modal as any).usuario.id}`
      const method = esNuevo ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setModal(null)
      load()
    } catch { setError('Error guardando') }
    finally { setSaving(false) }
  }

  const toggleActivo = async (u: Usuario) => {
    await fetch(`/api/usuarios/${u.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...u, activo: !u.activo }),
    })
    load()
  }

  const f = 'border border-[#E2E0DC] rounded-md px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#D85A30] w-full bg-white'
  const lbl = 'text-[11px] font-semibold uppercase tracking-wide text-[#222] block mb-1.5'

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[32px] uppercase tracking-tight">Usuarios</h1>
          <p className="text-[14px] text-[#555] mt-1">Gestión de accesos y roles del portal</p>
        </div>
        <button onClick={openNuevo}
          className="flex items-center gap-2 bg-[#D85A30] text-white font-semibold text-[14px] px-5 py-2.5 rounded-md hover:bg-[#B84A22] transition-colors">
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {/* Leyenda de roles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(ROL_LABEL).map(([rol, label]) => (
          <div key={rol} className="bg-white border border-[#E2E0DC] rounded-xl p-4">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ROL_COLOR[rol]}`}>{rol}</span>
            <p className="text-[12px] text-[#555] mt-2 leading-relaxed">{
              rol === 'admin' ? 'Acceso total al panel' :
              rol === 'empleado' ? 'Propiedades y leads' :
              rol === 'vendedor' ? 'Sus propiedades, sin leads' :
              'Solo portal público'
            }</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#E2E0DC] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-[#555]">
            <Loader2 size={18} className="animate-spin" /> Cargando usuarios...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F5F4F2] border-b border-[#E2E0DC]">
              <tr>
                {['Usuario', 'Rol', 'Teléfono', 'Último acceso', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E0DC]">
              {usuarios.map(u => (
                <tr key={u.id} className={`hover:bg-[#FAFAFA] transition-colors ${!u.activo ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-[14px]">{u.nombre}</div>
                    <div className="text-[12px] text-[#888]">{u.email}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ROL_COLOR[u.rol]}`}>{u.rol}</span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#555]">{u.telefono ?? '—'}</td>
                  <td className="px-5 py-4 text-[12px] text-[#888]">
                    {u.ultimo_login ? new Date(u.ultimo_login).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' }) : 'Nunca'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditar(u)} title="Editar"
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F5F4F2] transition-colors text-[#555]">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => toggleActivo(u)} title={u.activo ? 'Desactivar' : 'Activar'}
                        className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${u.activo ? 'hover:bg-red-50 text-red-400' : 'hover:bg-green-50 text-green-500'}`}>
                        {u.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-[22px] uppercase">
                {modal === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}
              </h2>
              <button onClick={() => setModal(null)} className="p-1.5 hover:bg-[#F5F4F2] rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className={lbl}>Nombre completo *</label>
                <input required className={f} value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))} placeholder="Juan García" />
              </div>
              <div>
                <label className={lbl}>Email *</label>
                <input required type="email" className={f} value={form.email}
                  onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  placeholder="juan@email.com"
                  disabled={modal !== 'nuevo'}
                />
              </div>
              <div>
                <label className={lbl}>{modal === 'nuevo' ? 'Contraseña *' : 'Nueva contraseña (dejar vacío para no cambiar)'}</label>
                <input type="password" className={f} value={form.password}
                  onChange={e => setForm(p => ({...p, password: e.target.value}))}
                  placeholder="••••••••"
                  required={modal === 'nuevo'}
                  minLength={8}
                />
                {modal === 'nuevo' && <p className="text-[11px] text-[#888] mt-1">Mínimo 8 caracteres</p>}
              </div>
              <div>
                <label className={lbl}>Rol *</label>
                <select required className={f} value={form.rol} onChange={e => setForm(p => ({...p, rol: e.target.value}))}>
                  <option value="admin">Administrador — acceso total</option>
                  <option value="empleado">Empleado — propiedades y leads</option>
                  <option value="vendedor">Vendedor / Inmobiliaria socia</option>
                  <option value="cliente">Cliente — solo portal público</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Teléfono / WhatsApp</label>
                <input className={f} value={form.telefono} onChange={e => setForm(p => ({...p, telefono: e.target.value}))} placeholder="54911..." />
              </div>
              {error && <p className="text-red-500 text-[13px]">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#D85A30] hover:bg-[#B84A22] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> Guardar</>}
                </button>
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 border border-[#E2E0DC] rounded-lg hover:border-[#111] transition-colors text-[14px] font-medium">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
