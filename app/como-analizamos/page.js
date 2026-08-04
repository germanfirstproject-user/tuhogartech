import Link from 'next/link';
import styles from '../aviso-legal/aviso-legal.module.css';

export const metadata = {
  title: 'Cómo analizamos los productos',
  description:
    'Qué hacemos y qué no antes de recomendar un producto: de dónde salen los datos, cómo elegimos qué analizar y cómo nos financiamos. Sin laboratorio y sin fingirlo.',
  alternates: { canonical: 'https://tuhogartech.com/como-analizamos' },
  robots: 'index, follow',
};

// Declara que esta página describe el método editorial del sitio. Es lo que
// respalda la firma de cada artículo, que apunta aquí.
const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Cómo analizamos los productos',
  url: 'https://tuhogartech.com/como-analizamos',
  description:
    'Metodología editorial de Tu Hogar Tech: fuentes de los datos, criterios de selección y modelo de financiación por afiliación.',
  publisher: {
    '@type': 'Organization',
    name: 'Tu Hogar Tech',
    url: 'https://tuhogartech.com',
  },
};

export default function ComoAnalizamosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Cómo analizamos los productos</h1>
          <p className={styles.lastUpdated}>Última actualización: 2 de agosto de 2026</p>

          <section className={styles.section}>
            <h2>1. Lo primero: no tenemos laboratorio</h2>
            <p>
              Conviene empezar por aquí, porque muchas webs de recomendaciones dan a
              entender lo contrario sin llegar a decirlo. <strong>No compramos los
              productos, no los probamos físicamente y no medimos nada en un
              banco de pruebas.</strong> Si en algún artículo lees una cifra, sale de
              la documentación del fabricante o de una fuente que citamos, nunca de
              una medición nuestra.
            </p>
            <p>
              Lo que sí hacemos es el trabajo que haría cualquiera antes de comprar,
              pero hecho con tiempo y sobre decenas de productos a la vez: leerse las
              fichas enteras, comparar especificaciones entre modelos que compiten,
              cruzar lo que dicen las reseñas de quienes ya los usan y señalar cuándo
              una cifra del anuncio no significa lo que parece.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. De dónde salen los datos</h2>
            <ul>
              <li>
                <strong>Especificaciones técnicas:</strong> de la documentación del
                fabricante. Cuando un dato no lo declara, lo decimos con un «no
                declarado» en lugar de rellenarlo con una estimación.
              </li>
              <li>
                <strong>Valoraciones y número de reseñas:</strong> de Amazon, en la
                fecha en que escribimos el artículo. Son datos que cambian, así que
                los tratamos como una foto del momento y no como una verdad
                permanente.
              </li>
              <li>
                <strong>Los problemas recurrentes:</strong> de leer reseñas
                verificadas buscando patrones. Una queja aislada no dice nada;
                la misma queja repetida cientos de veces sí.
              </li>
              <li>
                <strong>El contexto técnico:</strong> normas y documentación pública.
                Cuando explicamos qué es un lumen ANSI o por qué un disco SMR no va
                en un RAID, hablamos de cosas verificables por cualquiera.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Qué miramos que no suele mirarse</h2>
            <p>
              La mayor parte de nuestro trabajo consiste en traducir lo que pone el
              envase a lo que va a pasar en tu casa. En concreto:
            </p>
            <ul>
              <li>
                <strong>Cifras infladas.</strong> Un proyector anunciado con 35.000
                lúmenes tiene unos 300 reales. Un SAI de 700 VA entrega 420 vatios.
                Cuando el número grande del título no es el número que importa, lo
                decimos.
              </li>
              <li>
                <strong>El coste después de la compra.</strong> Rollos, cápsulas,
                película, cartuchos. Hay categorías enteras donde el aparato es lo
                barato y el consumible es el gasto real durante años.
              </li>
              <li>
                <strong>A qué te ata.</strong> Consumibles propietarios, apps que
                pueden dejar de mantenerse, ecosistemas cerrados. Son decisiones que
                se pagan más tarde.
              </li>
              <li>
                <strong>Para quién no es.</strong> Todos los artículos incluyen un
                apartado que explica en qué casos conviene mirar otra cosa. Es la
                parte que menos vende y la que más se agradece.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Cómo elegimos qué analizar</h2>
            <p>
              Partimos de productos que existen en Amazon y que acumulan valoraciones
              suficientes para que la nota signifique algo. Un producto con un 5,0 y
              cuatro reseñas no entra en las listas de mejor valorados: la nota media
              solo es informativa cuando hay volumen detrás.
            </p>
            <p>
              Cuando una comparativa lo necesita, <strong>incluimos modelos que no
              enlazamos</strong>, de marcas que no aparecen en la web. Comparar un
              producto solo consigo mismo no es comparar, y el lector merece ver el
              panorama aunque no nos aporte nada. En esos casos lo indicamos
              expresamente dentro del artículo.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Por qué no verás precios ni disponibilidad</h2>
            <p>
              Los precios de Amazon cambian a diario y la disponibilidad, a cada hora.
              Publicar una copia guardada en nuestra base de datos significaría
              enseñarte un dato que probablemente ya no es cierto, y además las
              condiciones del programa de afiliados exigen que esa información
              proceda de la API de Amazon y se actualice de forma continua.
            </p>
            <p>
              Por eso los hemos retirado de toda la web. El precio y la
              disponibilidad válidos son siempre los que veas en Amazon en el momento
              de mirar.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Cómo nos financiamos</h2>
            <p>
              Tu Hogar Tech participa en el programa de afiliados de Amazon. Cuando
              alguien llega a Amazon desde uno de nuestros enlaces y compra algo,
              recibimos una comisión. <strong>El precio que pagas es exactamente el
              mismo</strong>: la comisión sale del margen de Amazon, no de tu bolsillo.
            </p>
            <p>Lo que ese modelo implica, dicho claramente:</p>
            <ul>
              <li>
                <strong>Ningún fabricante nos paga</strong> por aparecer, por aparecer
                antes que otro ni por escribir en un determinado sentido. No hacemos
                artículos patrocinados.
              </li>
              <li>
                <strong>Ganamos lo mismo</strong> con un producto caro que con uno
                barato en proporción, y nada si recomendamos no comprar. Por eso hay
                artículos que terminan diciendo que la mejor decisión es otra cosa, o
                ninguna.
              </li>
              <li>
                <strong>El sesgo existe igualmente</strong> y sería deshonesto negarlo:
                escribimos sobre productos que se pueden comprar. Lo que puedes
                exigirnos es que, dentro de ese marco, la información sea correcta y
                los inconvenientes estén tan visibles como las ventajas.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Qué hacemos cuando nos equivocamos</h2>
            <p>
              Trabajamos con datos que cambian y con fichas de fabricante que a veces
              contienen errores, así que nos equivocaremos. Cuando ocurra, corregimos
              el artículo y actualizamos su fecha de modificación en lugar de borrarlo
              o de reescribirlo en silencio.
            </p>
            <p>
              Si detectas un dato mal, una recomendación que no se sostiene o un
              enlace que lleva a otro producto, escríbenos y lo revisamos. Tienes la
              dirección de contacto en el{' '}
              <Link href="/aviso-legal">aviso legal</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Quién escribe</h2>
            <p>
              Los artículos los firma <strong>Tu Hogar Tech</strong> como publicación,
              no una persona concreta. No es un equipo de redacción grande ni queremos
              aparentarlo: es un proyecto pequeño e independiente, y nos parece más
              honesto atribuir el contenido al sitio que inventar perfiles de autor.
            </p>
            <p>
              Los datos identificativos del titular, que la legislación española exige
              publicar, están en el <Link href="/aviso-legal">aviso legal</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
