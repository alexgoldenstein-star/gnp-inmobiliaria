'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Star, Loader2, Trash2, GripVertical } from 'lucide-react'

interface FotosUploaderProps {
  fotos: string[]
  fotoPrincipal: string
  onChange: (fotos: string[], principal: string) => void
}

export default function FotosUploader({ fotos, fotoPrincipal, onChange }: FotosUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: File[]) => {
    if (!files.length) return
    setUploading(true)
    setProgreso(0)
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Validar tipo y tamaño
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} supera los 10MB`); continue }

      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) urls.push(data.url)
      setProgreso(Math.round(((i + 1) / files.length) * 100))
    }
    const nuevas = [...fotos, ...urls]
    const principal = fotoPrincipal || nuevas[0] || ''
    onChange(nuevas, principal)
    setUploading(false)
    setProgreso(0)
    if (inputRef.current) inputRef.current.value = ''
  }, [fotos, fotoPrincipal, onChange])

  // Drop zone
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    uploadFiles(files)
  }, [uploadFiles])

  // Reordenar con drag & drop entre imágenes
  const handleImgDragStart = (i: number) => setDraggingIndex(i)
  const handleImgDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    setDragOverIndex(i)
  }
  const handleImgDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggingIndex === null || draggingIndex === targetIndex) return
    const arr = [...fotos]
    const [moved] = arr.splice(draggingIndex, 1)
    arr.splice(targetIndex, 0, moved)
    onChange(arr, fotoPrincipal)
    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  const eliminar = (url: string) => {
    const nuevas = fotos.filter(f => f !== url)
    const principal = url === fotoPrincipal ? (nuevas[0] ?? '') : fotoPrincipal
    onChange(nuevas, principal)
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-5
          ${dragOver ? 'border-[#D85A30] bg-[#FDF3EF] scale-[1.01]' : 'border-[#E2E0DC] hover:border-[#D85A30] hover:bg-[#FAFAF9]'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#D85A30]" />
            <div className="w-48 bg-[#E2E0DC] rounded-full h-2">
              <div className="bg-[#D85A30] h-2 rounded-full transition-all" style={{ width: `${progreso}%` }} />
            </div>
            <span className="text-[13px] text-[#555]">Subiendo {progreso}%...</span>
          </div>
        ) : (
          <>
            <Upload size={28} className={`mx-auto mb-2 transition-colors ${dragOver ? 'text-[#D85A30]' : 'text-[#aaa]'}`} />
            <p className="text-[14px] font-medium text-[#222]">
              {dragOver ? '¡Soltá las fotos acá!' : 'Arrastrá fotos acá o hacé clic para seleccionar'}
            </p>
            <p className="text-[12px] text-[#888] mt-1">JPG, PNG, WEBP · Máx 10MB por foto · Múltiples a la vez</p>
          </>
        )}
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => uploadFiles(Array.from(e.target.files ?? []))} />
      </div>

      {/* Grid de fotos reordenables */}
      {fotos.length > 0 && (
        <>
          <p className="text-[12px] text-[#888] mb-3 flex items-center gap-1.5">
            <GripVertical size={13} /> Arrastrá las fotos para reordenarlas · La primera es la principal
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {fotos.map((url, i) => (
              <div
                key={url}
                draggable
                onDragStart={() => handleImgDragStart(i)}
                onDragOver={e => handleImgDragOver(e, i)}
                onDrop={e => handleImgDrop(e, i)}
                onDragEnd={() => { setDraggingIndex(null); setDragOverIndex(null) }}
                className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all
                  ${url === fotoPrincipal ? 'border-[#D85A30] ring-2 ring-[#D85A30]/20' : 'border-[#E2E0DC] hover:border-[#D85A30]/50'}
                  ${draggingIndex === i ? 'opacity-40 scale-95' : ''}
                  ${dragOverIndex === i && draggingIndex !== i ? 'scale-105 border-[#D85A30]' : ''}`}
              >
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />

                {/* Badge principal */}
                {url === fotoPrincipal && (
                  <div className="absolute top-1.5 left-1.5 bg-[#D85A30] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={8} fill="white" /> Principal
                  </div>
                )}

                {/* Número */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {i + 1}
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {url !== fotoPrincipal && (
                    <button type="button" onClick={() => onChange(fotos, url)}
                      className="bg-[#D85A30] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 w-full justify-center">
                      <Star size={9} /> Principal
                    </button>
                  )}
                  <button type="button" onClick={() => eliminar(url)}
                    className="bg-red-500/90 hover:bg-red-600 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 w-full justify-center">
                    <Trash2 size={10} /> Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Botón agregar más */}
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[#E2E0DC] hover:border-[#D85A30] flex items-center justify-center cursor-pointer transition-colors group"
            >
              <div className="text-center">
                <Upload size={20} className="mx-auto mb-1 text-[#ccc] group-hover:text-[#D85A30] transition-colors" />
                <span className="text-[11px] text-[#ccc] group-hover:text-[#D85A30] transition-colors">Agregar</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
