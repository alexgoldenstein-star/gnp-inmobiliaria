export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display font-black text-[42px] uppercase tracking-tight mb-2">Política de Privacidad</h1>
      <p className="text-[13px] text-[#888] mb-10">Última actualización: Junio 2025</p>
      <div className="space-y-8 text-[#444]">
        {[
          ['1. Responsable del tratamiento', 'G&P Negocios Inmobiliarios, con domicilio en CABA, Argentina, es responsable del tratamiento de los datos personales recopilados a través de este portal.'],
          ['2. Datos que recopilamos', 'Recopilamos: nombre completo, dirección de email, número de teléfono, datos de la empresa (para inmobiliarias), historial de búsquedas y consultas realizadas en el portal, y datos de navegación (cookies técnicas).'],
          ['3. Finalidad del tratamiento', 'Los datos se utilizan para: gestionar el acceso al portal, facilitar la comunicación entre usuarios y asesores, mejorar los servicios ofrecidos, enviar información relevante sobre el mercado inmobiliario (con consentimiento), y cumplir obligaciones legales.'],
          ['4. Base legal', 'El tratamiento se basa en el consentimiento del usuario al registrarse y aceptar estos términos, y en el interés legítimo de G&P para prestar sus servicios.'],
          ['5. Compartir datos', 'No vendemos datos personales a terceros. Podemos compartir datos con inmobiliarias socias en el marco de una consulta específica realizada por el usuario, y con proveedores de servicios tecnológicos que procesan datos en nuestro nombre.'],
          ['6. Derechos del usuario', 'El usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición y portabilidad de sus datos contactando a info@gnpinmobiliaria.com.ar. Responderemos en un plazo máximo de 30 días.'],
          ['7. Seguridad', 'Implementamos medidas técnicas y organizativas para proteger los datos personales contra acceso no autorizado, pérdida o destrucción.'],
          ['8. Cookies', 'Utilizamos cookies técnicas necesarias para el funcionamiento del portal. No utilizamos cookies de seguimiento de terceros sin consentimiento explícito.'],
          ['9. Legislación aplicable', 'Este tratamiento se rige por la Ley 25.326 de Protección de Datos Personales de la República Argentina.'],
        ].map(([title, content]) => (
          <div key={title}>
            <h2 className="font-semibold text-[16px] text-[#111] mb-2">{title}</h2>
            <p className="text-[14px] leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
