'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Grid3x3 } from 'lucide-react'

export default function GaleriaLightbox({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (i: number) => { setIndex(i); setOpen(true) }
  const close = useCallback(() => setOpen(false), [])
  const next = useCallback(() => setIndex(i => (i + 1) % fotos.length), [fotos.length])
  const prev = useCallback(() => setIndex(i => (i - 1 + fotos.length) % fotos.length), [fotos.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [open, close, next, prev])

  if (!fotos || fotos.length === 0) {
    return (
      <div className="bg-[#F5F4F2] h-[50vh] md:h-[60vh] flex items-center justify-center text-[100px] opacity-10">
        🏢
      </div>
    )
  }

  return (
    <>
      {/* Grid de fotos estilo Airbnb */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-1 h-full">
          {/* Foto principal grande */}
          <div className="md:col-span-2 md:row-span-2 cursor-pointer overflow-hidden" onClick={() => openAt(0)}>
            <img src={fotos[0]} alt={titulo} className="w-full h-full object-cover hover:brightness-95 transition-all" />
          </div>
          {/* 4 fotos secundarias */}
          {fotos.slice(1, 5).map((foto, i) => (
            <div key={foto} className="hidden md:block cursor-pointer overflow-hidden relative" onClick={() => openAt(i + 1)}>
              <img src={foto} alt={`${titulo} ${i + 2}`} className="w-full h-full object-cover hover:brightness-95 transition-all" />
              {i === 3 && fotos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-[15px]">
                  +{fotos.length - 5} fotos
                </div>
              )}
            </div>
          ))}
        </div>

        {fotos.length > 1 && (
          <button onClick={() => openAt(0)}
            className="absolute bottom-4 right-4 bg-white text-[#111] text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 hover:bg-[#F5F4F2] transition-colors">
            <Grid3x3 size={14} /> Ver todas las fotos ({fotos.length})
          </button>
        )}
      </div>

      {/* Lightbox modal */}
      {open && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <button onClick={close} className="absolute top-5 right-5 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10">
            <X size={28} />
          </button>
          <div className="absolute top-5 left-5 text-white text-[14px] font-medium z-10">
            {index + 1} / {fotos.length}
          </div>

          {fotos.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-3 md:left-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10">
                <ChevronLeft size={32} />
              </button>
              <button onClick={next} className="absolute right-3 md:right-6 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10">
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img src={fotos[index]} alt={`${titulo} ${index + 1}`} className="max-w-[90vw] max-h-[85vh] object-contain" />

          {/* Thumbnails strip */}
          {fotos.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4">
              {fotos.map((f, i) => (
                <button key={f} onClick={() => setIndex(i)}
                  className={`w-14 h-14 shrink-0 rounded-md overflow-hidden border-2 transition-all ${i === index ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={f} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
