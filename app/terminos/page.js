import styles from './terminos.module.css';

export const metadata = {
  title: 'Términos y Condiciones - TuHogarTech',
  description: 'Términos y condiciones de uso del sitio web de afiliados',
};

export default function TerminosPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Términos y Condiciones de Uso</h1>
        <p className={styles.lastUpdated}>Última actualización: 27 de noviembre de 2025</p>

        <section className={styles.section}>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar este sitio web (en adelante, "el Sitio"), aceptas estar sujeto a estos Términos y
            Condiciones de Uso, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del
            cumplimiento de las leyes locales aplicables.
          </p>
          <p>
            Si no estás de acuerdo con alguno de estos términos, se te prohíbe usar o acceder a este sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Identificación y Datos de Contacto</h2>
          <p>
            <strong>Titular:</strong> Germán García<br />
            <strong>NIF:</strong> 51758865<br />
            <strong>Domicilio:</strong> Calle Julián Besteiro 11, Guadalajara, España<br />
            <strong>Email de contacto:</strong> contacto@tuhogartech.com
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Objeto y Descripción del Servicio</h2>
          <p>
            Este Sitio web tiene como objeto proporcionar información, reseñas, comparativas y recomendaciones
            sobre productos y servicios de distintas categorías. El contenido es de carácter informativo y educativo,
            diseñado para ayudar a los usuarios a tomar decisiones de compra informadas.
          </p>
          <p>
            <strong>El Sitio NO vende productos directamente.</strong> Actuamos como intermediario informativo,
            proporcionando enlaces a tiendas de terceros donde se pueden adquirir los productos reseñados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Programa de Afiliados y Divulgación de Comisiones</h2>
          <p>
            <strong>IMPORTANTE - DIVULGACIÓN OBLIGATORIA:</strong>
          </p>
          <p>
            Este sitio participa en el <strong>Programa de Afiliados de Amazon EU</strong>, un programa de publicidad
            para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad mediante
            la creación de enlaces a Amazon.es y sitios asociados de Amazon.
          </p>
          <p>
            <strong>Como Asociado de Amazon, ganamos comisiones por compras elegibles</strong> realizadas a través de
            enlaces de afiliados presentes en este sitio. Estas comisiones:
          </p>
          <ul>
            <li><strong>NO incrementan el precio</strong> que pagas por los productos</li>
            <li>Son pagadas directamente por Amazon como compensación por referir clientes</li>
            <li>Nos ayudan a mantener este sitio funcionando y proporcionar contenido de calidad</li>
            <li>No influyen en nuestras reseñas objetivas y honestas</li>
          </ul>
          <p>
            También podemos participar en programas de afiliados de otros comercios y plataformas. Siempre divulgaremos
            claramente cuando un enlace es de afiliado.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Contenido, Reseñas y Opiniones</h2>
          <p>
            Las reseñas, comparativas y opiniones expresadas en este Sitio son:
          </p>
          <ul>
            <li>Nuestras propias opiniones basadas en investigación, análisis y experiencia personal</li>
            <li>De carácter informativo y educativo, no vinculantes</li>
            <li>Realizadas con la mayor objetividad posible, independientemente de comisiones de afiliados</li>
          </ul>
          <p>
            <strong>No garantizamos</strong> que tendrás la misma experiencia con los productos reseñados. Los resultados
            pueden variar según el uso individual, preferencias personales y otros factores.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Exactitud de la Información y Precios</h2>
          <p>
            Nos esforzamos por proporcionar información precisa, actualizada y verificada. Sin embargo:
          </p>
          <ul>
            <li><strong>Los precios de productos</strong> se obtienen automáticamente de las tiendas y pueden cambiar sin previo aviso</li>
            <li><strong>La disponibilidad</strong> de productos puede variar</li>
            <li><strong>Las especificaciones técnicas</strong> pueden ser actualizadas por los fabricantes</li>
            <li><strong>Las imágenes</strong> son ilustrativas y pueden no reflejar la versión exacta del producto</li>
          </ul>
          <p>
            <strong>Te recomendamos verificar</strong> precio, disponibilidad y características en la tienda final antes de realizar
            cualquier compra.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Limitación de Responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley aplicable:
          </p>
          <ul>
            <li>No somos responsables de la calidad, seguridad o legalidad de los productos anunciados</li>
            <li>No somos responsables de las transacciones realizadas entre usuarios y tiendas de terceros</li>
            <li>No garantizamos la disponibilidad, precisión o completitud de la información del Sitio</li>
            <li>No seremos responsables de daños indirectos, incidentales, especiales o consecuentes</li>
            <li>Las compras se realizan bajo los términos y condiciones de la tienda de terceros (Amazon, etc.)</li>
          </ul>
          <p>
            <strong>Para devoluciones, reclamaciones o problemas con productos,</strong> debes contactar directamente
            con la tienda donde realizaste la compra (Amazon, etc.), no con nosotros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Registro de Usuario y Cuenta</h2>
          <p>
            Para acceder a ciertas funcionalidades (guardar favoritos, personalización), puedes crear una cuenta. Al registrarte:
          </p>
          <ul>
            <li>Debes proporcionar información veraz, precisa y actualizada</li>
            <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
            <li>Eres responsable de todas las actividades que ocurran bajo tu cuenta</li>
            <li>Debes notificarnos inmediatamente sobre cualquier uso no autorizado</li>
            <li>No puedes transferir tu cuenta a terceros</li>
          </ul>
          <p>
            Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Conducta Prohibida del Usuario</h2>
          <p>Al utilizar este Sitio, te comprometes a NO:</p>
          <ul>
            <li>Violar ninguna ley o regulación aplicable en España o la UE</li>
            <li>Publicar contenido ofensivo, difamatorio, discriminatorio o ilegal</li>
            <li>Intentar obtener acceso no autorizado a nuestros sistemas o bases de datos</li>
            <li>Realizar scraping, crawling o extracción automatizada de datos sin autorización</li>
            <li>Interferir con el funcionamiento normal del Sitio</li>
            <li>Suplantar la identidad de otra persona o entidad</li>
            <li>Transmitir virus, malware o código malicioso</li>
            <li>Utilizar el Sitio para actividades fraudulentas o comerciales no autorizadas</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>10. Propiedad Intelectual e Industrial</h2>
          <p>
            Todo el contenido de este Sitio (textos, imágenes, logos, diseño, código fuente, estructura, etc.) está
            protegido por derechos de autor y otras leyes de propiedad intelectual.
          </p>
          <p>
            <strong>Todos los derechos están reservados.</strong> No puedes:
          </p>
          <ul>
            <li>Copiar, reproducir o distribuir contenido sin permiso expreso por escrito</li>
            <li>Crear trabajos derivados basados en nuestro contenido</li>
            <li>Usar nuestro contenido con fines comerciales</li>
            <li>Eliminar marcas de agua, avisos de derechos de autor o atribuciones</li>
          </ul>
          <p>
            <strong>Excepciones:</strong> Puedes compartir enlaces a nuestros artículos y citar fragmentos breves
            con atribución adecuada.
          </p>
          <p>
            Las marcas comerciales de terceros (Amazon, marcas de productos) pertenecen a sus respectivos propietarios.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Enlaces a Sitios Web de Terceros</h2>
          <p>
            Este Sitio contiene enlaces a sitios web de terceros (Amazon, fabricantes, etc.). Estos enlaces se proporcionan
            únicamente para tu conveniencia.
          </p>
          <p>
            <strong>No controlamos ni somos responsables</strong> del contenido, políticas de privacidad, prácticas o
            seguridad de sitios web de terceros. El uso de dichos sitios está sujeto a sus propios términos y condiciones.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Modificaciones del Servicio y Términos</h2>
          <p>
            Nos reservamos el derecho de:
          </p>
          <ul>
            <li>Modificar, suspender o discontinuar cualquier parte del Sitio en cualquier momento</li>
            <li>Actualizar estos Términos y Condiciones sin previo aviso</li>
            <li>Cambiar o eliminar contenido del Sitio</li>
          </ul>
          <p>
            Los cambios sustanciales en los Términos se notificarán mediante aviso destacado en el Sitio.
            <strong> El uso continuado del Sitio después de los cambios constituye tu aceptación de los nuevos términos.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Suspensión y Terminación de Acceso</h2>
          <p>
            Podemos suspender o terminar tu acceso al Sitio, inmediatamente y sin previo aviso, por:
          </p>
          <ul>
            <li>Incumplimiento de estos Términos y Condiciones</li>
            <li>Actividad fraudulenta o ilegal</li>
            <li>Solicitud de autoridades competentes</li>
            <li>Cualquier otro motivo que consideremos apropiado</li>
          </ul>
          <p>
            La terminación no afecta derechos y obligaciones acumulados hasta la fecha de terminación.
          </p>
        </section>

        <section className={styles.section}>
          <h2>14. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de <strong>España</strong>.
          </p>
          <p>
            Para la resolución de cualquier controversia derivada de estos Términos, las partes se someten a los
            <strong> Juzgados y Tribunales de [CIUDAD]</strong>, España, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
          </p>
          <p>
            Los consumidores y usuarios pueden acudir a la plataforma de resolución de litigios en línea de la
            Comisión Europea: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>15. Divisibilidad y Renuncia</h2>
          <p>
            Si cualquier disposición de estos Términos se considera inválida o inaplicable, dicha disposición se
            interpretará de manera consistente con la ley aplicable, y las disposiciones restantes permanecerán en pleno vigor.
          </p>
          <p>
            La falta de ejercicio de cualquier derecho bajo estos Términos no constituirá una renuncia a dicho derecho.
          </p>
        </section>

        <section className={styles.section}>
          <h2>16. Información de Contacto</h2>
          <p>
            Para cualquier pregunta, comentario o reclamación relacionada con estos Términos y Condiciones, puedes
            contactarnos en:
          </p>
          <p>
            <strong>Email:</strong> contacto@tuhogartech.com<br />
            <strong>Dirección postal:</strong> Guadalajara, España
          </p>
        </section>

        <section className={styles.section}>
          <h2>17. Aceptación Expresa</h2>
          <p>
            Al utilizar este Sitio, reconoces que has leído, entendido y aceptado estos Términos y Condiciones en su totalidad.
          </p>
        </section>
      </div>
    </div>
  );
}
