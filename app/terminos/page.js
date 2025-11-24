import styles from './terminos.module.css';

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del sitio',
};

export default function TerminosPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Términos y Condiciones</h1>
        <p className={styles.lastUpdated}>Última actualización: Noviembre 2025</p>

        <section className={styles.section}>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso.
            Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descripción del Servicio</h2>
          <p>
            Este sitio proporciona reseñas, comparativas y recomendaciones de productos. El contenido es de
            carácter informativo y está diseñado para ayudar a los usuarios a tomar decisiones de compra
            informadas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Enlaces de Afiliados</h2>
          <p>
            Este sitio participa en programas de marketing de afiliados, incluyendo el Programa de Asociados
            de Amazon Services LLC. Esto significa que podemos ganar comisiones por compras elegibles
            realizadas a través de enlaces en nuestro sitio.
          </p>
          <p>
            Estas comisiones no afectan el precio que pagas por los productos y nos ayudan a mantener el
            sitio funcionando.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Contenido y Opiniones</h2>
          <p>
            Las reseñas y opiniones expresadas en este sitio son nuestras propias opiniones basadas en
            nuestra investigación y experiencia. No garantizamos que tendrás la misma experiencia con los
            productos reseñados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Exactitud de la Información</h2>
          <p>
            Nos esforzamos por proporcionar información precisa y actualizada. Sin embargo, no podemos
            garantizar que toda la información sea completamente exacta, completa o actual en todo momento.
          </p>
          <p>
            Los precios, disponibilidad y especificaciones de productos pueden cambiar sin previo aviso.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de este sitio, incluyendo textos, imágenes, logos y diseño, está protegido
            por derechos de autor y otras leyes de propiedad intelectual.
          </p>
          <p>
            No puedes copiar, reproducir, distribuir o crear trabajos derivados sin nuestro permiso expreso
            por escrito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Registro de Usuario</h2>
          <p>
            Al crear una cuenta en nuestro sitio, eres responsable de:
          </p>
          <ul>
            <li>Mantener la confidencialidad de tu contraseña</li>
            <li>Todas las actividades que ocurran bajo tu cuenta</li>
            <li>Proporcionar información precisa y actualizada</li>
            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Conducta del Usuario</h2>
          <p>Al utilizar este sitio, aceptas no:</p>
          <ul>
            <li>Violar ninguna ley o regulación aplicable</li>
            <li>Publicar contenido ofensivo, difamatorio o inapropiado</li>
            <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
            <li>Interferir con el funcionamiento del sitio</li>
            <li>Realizar scraping o recopilación automatizada de datos</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Limitación de Responsabilidad</h2>
          <p>
            En la medida máxima permitida por la ley, no seremos responsables por daños indirectos,
            incidentales, especiales, consecuentes o punitivos resultantes de tu uso o imposibilidad de
            usar el sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Enlaces a Terceros</h2>
          <p>
            Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables del
            contenido, políticas de privacidad o prácticas de sitios de terceros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            entrarán en vigor inmediatamente después de su publicación en el sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Terminación</h2>
          <p>
            Podemos suspender o terminar tu acceso al sitio en cualquier momento, sin previo aviso,
            por cualquier motivo, incluyendo el incumplimiento de estos términos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Ley Aplicable</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin
            referencia a sus conflictos de disposiciones legales.
          </p>
        </section>

        <section className={styles.section}>
          <h2>14. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos términos y condiciones, por favor contáctanos a través de
            los canales de comunicación disponibles en el sitio.
          </p>
        </section>
      </div>
    </div>
  );
}
