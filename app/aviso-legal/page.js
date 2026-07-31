import Link from 'next/link';
import styles from './aviso-legal.module.css';

export const metadata = {
  title: 'Aviso legal',
  description:
    'Información general y datos identificativos del titular de Tu Hogar Tech conforme a la Ley 34/2002 (LSSI-CE).',
  alternates: { canonical: 'https://tuhogartech.com/aviso-legal' },
  robots: 'index, follow',
};

export default function AvisoLegalPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Aviso legal</h1>
        <p className={styles.lastUpdated}>Última actualización: 31 de julio de 2026</p>

        <section className={styles.section}>
          <h2>1. Datos identificativos del titular</h2>
          <p>
            En cumplimiento del deber de información recogido en el artículo 10 de la
            Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
            y de Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
          </p>
          <ul>
            <li><strong>Titular:</strong> Germán García</li>
            <li><strong>NIF:</strong> 51758865</li>
            <li><strong>Domicilio:</strong> Calle Julián Besteiro 11, Guadalajara, España</li>
            <li><strong>Correo electrónico:</strong> contacto@tuhogartech.com</li>
            <li><strong>Sitio web:</strong> https://tuhogartech.com</li>
          </ul>
          <p>
            El titular actúa como persona física. La actividad desarrollada a través de
            este sitio web no requiere inscripción en el Registro Mercantil ni
            autorización administrativa previa, ni se ejerce profesión regulada alguna
            sujeta a colegiación.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Objeto del sitio web</h2>
          <p>
            Tu Hogar Tech es un sitio web de contenido editorial dedicado al análisis y
            la comparación de productos de tecnología para el hogar. Su finalidad es
            informativa y orientativa.
          </p>
          <p>
            <strong>Este sitio no vende productos ni presta servicios de compraventa.</strong>{' '}
            No se tramitan pedidos, cobros, envíos ni devoluciones. Toda transacción se
            realiza en el sitio web del vendedor final, con sus propias condiciones de
            contratación, garantía y derecho de desistimiento.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Programa de afiliados de Amazon</h2>
          <p>
            Tu Hogar Tech participa en el Programa de Afiliados de Amazon EU, un programa
            de publicidad para afiliados diseñado para ofrecer a sitios web un modo de
            obtener comisiones por publicidad, publicitando e incluyendo enlaces a
            Amazon.es y sitios afiliados.
          </p>
          <p>
            Los enlaces a productos que aparecen en este sitio son enlaces de afiliado.
            Si realizas una compra a través de ellos, el titular puede percibir una
            comisión. <strong>El precio que pagas es exactamente el mismo</strong>: la
            comisión la abona Amazon, no el comprador.
          </p>
          <p>
            Esta relación comercial no condiciona el contenido de los análisis. Los
            inconvenientes de cada producto se publican igual que sus ventajas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Precios, disponibilidad y valoraciones</h2>
          <p>
            Los precios, la disponibilidad y las especificaciones mostradas proceden de
            terceros y pueden variar en cualquier momento sin previo aviso. La
            información válida y vinculante es siempre la que figura en la ficha del
            producto en el sitio del vendedor en el momento de la compra.
          </p>
          <p>
            Las valoraciones con estrellas que acompañan a algunos productos proceden de
            las reseñas publicadas por los usuarios en Amazon. No son reseñas recogidas
            por este sitio web ni valoraciones emitidas por el titular.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Propiedad intelectual e industrial</h2>
          <p>
            Los textos, análisis, la estructura del sitio y los elementos gráficos
            propios son titularidad de Germán García o se utilizan con la autorización
            correspondiente, y están protegidos por la normativa de propiedad
            intelectual. Queda prohibida su reproducción, distribución o transformación
            sin autorización expresa.
          </p>
          <p>
            Las marcas, nombres comerciales, logotipos e imágenes de producto que
            aparecen en el sitio pertenecen a sus respectivos titulares. Su uso en este
            sitio se realiza a título meramente identificativo e informativo del
            producto analizado, sin que ello implique relación, patrocinio o
            recomendación por parte de dichos titulares.
          </p>
          <p>
            Si consideras que algún contenido vulnera tus derechos, escribe a{' '}
            contacto@tuhogartech.com y se retirará o corregirá a la mayor brevedad.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Exclusión de responsabilidad</h2>
          <p>
            El titular no garantiza la disponibilidad ininterrumpida del sitio ni la
            ausencia de errores en sus contenidos, aunque se compromete a corregirlos en
            cuanto tenga conocimiento de ellos.
          </p>
          <p>
            El contenido tiene carácter orientativo y no sustituye al asesoramiento
            técnico ni a la documentación oficial del fabricante. La decisión de compra
            y su resultado corresponden exclusivamente al usuario.
          </p>
          <p>
            El sitio contiene enlaces a páginas de terceros. El titular no controla ni se
            responsabiliza de sus contenidos ni de sus políticas de privacidad.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Protección de datos y cookies</h2>
          <p>
            El tratamiento de datos personales se describe en la{' '}
            <Link href="/privacidad">Política de privacidad</Link>, que incluye el
            detalle de las cookies utilizadas y la forma de aceptarlas, rechazarlas o
            retirar el consentimiento en cualquier momento.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Condiciones de uso</h2>
          <p>
            El uso del sitio se rige además por los{' '}
            <Link href="/terminos">Términos y condiciones</Link>. El acceso y la
            navegación implican la aceptación de este aviso legal.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Legislación aplicable y jurisdicción</h2>
          <p>
            Este aviso legal se rige por la legislación española. Para cualquier
            controversia serán competentes los juzgados y tribunales que correspondan
            conforme a la normativa aplicable; cuando el usuario tenga la condición de
            consumidor, los de su lugar de domicilio.
          </p>
          <p>
            La Comisión Europea pone a disposición de los consumidores una plataforma de
            resolución de litigios en línea, accesible en{' '}
            https://ec.europa.eu/consumers/odr.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con este aviso legal:{' '}
            contacto@tuhogartech.com
          </p>
        </section>
      </div>
    </div>
  );
}
