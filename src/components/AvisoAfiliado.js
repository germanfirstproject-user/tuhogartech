import styles from './AvisoAfiliado.module.css';

/**
 * La marca que Amazon exige **junto a cada enlace de afiliado**.
 *
 * Su ayuda oficial pide dos divulgaciones, no una: la declaración global del
 * sitio (que está en el pie y en `AmazonDisclaimer`) y, además, una indicación
 * clara pegada a cada enlace. Lo dice así:
 *
 *   «Una declaración clara puede ser tan simple como "(enlace pagado)", o
 *   "#publicidad", o "#publi", o "#ColaboraciónPagada"»
 *   https://afiliados.amazon.es/help/node/topic/GHQNZAU6669EZS98
 *
 * El texto vive aquí y no suelto en cada plantilla para que sea imposible que
 * un botón nuevo se quede sin él con otra redacción, igual que `AffiliateLink`
 * es el único sitio donde se decide qué es un clic de afiliado. La otra mitad
 * de lo que pide Amazon, la declaración global del sitio, está en
 * `DECLARACION_AFILIADO` (`src/lib/amazon.js`).
 *
 * Va en `--color-text-secondary` y no en el gris tenue del sitio a propósito:
 * el tenue se queda en 3,42:1 sobre el papel y Amazon pide que el aviso se vea
 * «donde el cliente lo note sin tener que buscarlo». Un aviso que no se lee no
 * cumple.
 */
export default function AvisoAfiliado({ className = '', children }) {
  return (
    <p className={`${styles.aviso} ${className}`.trim()}>
      <span className={styles.marca}>Enlace de afiliado.</span>
      {children ? <> {children}</> : ' Si compras desde aquí, el precio no cambia para ti y a nosotros nos ayuda a mantener la web.'}
    </p>
  );
}
