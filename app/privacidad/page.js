import styles from './privacidad.module.css';

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos',
};

export default function PrivacidadPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Política de Privacidad</h1>
        <p className={styles.lastUpdated}>Última actualización: Noviembre 2025</p>

        <section className={styles.section}>
          <h2>1. Información que Recopilamos</h2>
          <p>
            Recopilamos información que nos proporcionas directamente cuando te registras en nuestro sitio,
            incluyendo tu dirección de correo electrónico y nombre de usuario.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Uso de la Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Enviarte actualizaciones y comunicaciones relacionadas con el servicio</li>
            <li>Responder a tus comentarios y preguntas</li>
            <li>Personalizar tu experiencia en el sitio</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Compartir Información</h2>
          <p>
            No vendemos, alquilamos ni compartimos tu información personal con terceros para sus propósitos
            de marketing sin tu consentimiento explícito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Cookies y Tecnologías Similares</h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio,
            analizar tendencias y administrar el sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Seguridad</h2>
          <p>
            Implementamos medidas de seguridad diseñadas para proteger tu información personal contra
            acceso no autorizado, alteración, divulgación o destrucción.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Enlaces de Afiliados</h2>
          <p>
            Este sitio participa en programas de afiliados, incluyendo Amazon Associates. Cuando haces clic
            en enlaces de afiliados y realizas una compra, podemos recibir una comisión sin costo adicional
            para ti.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Acceder a tu información personal</li>
            <li>Corregir datos inexactos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Oponerte al procesamiento de tus datos</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios
            significativos publicando la nueva política en esta página.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política de privacidad, por favor contáctanos a través de
            nuestros canales de comunicación disponibles en el sitio.
          </p>
        </section>
      </div>
    </div>
  );
}
