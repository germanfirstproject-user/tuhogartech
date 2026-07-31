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
        <p className={styles.lastUpdated}>Última actualización: 31 de julio de 2026</p>

        <section className={styles.section}>
          <h2>1. Responsable del Tratamiento de Datos</h2>
          <p>
            El responsable del tratamiento de los datos personales recogidos en este sitio web es
            Germán García, con NIF 51758865 y domicilio en Calle Julián Besteiro 11, Guadalajara,
            España, y correo electrónico de contacto: contacto@tuhogartech.com. Puedes consultar
            los datos identificativos completos en el <a href="/aviso-legal">Aviso legal</a>.
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
            <li><strong>Netlify:</strong> Nuestro proveedor de alojamiento y red de distribución de contenidos</li>
            <li><strong>Google Analytics:</strong> Solo si aceptas las cookies de analítica (ver apartados 5 y 10)</li>
          </ul>
          <p>
            <strong>No vendemos ni alquilamos</strong> tus datos personales a terceros. Solo compartimos información con proveedores
            de servicios que nos ayudan a operar el sitio, y solo en la medida necesaria.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies y Tecnologías de Seguimiento</h2>
          <p>Utilizamos las siguientes cookies y tecnologías de seguimiento:</p>
          
          <h3 className={styles.subsectionTitle}>5.1. Cookies necesarias</h3>
          <p>
            Se instalan siempre porque sin ellas el sitio no puede funcionar. No requieren
            consentimiento conforme al artículo 22.2 de la LSSI.
          </p>
          <table className={styles.cookieTable}>
            <thead>
              <tr><th>Nombre</th><th>Titular</th><th>Finalidad</th><th>Duración</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>cookieConsent</td>
                <td>Tu Hogar Tech</td>
                <td>Guardar tu decisión sobre las cookies para no volver a preguntarte</td>
                <td>Almacenamiento local, hasta que lo borres</td>
              </tr>
              <tr>
                <td>sb-access-token, sb-refresh-token</td>
                <td>Supabase</td>
                <td>Mantener tu sesión iniciada si te has registrado</td>
                <td>Sesión / hasta 7 días</td>
              </tr>
              <tr>
                <td>user</td>
                <td>Tu Hogar Tech</td>
                <td>Recordar tus datos de sesión en el navegador</td>
                <td>Almacenamiento local, hasta cerrar sesión</td>
              </tr>
            </tbody>
          </table>

          <h3 className={styles.subsectionTitle}>5.2. Cookies de analítica (requieren tu consentimiento)</h3>
          <p>
            Solo se instalan si las aceptas expresamente. Si las rechazas, el script de
            Google Analytics no llega a cargarse y no se envía ningún dato. Si retiras el
            consentimiento más adelante, se detiene la recogida y se eliminan las cookies
            que hubieran quedado.
          </p>
          <table className={styles.cookieTable}>
            <thead>
              <tr><th>Nombre</th><th>Titular</th><th>Finalidad</th><th>Duración</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Ireland Ltd.</td>
                <td>Distinguir usuarios para elaborar estadísticas de uso</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_ga_&lt;ID&gt;</td>
                <td>Google Ireland Ltd.</td>
                <td>Mantener el estado de la sesión en Google Analytics 4</td>
                <td>2 años</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Importante:</strong> aunque Google Analytics agrega los datos con fines
            estadísticos, la información que trata (identificadores de cookie y dirección IP)
            constituye <strong>dato personal</strong> conforme al RGPD, por lo que no puede
            considerarse anónima. Tenemos activada la anonimización de IP y desactivada
            cualquier finalidad publicitaria o de personalización. El tratamiento implica una
            transferencia internacional a Estados Unidos, descrita en el apartado 10.
          </p>

          <h3 className={styles.subsectionTitle}>5.3. Cookies de afiliación de terceros</h3>
          <p>
            Cuando haces clic en un enlace a Amazon y sales de este sitio, Amazon puede
            instalar sus propias cookies en su dominio para atribuir la posible compra. Ese
            tratamiento se produce ya en Amazon, bajo su{' '}
            <a href="https://www.amazon.es/gp/help/customer/display.html?nodeId=201909010" target="_blank" rel="noopener noreferrer">política de privacidad</a>,
            y queda fuera de nuestro control. Desde este sitio no se instala ninguna cookie
            de Amazon mientras navegas por él.
          </p>

          <h3 className={styles.subsectionTitle}>5.4. Cómo aceptar, rechazar o cambiar de opinión</h3>
          <p>
            La primera vez que visitas el sitio aparece un aviso donde puedes aceptar,
            rechazar o configurar las cookies por categoría. Rechazar es tan sencillo como
            aceptar y no limita ninguna función del sitio.
          </p>
          <p>
            Puedes revisar o retirar tu consentimiento cuando quieras desde el enlace{' '}
            <strong>«Gestionar cookies»</strong> disponible en el pie de página de todas las
            páginas. También puedes eliminar las cookies ya instaladas desde la configuración
            de tu navegador.
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
            La mayoría de nuestros proveedores están ubicados en la Unión Europea. Existe, no
            obstante, una transferencia internacional que conviene que conozcas:
          </p>
          <ul>
            <li>
              <strong>Google Analytics (Google Ireland Ltd.):</strong> aunque el responsable
              contractual está en Irlanda, el tratamiento implica una{' '}
              <strong>transferencia de datos a Estados Unidos</strong> a Google LLC. Dicha
              transferencia se ampara en la decisión de adecuación del Marco de Privacidad de
              Datos UE-EE.&nbsp;UU. (<em>EU-US Data Privacy Framework</em>), al que Google LLC
              está adherida, y de forma complementaria en las cláusulas contractuales tipo
              aprobadas por la Comisión Europea. Esta transferencia{' '}
              <strong>solo se produce si aceptas las cookies de analítica</strong>; si las
              rechazas, no se envía ningún dato a Google.
            </li>
            <li>
              <strong>Supabase:</strong> base de datos y autenticación, con la instancia de
              este proyecto alojada en la Unión Europea.
            </li>
            <li>
              <strong>Netlify:</strong> alojamiento y red de distribución de contenidos. Como
              proveedor estadounidense, cualquier transferencia queda amparada por cláusulas
              contractuales tipo.
            </li>
            <li>
              <strong>Amazon:</strong> si sigues un enlace de afiliado, el tratamiento
              posterior lo realiza Amazon conforme a su propia política.
            </li>
          </ul>
          <p>
            Puedes solicitarnos información adicional sobre estas garantías escribiendo a
            contacto@tuhogartech.com.
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

