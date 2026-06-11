export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display font-black text-[42px] uppercase tracking-tight mb-2">Términos y Condiciones</h1>
      <p className="text-[13px] text-[#888] mb-10">Última actualización: Junio 2025</p>
      <div className="prose prose-sm max-w-none space-y-8 text-[#444]">
        {[
          ['1. Aceptación de los Términos', 'Al acceder y usar el portal de G&P Negocios Inmobiliarios, el usuario acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.'],
          ['2. Descripción del Servicio', 'G&P Negocios Inmobiliarios opera un portal inmobiliario que permite la búsqueda, publicación y gestión de propiedades en Argentina. El portal actúa como intermediario entre propietarios, inmobiliarias y potenciales compradores o arrendatarios.'],
          ['3. Registro de Usuarios', 'Para acceder a determinadas funcionalidades del portal, el usuario debe registrarse proporcionando información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas bajo su cuenta.'],
          ['4. Publicación de Propiedades', 'Las inmobiliarias socias y usuarios habilitados pueden publicar propiedades en el portal, comprometiéndose a: (a) proporcionar información veraz y actualizada; (b) contar con autorización del propietario; (c) no publicar contenido engañoso, ilegal o que viole derechos de terceros; (d) mantener actualizado el estado de disponibilidad de cada propiedad.'],
          ['5. Comisiones y Operaciones', 'Las condiciones de comisiones y honorarios se acuerdan individualmente entre G&P Negocios Inmobiliarios y cada inmobiliaria socia mediante acuerdo escrito separado. G&P se reserva el derecho de modificar estas condiciones con previo aviso de 30 días.'],
          ['6. Propiedad Intelectual', 'Todo el contenido del portal, incluyendo textos, imágenes, logotipos y software, es propiedad de G&P Negocios Inmobiliarios o de sus licenciantes. Queda prohibida su reproducción sin autorización expresa.'],
          ['7. Limitación de Responsabilidad', 'G&P Negocios Inmobiliarios no garantiza la exactitud de la información publicada por terceros y no será responsable por daños derivados del uso del portal o de operaciones realizadas entre usuarios. La plataforma actúa exclusivamente como intermediaria.'],
          ['8. Privacidad', 'El tratamiento de datos personales se rige por nuestra Política de Privacidad, que forma parte integrante de estos Términos.'],
          ['9. Modificaciones', 'G&P Negocios Inmobiliarios se reserva el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor al publicarse en el portal. El uso continuado del portal implica la aceptación de los nuevos términos.'],
          ['10. Jurisdicción', 'Estos Términos se rigen por las leyes de la República Argentina. Para cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.'],
        ].map(([title, content]) => (
          <div key={title}>
            <h2 className="font-semibold text-[16px] text-[#111] mb-2">{title}</h2>
            <p className="text-[14px] leading-relaxed">{content}</p>
          </div>
        ))}
        <div className="pt-6 border-t border-[#E2E0DC] text-[13px] text-[#888]">
          Consultas: <a href="mailto:info@gnpinmobiliaria.com.ar" className="text-[#D85A30]">info@gnpinmobiliaria.com.ar</a>
        </div>
      </div>
    </div>
  )
}
