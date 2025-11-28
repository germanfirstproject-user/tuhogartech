import styles from './privacidad.module.css';

export const metadata = {
  title: 'Política de Privacidad - TuHogarTech',
  description: 'Política de privacidad y protección de datos personales conforme al RGPD',
};

export default function PrivacidadPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Política de Privacidad</h1>
        <p className={styles.lastUpdated}>Última actualización: 27 de noviembre de 2025</p>

        <section className={styles.section}>
          <h2>1. Responsable del Tratamiento de Datos</h2>
          <p>
            El responsable del tratamiento de los datos personales recogidos en este sitio web es Germán García,
            con domicilio en Guadalajara, España, y correo electrónico de contacto: contacto@tuhogartech.com.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes tipos de información personal:</p>
          <ul>
            <li><strong>Datos de registro:</strong> Nombre completo, dirección de correo electrónico, contraseña cifrada</li>
            <li><strong>Datos de autenticación OAuth:</strong> Si inicias sesión con Google, recibimos tu nombre y email desde Google</li>
            <li><strong>Datos de navegación:</strong> Productos favoritos, historial de navegación, preferencias de usuario</li>
            <li><strong>Cookies técnicas:</strong> Para mantener tu sesión activa y preferencias del sitio</li>
            <li><strong>Dirección IP y datos de conexión:</strong> Para fines de seguridad y estadísticas de uso</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Base Legal y Finalidad del Tratamiento</h2>
          <p>Tratamos tus datos personales bajo las siguientes bases legales:</p>
          <ul>
            <li><strong>Ejecución de un contrato:</strong> Para proporcionarte acceso a tu cuenta y funcionalidades del sitio</li>
            <li><strong>Consentimiento:</strong> Para envío de newsletters y comunicaciones comerciales (solo si lo autorizas)</li>
            <li><strong>Interés legítimo:</strong> Para análisis estadísticos, mejora del servicio y seguridad</li>
          </ul>
          <p>Utilizamos tu información para:</p>
          <ul>
            <li>Gestionar tu cuenta de usuario y autenticación</li>
            <li>Personalizar tu experiencia en el sitio (productos favoritos, historial)</li>
            <li>Enviarte notificaciones importantes sobre el servicio</li>
            <li>Mejorar nuestros servicios mediante análisis de uso</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Divulgación de Datos a Terceros</h2>
          <p>Tus datos pueden ser compartidos con:</p>
          <ul>
            <li><strong>Supabase (PostgreSQL):</strong> Nuestro proveedor de base de datos y autenticación, ubicado en la UE</li>
            <li><strong>Google OAuth:</strong> Solo si eliges iniciar sesión con Google (reciben confirmación de autenticación)</li>
            <li><strong>Netlify/Vercel:</strong> Nuestro proveedor de hosting y CDN</li>
          </ul>
          <p>
            <strong>No vendemos ni alquilamos</strong> tus datos personales a terceros. Solo compartimos información con proveedores
            de servicios que nos ayudan a operar el sitio, y solo en la medida necesaria.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies y Tecnologías de Seguimiento</h2>
          <p>Utilizamos las siguientes cookies y tecnologías de seguimiento:</p>
          
          <h3 className={styles.subsectionTitle}>5.1. Cookies Propias</h3>
          <ul>
            <li><strong>Cookies técnicas (necesarias):</strong> Para mantener tu sesión iniciada y funcionamiento del sitio</li>
            <li><strong>Cookies de preferencias:</strong> Para recordar tu configuración (tema, idioma, consentimiento de cookies)</li>
          </ul>

          <h3 className={styles.subsectionTitle}>5.2. Cookies de Terceros</h3>
          <ul>
            <li>
              <strong>Google Analytics:</strong> Utilizamos Google Analytics para analizar el uso del sitio web. 
              Esta herramienta utiliza cookies que recopilan información de forma anónima, incluyendo el número de visitantes, 
              las páginas visitadas y el origen del tráfico. Puedes desactivar Google Analytics instalando el 
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer"> complemento de inhabilitación</a>.
            </li>
            <li>
              <strong>Amazon Associates:</strong> Como participante del Programa de Afiliados de Amazon, cuando haces clic en 
              enlaces de productos de Amazon, pueden establecerse cookies de seguimiento de afiliados. Estas cookies ayudan a 
              rastrear las compras realizadas a través de nuestros enlaces. Amazon gestiona estas cookies bajo su propia 
              <a href="https://www.amazon.es/gp/help/customer/display.html?nodeId=201909010" target="_blank" rel="noopener noreferrer"> política de privacidad</a>.
            </li>
          </ul>

          <h3 className={styles.subsectionTitle}>5.3. Control de Cookies</h3>
          <p>
            Puedes aceptar o rechazar las cookies mediante el banner de cookies que aparece al visitar nuestro sitio por primera vez.
            Puedes cambiar tus preferencias en cualquier momento eliminando las cookies desde la configuración de tu navegador.
          </p>
          <p>
            <strong>Nota:</strong> Rechazar las cookies técnicas puede afectar la funcionalidad del sitio, como mantener la sesión iniciada.
          </p>

          <h3 className={styles.subsectionTitle}>5.4. Configuración del Navegador</h3>
          <p>Puedes configurar tu navegador para rechazar cookies:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Programa de Afiliados de Amazon</h2>
          <p>
            Este sitio participa en el Programa de Afiliados de Amazon EU, un programa de publicidad para afiliados diseñado
            para ofrecer comisiones mediante la publicidad y enlaces a Amazon.es y sitios asociados.
          </p>
          <p>
            <strong>Importante:</strong> Amazon puede establecer cookies cuando haces clic en enlaces de afiliados. Estas cookies
            son gestionadas por Amazon bajo su propia política de privacidad. No tenemos acceso a la información personal que
            Amazon pueda recopilar.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Tus Derechos (RGPD)</h2>
          <p>Conforme al Reglamento General de Protección de Datos (RGPD), tienes derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")</li>
            <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado y transferirlos a otro servicio</li>
            <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos en determinadas circunstancias</li>
            <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento de tus datos</li>
            <li><strong>Retirar consentimiento:</strong> En cualquier momento, para tratamientos basados en consentimiento</li>
          </ul>
          <p>
            Para ejercer estos derechos, contacta con nosotros en contacto@tuhogartech.com. Responderemos en un plazo máximo de 30 días.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Seguridad de los Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:</p>
          <ul>
            <li>Contraseñas cifradas con algoritmos seguros (bcrypt)</li>
            <li>Conexiones HTTPS cifradas en todo el sitio</li>
            <li>Acceso restringido a datos personales (solo personal autorizado)</li>
            <li>Copias de seguridad regulares</li>
            <li>Auditorías de seguridad periódicas</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Conservación de Datos</h2>
          <p>
            Conservamos tus datos personales durante el tiempo necesario para cumplir con las finalidades descritas,
            salvo que la ley requiera un período de conservación más largo.
          </p>
          <ul>
            <li><strong>Datos de cuenta activa:</strong> Mientras mantengas tu cuenta</li>
            <li><strong>Datos de cuenta eliminada:</strong> Eliminados inmediatamente, salvo obligación legal de conservación</li>
            <li><strong>Datos analíticos:</strong> Anonimizados después de 24 meses</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>10. Transferencias Internacionales de Datos</h2>
          <p>
            Todos nuestros proveedores de servicios están ubicados en la Unión Europea o cumplen con mecanismos de transferencia
            adecuados aprobados por la Comisión Europea (cláusulas contractuales tipo).
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Menores de Edad</h2>
          <p>
            Este sitio no está dirigido a menores de 16 años. No recopilamos intencionadamente información personal de menores.
            Si eres padre/madre y descubres que tu hijo nos ha proporcionado datos personales, contacta con nosotros para
            que podamos eliminarlos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Cambios en esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos cualquier cambio significativo
            mediante un aviso destacado en el sitio o por correo electrónico. Te recomendamos revisar esta página periódicamente.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Autoridad de Control</h2>
          <p>
            Si consideras que el tratamiento de tus datos personales vulnera la normativa, tienes derecho a presentar una
            reclamación ante la Agencia Española de Protección de Datos (AEPD):
          </p>
          <p>
            <strong>Agencia Española de Protección de Datos (AEPD)</strong><br />
            C/ Jorge Juan, 6<br />
            28001 Madrid<br />
            Web: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>14. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de tus datos personales,
            puedes contactarnos en:
          </p>
          <p>
            <strong>Email:</strong> contacto@tuhogartech.com
          </p>
        </section>
      </div>
    </div>
  );
}

